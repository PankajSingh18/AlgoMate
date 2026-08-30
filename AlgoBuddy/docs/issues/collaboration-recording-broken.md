## Title

**Collaboration Engine Stale Closures Break Recording, Presenter Handoff, and Cause Duplicate Message Processing / Network Spam**

---

## Description

The real-time collaboration feature (`useCollaboration.js` + `DryRunClient.jsx`) has a **systemic stale closure bug** that makes multiple features completely non-functional or broken. The same root cause — **state variables captured in closures that are never refreshed** — affects recording, presenter handoff, and state synchronization.

---

## Root Cause Analysis

### 1. Recording Feature is Completely Broken (Stale `recording`)

**File:** `app/components/ui/useCollaboration.js`, lines 112–115, 228–249

```javascript
// Line 112 — captures `recording` at render-time, never updates
function recordIfNeeded(event) {
  if (!recording) return;  // <-- STALE: always `false` in captured closure
  setRecordedEvents((current) => [...current, event]);
}

// Line 228 — channel callback captures processEnvelope once in attachSession()
channel.on('broadcast', { event: 'envelope' }, (payload) => {
  processEnvelope(payload.payload);  // <-- captures `recording` at attachSession time
});

// Line 247 — same stale capture in BroadcastChannel
broadcastChannel.onmessage = (event) => processEnvelope(event.data);
```

`processEnvelope` is defined inside the hook and reads `recording` from the render closure. However, `processEnvelope` is passed into `channel.on('broadcast', ...)` and `broadcastChannel.onmessage` only **once** inside `attachSession()`. When the user clicks "Start Recording" (`setRecording(true)`), a new render creates a new `processEnvelope` with `recording = true`, but the **listeners still reference the old one** where `recording = false`.

**Impact:** `recordedEvents` array stays empty forever. The record/export feature produces blank exports. Users cannot save or share their collaborative sessions.

### 2. Stale `presenterId` Causes Wrong Remote State Application After Handoff

**File:** `app/components/ui/useCollaboration.js`, lines 145–155, and `app/visualizer/dry-run/DryRunClient.jsx`, lines 380–409

When a `control:grant` envelope arrives, `processEnvelope` calls `setPresenterId("user-B")` and then **immediately** calls `callbacksRef.current.onRemoteStateDelta(...)`. But `handleRemoteStateDelta` reads `collaboration.presenterId` from the **current render's closure** — which still has the **old** value.

```javascript
// DryRunClient.jsx line 383
function handleRemoteStateDelta(delta) {
  const isPresenter =
    collaboration.presenterId && collaboration.presenterId === collaboration.clientId;
  //                         ^^ STALE: still old presenterId!

  if (!followPresenter && !isPresenter) {
    return;  // Wrongly skips applying delta because old presenterId doesn't match
  }
  // ... apply delta
}
```

**Timeline:**
1. User A (presenter) grants control to User B
2. User B's `processEnvelope` calls `setPresenterId("user-B")` (updates React state)
3. Then calls `handleRemoteStateDelta` synchronously
4. `handleRemoteStateDelta` reads `collaboration.presenterId` from old closure = still `null` or old value
5. `isPresenter` evaluates to `false` → function returns early, **delta is silently dropped**
6. Next render (async, after current call stack) updates `presenterId` — delta is lost

**Impact:** After every presenter handoff, the first state update from the new presenter is silently dropped. This causes 1+ frame of visual desynchronization between participants.

### 3. Dual-Transport Message Duplication (Supabase + BroadcastChannel)

**File:** `app/components/ui/useCollaboration.js`, lines 185–203

Messages are transmitted via THREE paths:
1. **Direct call:** `processEnvelope(envelope)` on line 193 (immediate local processing)
2. **Supabase Realtime:** Channel broadcast on lines 195–199 (with `self: true` on line 226)
3. **BroadcastChannel:** `postMessage` on lines 201–203

Since `self: true` is set on the Supabase channel, the sender receives their **own** message back via Supabase. If BroadcastChannel is also available, the sender receives it a **third** time. The `seenSequencesRef` dedup (lines 120–127) attempts to filter duplicates, but there's a race: `recordIfNeeded` is called on the **first** delivery (line 193), so the event is recorded once. But `recordIfNeeded` is NOT guarded by `seenSequencesRef` — it's called directly, not through the dedup path.

For **remote clients**: Both Supabase and BroadcastChannel deliver the same envelope. The `seenSequencesRef` dedup should catch the second delivery, but in synchronous delivery scenarios (e.g., BroadcastChannel fires before Supabase finishes), the dedup map may not be updated in time.

**Impact:** Duplicate annotations, duplicate state updates, inflated `recordedEvents`, and visual glitches in collaborative editing.

### 4. Re-render Cascade Causes Network Spam

**File:** `app/components/ui/useCollaboration.js`, lines 359–383, and `app/visualizer/dry-run/DryRunClient.jsx`, lines 444–476

`useCollaboration` returns an object where every property is recreated on every render (no `useMemo`, no `useCallback`):

```javascript
return {
  session,            // reference changes if state changed
  connectionStatus,   // new string reference every render
  participants,       // new array every render
  annotations,        // new array every render
  presenterId,        // new string/null reference every render
  recording,          // new boolean every render
  recordedEvents,     // new array every render
  error,              // new string/null every render
  createSession,      // new function every render (no useCallback)
  joinSession,        // new function every render
  // ... all functions and values are new references
};
```

`DryRunClient.jsx` consumes this in a `useEffect` dependency array:

```javascript
useEffect(() => {
  // broadcasts state to all participants
  sendStateRef.current?.({ source, language, step, playing, speed, ... });
}, [
  source, language, step, playing, speed,
  collaboration.session,        // <-- changes every render (new ref)
  collaboration.presenterId,    // <-- changes every render (new ref)
  collaboration.clientId,       // <-- changes every render (new ref)
]);
```

Since `collaboration` is a new object every render, **all** `collaboration.*` destructured values appear "changed". The broadcast `useEffect` fires on **every** re-render, regardless of whether any actual collaboration state changed.

**Impact:** Every keystroke, every click, every animation frame triggers a redundant network broadcast to all session participants. This causes:
- Unnecessary server/Redis load
- Increased bandwidth usage
- Potential rate limiting on Supabase Realtime
- CPU churn on all connected clients processing redundant messages

---

## Files Affected

| File | Lines | Issue |
|------|-------|-------|
| `app/components/ui/useCollaboration.js` | 112–115, 145–155, 185–203, 228–249, 359–383 | Stale closures, dual transport, non-memoized return |
| `app/visualizer/dry-run/DryRunClient.jsx` | 380–409, 444–476 | Stale `presenterId` in remote handler, broad effect deps |
| `app/visualizer/dry-run/page.jsx` | 1–50 | Missing `useVisualizerKeyboard` integration |
| `app/hooks/usePlayback.js` | 15–28 | `pauseResolveRef` called when no promise exists |

---

## Proposed Fix

### Fix 1: Use Refs for Closure-Read State
Replace state-reads with ref-reads in `recordIfNeeded` and all callback-invoked functions:

```javascript
const recordingRef = useRef(recording);
useEffect(() => { recordingRef.current = recording; }, [recording]);

function recordIfNeeded(event) {
  if (!recordingRef.current) return;  // reads from ref, never stale
  setRecordedEvents((current) => [...current, event]);
}
```

Apply the same ref pattern to `presenterId`, `followPresenter`, and any other state read inside callbacks.

### Fix 2: Eliminate Dual-Transport Duplication
Remove `self: true` from the Supabase channel subscription, OR remove the BroadcastChannel path. Pick one transport for remote delivery and only use the direct call for local processing.

### Fix 3: Memoize Hook Return
Wrap the return value of `useCollaboration` in `useMemo`, and wrap all returned functions in `useCallback`:

```javascript
return useMemo(() => ({
  session,
  connectionStatus,
  // ...
  createSession,
  joinSession,
  // ...
}), [
  session, connectionStatus, participants, annotations,
  presenterId, recording, recordedEvents, error,
]);
```

### Fix 4: Narrow Effect Dependencies in DryRunClient
Destructure individual values instead of reading through the `collaboration` object:

```javascript
const { session, presenterId, clientId } = collaboration;

useEffect(() => {
  sendStateRef.current?.({ ... });
}, [source, language, step, playing, speed, session, presenterId, clientId]);
```

### Fix 5: Add Proper Cleanup in `leaveSession`
Reset `seenSequencesRef.current = new Map()` when leaving a session.

### Fix 6: Error Handling for `attachSession`
Don't resolve the promise successfully when the channel subscription fails. Return the error status.

---

## Complexity Estimate

- **Files modified:** 3–4
- **Lines changed:** 150–250
- **Skills required:** React hooks (useRef, useCallback, useMemo, closures), real-time collaboration patterns, concurrency debugging
- **Testing:** Requires testing with 2+ browser windows in a collaboration session to verify message dedup, recording output, and presenter handoff correctness
