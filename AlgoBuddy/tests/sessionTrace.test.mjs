import assert from "node:assert/strict";
import {
  applySessionEvent,
  canApplyPrivilegedSessionEvent,
  createSessionSnapshot,
} from "../src/lib/collaboration/sessionTrace.js";

const presenterId = "presenter-123";
const attendeeId = "attendee-456";

{
  const snapshot = createSessionSnapshot({ presenterId });

  assert.equal(
    canApplyPrivilegedSessionEvent(snapshot, {
      type: "control:grant",
      senderId: attendeeId,
      payload: { presenterId: attendeeId },
    }),
    false,
  );

  assert.equal(
    canApplyPrivilegedSessionEvent(snapshot, {
      type: "state:update",
      senderId: attendeeId,
      payload: { delta: { step: 9 } },
    }),
    false,
  );

  const next = applySessionEvent(snapshot, {
    type: "control:grant",
    senderId: attendeeId,
    payload: { presenterId: attendeeId },
  });

  assert.equal(next.presenterId, presenterId);
}

{
  const snapshot = createSessionSnapshot({ presenterId: null });

  assert.equal(
    canApplyPrivilegedSessionEvent(snapshot, {
      type: "control:grant",
      senderId: presenterId,
      payload: { presenterId },
    }),
    true,
  );

  const next = applySessionEvent(snapshot, {
    type: "control:grant",
    senderId: presenterId,
    payload: { presenterId },
  });

  assert.equal(next.presenterId, presenterId);
}

console.log("sessionTrace authorization tests passed.");
