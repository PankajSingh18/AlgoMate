import { createCollaborationSession, listCollaborationSessions } from '../src/lib/collaboration/sessionStore.js';

async function test() {
  console.log("Setting up sessions...");
  for (let i = 0; i < 5; i++) {
    await createCollaborationSession({ title: `Pub ${i}`, visibility: 'public' });
  }
  for (let i = 0; i < 2; i++) {
    await createCollaborationSession({ title: `Priv ${i}`, visibility: 'private' });
  }
  for (let i = 5; i < 10; i++) {
    await createCollaborationSession({ title: `Pub ${i}`, visibility: 'public' });
  }

  console.log("\nTesting pagination...");
  let cursor = null;
  let allSessions = [];
  let pageCount = 0;

  do {
    const res = await listCollaborationSessions({ limit: 4, cursor });
    console.log(`Page ${++pageCount} returned ${res.sessions.length} sessions. Next cursor: ${res.nextCursor}`);
    for (const s of res.sessions) {
      console.log(`  - ${s.title}`);
    }
    allSessions.push(...res.sessions);
    cursor = res.nextCursor;
  } while (cursor);

  console.log(`\nTotal public sessions retrieved: ${allSessions.length}`);
  if (allSessions.length === 10) {
    console.log("SUCCESS: Pagination retrieved all public sessions without skipping.");
  } else {
    console.error("FAILED: Did not retrieve exactly 10 public sessions.");
  }
}

test().catch(console.error);
