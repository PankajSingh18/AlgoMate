/**
 * Produce motivational reminders from dashboard metrics.
 * The function is intentionally data-driven and returns an array of
 * reminder objects { id, type, message, severity } derived from inputs.
 */
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

export default function generateLearningReminders({
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

  // simple current streak approximation (consecutive days ending today or yesterday)
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
          continue; // Ignore duplicate dates or multiple practices on same day
        } else {
          break; // Gap detected
        }
      }
    }
  }

  // rule: no activity today
  if (daysSinceLast > 0) {
    reminders.push({
      id: "practice_today",
      type: "encouragement",
      severity: "medium",
      message: `🚀 You haven't practiced DSA today — try a short session to keep momentum (last activity ${daysSinceLast === Infinity ? 'ever' : daysSinceLast + ' day' + (daysSinceLast>1?'s':'') + ' ago'}).`,
    });
  }

  // rule: streak at risk (if streak exists and last activity wasn't today)
  if (currentStreak >= 3 && daysSinceLast >= 1) {
    reminders.push({
      id: "streak_risk",
      type: "streak",
      severity: "high",
      message: `🔥 Your ${currentStreak}-day streak is at risk — keep it alive with today's practice!`,
    });
  }

  // rule: inactivity warning
  if (daysSinceLast >= 7) {
    reminders.push({
      id: "long_inactivity",
      type: "warning",
      severity: "high",
      message: `⏳ It's been ${daysSinceLast} days since your last activity — a quick 20‑minute session will get you back on track.`,
    });
  } else if (daysSinceLast >= 3) {
    reminders.push({
      id: "mild_inactivity",
      type: "warning",
      severity: "medium",
      message: `📌 You were last active ${daysSinceLast} day${daysSinceLast>1?'s':''} ago — try a short exercise today.`,
    });
  }

  // rule: progress nudges
  if (modulesCount > 0) {
    const pct = Math.round((completedModulesCount / modulesCount) * 100 || 0);
    if (pct >= 80 && pct < 100) {
      reminders.push({
        id: "near_completion",
        type: "nudge",
        severity: "low",
        message: `🎯 You're ${pct}% through your modules — finish one more to unlock momentum!`,
      });
    } else if (pct > 0 && pct < 80) {
      reminders.push({
        id: "keep_going",
        type: "encouragement",
        severity: "low",
        message: `🏆 Nice progress — ${completedModulesCount}/${modulesCount} modules done. Keep the pace with a focused topic today.`,
      });
    } else if (pct === 100) {
      reminders.push({
        id: "congratulations",
        type: "achievement",
        severity: "low",
        message: `🎉 You've completed all modules — great job! Consider exploring advanced topics or revisiting weak spots.`,
      });
    } else if (pct === 0) {
      reminders.push({
        id: "start_learning",
        type: "nudge",
        severity: "low",
        message: `⚡ Start with one module today — small steps add up.`,
      });
    }
  }

  // rule: recent visualizer usage — encourage variety
  const recentVisualizer = (activityTypes || []).find((t) => /visualizer/i.test(t));
  if (!recentVisualizer) {
    reminders.push({
      id: "try_visualizer",
      type: "suggestion",
      severity: "low",
      message: `⚡ Try exploring a visualizer today to learn by example and speed up understanding.`,
    });
  }

  // de-duplicate by id and return up to 5 reminders (most urgent first)
  const map = new Map();
  const priority = { high: 3, medium: 2, low: 1 };
  reminders
    .sort((a, b) => (priority[b.severity] || 0) - (priority[a.severity] || 0))
    .slice(0, 5)
    .forEach((r) => map.set(r.id, r));

  return Array.from(map.values());
}
