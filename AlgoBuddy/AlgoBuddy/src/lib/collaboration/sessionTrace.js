export function sanitizeSessionText(text, maxLength = 200) {
  if (typeof text !== "string") return "";
  let clean = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  clean = clean.replace(/<[^>]*>/g, "");
  clean = clean.replace(/\s+/g, " ").trim();
  if (maxLength > 0 && clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  return clean;
}

export function createSessionSnapshot({ presenterId = null } = {}) {
  return {
    presenterId,
    events: [],
    appliedEventIds: new Set(),
  };
}

export function canApplyPrivilegedSessionEvent(snapshot, event) {
  if (!snapshot || !event) return false;
  const privilegedTypes = ["control:grant", "state:update"];
  if (!privilegedTypes.includes(event.type)) return true;
  if (snapshot.presenterId == null) return true;
  return event.senderId === snapshot.presenterId;
}

export function applySessionEvent(snapshot, event) {
  if (!snapshot || !event) return snapshot;
  if (event.id && snapshot.appliedEventIds.has(event.id)) {
    return snapshot;
  }
  if (!canApplyPrivilegedSessionEvent(snapshot, event)) {
    return snapshot;
  }
  const next = {
    ...snapshot,
    events: [...snapshot.events, event],
    appliedEventIds: new Set([...snapshot.appliedEventIds, event.id].filter(Boolean)),
  };
  if (event.type === "control:grant" && event.payload?.presenterId) {
    next.presenterId = event.payload.presenterId;
  }
  return next;
}
