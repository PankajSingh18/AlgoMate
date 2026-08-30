import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { computeStreak } from "../src/lib/activity.js";

const fixedNow = new Date("2026-06-19T12:00:00Z");

function activity(date, field = "activity_date") {
  return { [field]: `${date}T08:00:00Z` };
}

describe("computeStreak", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("returns 0 for empty input", () => {
    expect(computeStreak([])).toBe(0);
    expect(computeStreak(null)).toBe(0);
  });

  test("counts a single activity today", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    expect(computeStreak([activity("2026-06-19")])).toBe(1);
  });

  test("counts consecutive days ending today", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    expect(
      computeStreak([
        activity("2026-06-19"),
        activity("2026-06-18"),
        activity("2026-06-17"),
      ]),
    ).toBe(3);
  });

  test("counts consecutive days ending yesterday", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    expect(
      computeStreak([
        activity("2026-06-18"),
        activity("2026-06-17"),
        activity("2026-06-16"),
      ]),
    ).toBe(3);
  });

  test("stops counting at the first date gap", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    expect(
      computeStreak([
        activity("2026-06-19"),
        activity("2026-06-18"),
        activity("2026-06-16"),
      ]),
    ).toBe(2);
  });

  test("returns 0 when the last activity is older than yesterday", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    expect(computeStreak([activity("2026-06-17")])).toBe(0);
  });

  test("deduplicates multiple activities on the same day", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    expect(
      computeStreak([
        activity("2026-06-19"),
        activity("2026-06-19"),
        activity("2026-06-18"),
      ]),
    ).toBe(2);
  });

  test("supports created_at when activity_date is absent", () => {
    jest.useFakeTimers().setSystemTime(fixedNow);

    expect(
      computeStreak([
        activity("2026-06-19", "created_at"),
        activity("2026-06-18", "created_at"),
      ]),
    ).toBe(2);
  });
});
