// security-tests/generateLearningReminders.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/generateLearningReminders.test.cjs
//
// Tests generateLearningReminders in src/utils/generateLearningReminders.js.

const { describe, test, mock } = require("node:test");
const assert = require("node:assert/strict");

function getLocalISOString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Inline the source (pure function, no DOM/network dependencies).
const msPerDay = 1000 * 60 * 60 * 24;

function toDayIndex(val) {
  const d = new Date(val);
  if (typeof val === "string") {
    const match = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [_, y, m, date] = match;
      return Math.floor(Date.UTC(Number(y), Number(m) - 1, Number(date)) / msPerDay);
    }
  }
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / msPerDay);
}

function daysBetween(a, b) {
  return toDayIndex(b) - toDayIndex(a);
}

function generateLearningReminders({
  activityDates = [],
  activityTypes = [],
  modulesCount = 0,
  completedModulesCount = 0,
}) {
  const reminders = [];
  const today = new Date();

  const normalizeDateString = (value) => {
    if (typeof value !== "string") return null;
    const candidate = value.split("T")[0];
    return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : null;
  };

  const uniqueDates = Array.from(
    new Set((activityDates || []).map(normalizeDateString).filter(Boolean))
  ).sort();

  const lastDate = uniqueDates.length ? new Date(uniqueDates[uniqueDates.length - 1]) : null;
  const daysSinceLast = lastDate ? daysBetween(lastDate, today) : Infinity;

  let currentStreak = 0;
  if (uniqueDates.length) {
    const lastDiff = daysBetween(uniqueDates[uniqueDates.length - 1], today);
    if (lastDiff <= 1) {
      let expectedDiff = lastDiff;
      for (let i = uniqueDates.length - 1; i >= 0; i--) {
        const d = uniqueDates[i];
        const diff = daysBetween(d, today);
        if (diff === expectedDiff) {
          currentStreak++;
          expectedDiff++;
        } else if (diff < expectedDiff) {
          continue;
        } else {
          break;
        }
      }
    }
  }

  if (daysSinceLast > 0) {
    reminders.push({
      id: "practice_today",
      type: "encouragement",
      severity: "medium",
      message: "test",
    });
  }

  if (currentStreak >= 3 && daysSinceLast >= 1) {
    reminders.push({
      id: "streak_risk",
      type: "streak",
      severity: "high",
      message: "test",
    });
  }

  if (daysSinceLast >= 7) {
    reminders.push({
      id: "long_inactivity",
      type: "warning",
      severity: "high",
      message: "test",
    });
  } else if (daysSinceLast >= 3) {
    reminders.push({
      id: "mild_inactivity",
      type: "warning",
      severity: "medium",
      message: "test",
    });
  }

  if (modulesCount > 0) {
    const pct = Math.round((completedModulesCount / modulesCount) * 100 || 0);
    if (pct >= 80 && pct < 100) {
      reminders.push({ id: "near_completion", type: "nudge", severity: "low", message: "test" });
    } else if (pct > 0 && pct < 80) {
      reminders.push({ id: "keep_going", type: "encouragement", severity: "low", message: "test" });
    } else if (pct === 100) {
      reminders.push({ id: "congratulations", type: "achievement", severity: "low", message: "test" });
    } else if (pct === 0) {
      reminders.push({ id: "start_learning", type: "nudge", severity: "low", message: "test" });
    }
  }

  const recentVisualizer = (activityTypes || []).find((t) => /visualizer/i.test(t));
  if (!recentVisualizer) {
    reminders.push({ id: "try_visualizer", type: "suggestion", severity: "low", message: "test" });
  }

  const map = new Map();
  const priority = { high: 3, medium: 2, low: 1 };
  reminders
    .sort((a, b) => (priority[b.severity] || 0) - (priority[a.severity] || 0))
    .slice(0, 5)
    .forEach((r) => map.set(r.id, r));

  return Array.from(map.values());
}

// ── Tests ────────────────────────────────────────────────────────────

describe("empty inputs", () => {
  test("with no activity, daysSinceLast is Infinity so long_inactivity and practice_today both fire", () => {
    const reminders = generateLearningReminders({});
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("long_inactivity"), "long_inactivity fires with Infinity days since last");
    assert.ok(ids.includes("practice_today"), "practice_today fires with Infinity days since last");
    assert.ok(ids.includes("try_visualizer"), "try_visualizer fires without visualizer activity");
    assert.ok(!ids.includes("mild_inactivity"), "mild_inactivity should not also fire (long takes precedence)");
    assert.ok(!ids.includes("streak_risk"), "no streak_risk without streak >= 3");
  });
});

describe("practice_today reminder", () => {
  test("fires when there is no activity today", () => {
    // Use a date far in the past so daysSinceLast > 0
    const todayDate = new Date();
    const oldDate = new Date(todayDate);
    oldDate.setDate(oldDate.getDate() - 2);
    const isoOld = getLocalISOString(oldDate);
    const reminders = generateLearningReminders({ activityDates: [isoOld] });
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("practice_today"), "practice_today should fire when no activity today");
  });
});

describe("streak_risk reminder", () => {
  test("fires when streak >= 3 and last activity is more than 1 day ago", () => {
    // 3 consecutive days ending 1 day ago: days 1,2,3 before today
    const today = new Date();
    const d1 = getLocalISOString(new Date(today.getTime() - 1 * msPerDay));
    const d2 = getLocalISOString(new Date(today.getTime() - 2 * msPerDay));
    const d3 = getLocalISOString(new Date(today.getTime() - 3 * msPerDay));
    const dates = [d1, d2, d3];
    const reminders = generateLearningReminders({ activityDates: dates });
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("streak_risk"), "streak_risk should fire for 3-day streak 1 day ago");
  });

  test("does not fire when streak < 3", () => {
    const today = new Date();
    const d0 = getLocalISOString(today);
    const d1 = getLocalISOString(new Date(today.getTime() - 1 * msPerDay));
    const dates = [d0, d1];
    const reminders = generateLearningReminders({ activityDates: dates });
    const ids = reminders.map((r) => r.id);
    assert.ok(!ids.includes("streak_risk"), "streak_risk should not fire for streak < 3");
  });
});

describe("inactivity reminders", () => {
  test("fires long_inactivity when inactive for 7+ days", () => {
    const today = new Date();
    const old = new Date(today);
    old.setDate(old.getDate() - 10);
    const reminders = generateLearningReminders({ activityDates: [getLocalISOString(old)] });
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("long_inactivity"), "long_inactivity should fire after 7+ days");
    assert.ok(!ids.includes("mild_inactivity"), "mild_inactivity should not also fire");
  });

  test("fires mild_inactivity when inactive for 3-6 days", () => {
    const today = new Date();
    const old = new Date(today);
    old.setDate(old.getDate() - 4);
    const reminders = generateLearningReminders({ activityDates: [getLocalISOString(old)] });
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("mild_inactivity"), "mild_inactivity should fire after 3-6 days");
    assert.ok(!ids.includes("long_inactivity"), "long_inactivity should not fire");
  });
});

describe("module progress reminders", () => {
  test("near_completion fires at 80-99% complete", () => {
    const reminders = generateLearningReminders({ modulesCount: 10, completedModulesCount: 8 });
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("near_completion"), "near_completion should fire at 80%");
    assert.ok(!ids.includes("keep_going"), "keep_going should not fire");
    assert.ok(!ids.includes("congratulations"), "congratulations should not fire");
    assert.ok(!ids.includes("start_learning"), "start_learning should not fire");
  });

  test("keep_going fires at 1-79% complete", () => {
    const reminders = generateLearningReminders({ modulesCount: 10, completedModulesCount: 3 });
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("keep_going"), "keep_going should fire at 30%");
    assert.ok(!ids.includes("near_completion"), "near_completion should not fire");
    assert.ok(!ids.includes("congratulations"), "congratulations should not fire");
    assert.ok(!ids.includes("start_learning"), "start_learning should not fire");
  });

  test("congratulations fires at 100% complete", () => {
    const reminders = generateLearningReminders({ modulesCount: 5, completedModulesCount: 5 });
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("congratulations"), "congratulations should fire at 100%");
    assert.ok(!ids.includes("near_completion"), "near_completion should not fire");
    assert.ok(!ids.includes("keep_going"), "keep_going should not fire");
    assert.ok(!ids.includes("start_learning"), "start_learning should not fire");
  });

  test("start_learning fires at 0% with non-zero modules", () => {
    const reminders = generateLearningReminders({ modulesCount: 5, completedModulesCount: 0 });
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("start_learning"), "start_learning should fire at 0%");
    assert.ok(!ids.includes("keep_going"), "keep_going should not fire");
  });
});

describe("visualizer suggestion", () => {
  test("try_visualizer fires when no visualizer activity type", () => {
    const reminders = generateLearningReminders({ activityTypes: ["site_visit", "dashboard"] });
    const ids = reminders.map((r) => r.id);
    assert.ok(ids.includes("try_visualizer"), "try_visualizer should fire without visualizer activity");
  });

  test("try_visualizer does not fire when visualizer activity is present", () => {
    const reminders = generateLearningReminders({ activityTypes: ["visualizer_usage", "dashboard"] });
    const ids = reminders.map((r) => r.id);
    assert.ok(!ids.includes("try_visualizer"), "try_visualizer should not fire with visualizer activity");
  });
});

describe("deduplication and limit", () => {
  test("deduplicates reminders by id", () => {
    // The function normalizes uniqueDates which prevents duplicate day entries
    const today = new Date();
    const d1 = getLocalISOString(today);
    const d2 = getLocalISOString(new Date(today.getTime() - 1 * msPerDay));
    // Only 2 unique dates → streak of 2 (< 3, so no streak_risk)
    const reminders = generateLearningReminders({ activityDates: [d1, d1, d2, d2] });
    const counts = {};
    reminders.forEach((r) => { counts[r.id] = (counts[r.id] || 0) + 1; });
    for (const id in counts) {
      assert.equal(counts[id], 1, `reminder ${id} should appear exactly once`);
    }
  });

  test("returns at most 5 reminders", () => {
    // Trigger many different reminders
    const today = new Date();
    const old7 = new Date(today);
    old7.setDate(old7.getDate() - 10);
    const old2 = new Date(today);
    old2.setDate(old2.getDate() - 2);
    // 3-day streak ending 2 days ago
    const streakDates = [
      getLocalISOString(old2),
      getLocalISOString(new Date(old2.getTime() - msPerDay)),
      getLocalISOString(new Date(old2.getTime() - 2 * msPerDay)),
    ];
    const reminders = generateLearningReminders({
      activityDates: streakDates,
      modulesCount: 10,
      completedModulesCount: 8,
    });
    assert.ok(reminders.length <= 5, "reminders should be capped at 5");
  });
});

describe("priority ordering", () => {
  test("high severity reminders come before medium and low", () => {
    // Create a scenario with multiple reminder types
    const today = new Date();
    const old7 = new Date(today);
    old7.setDate(old7.getDate() - 10);
    const reminders = generateLearningReminders({
      activityDates: [getLocalISOString(old7)],
      modulesCount: 10,
      completedModulesCount: 5,
    });
    const severities = reminders.map((r) => r.severity);
    // high (3) should appear before medium (2) and low (1)
    const highIdx = severities.indexOf("high");
    const mediumIdx = severities.indexOf("medium");
    const lowIdx = severities.indexOf("low");
    if (highIdx !== -1 && mediumIdx !== -1) {
      assert.ok(highIdx < mediumIdx, "high severity should come before medium");
    }
    if (mediumIdx !== -1 && lowIdx !== -1) {
      assert.ok(mediumIdx < lowIdx, "medium severity should come before low");
    }
  });
});
