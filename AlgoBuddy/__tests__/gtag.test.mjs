import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { event, GA_MEASUREMENT_ID, pageview } from "../src/lib/gtag.js";

const originalWindow = global.window;

describe("Google Analytics helpers", () => {
  afterEach(() => {
    global.window = originalWindow;
    jest.restoreAllMocks();
  });

  test("pageview sends a config event with the page path", () => {
    const gtag = jest.fn();
    global.window = { gtag };

    pageview("/practice/arrays");

    expect(gtag).toHaveBeenCalledWith("config", GA_MEASUREMENT_ID, {
      page_path: "/practice/arrays",
    });
  });

  test("event sends the expected analytics payload", () => {
    const gtag = jest.fn();
    global.window = { gtag };

    event({
      action: "start_practice",
      category: "practice",
      label: "arrays",
      value: 3,
    });

    expect(gtag).toHaveBeenCalledWith("event", "start_practice", {
      event_category: "practice",
      event_label: "arrays",
      value: 3,
    });
  });

  test("helpers are no-ops when gtag is unavailable", () => {
    global.window = {};

    expect(() => pageview("/dashboard")).not.toThrow();
    expect(() =>
      event({ action: "open_dashboard", category: "navigation" }),
    ).not.toThrow();
  });
});
