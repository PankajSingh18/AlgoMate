// Shared helpers for reading/writing cookie consent preferences.
// Preferences are stored in localStorage so any part of the app
// (including scripts injected in the root layout) can check them.

export const CONSENT_STATUS_KEY = "cookieConsent";
export const CONSENT_PREFERENCES_KEY = "cookiePreferences";
export const CONSENT_UPDATED_EVENT = "cookiePreferencesUpdated";

export const DEFAULT_PREFERENCES = {
    essential: true,
    analytics: false,
    functional: false,
    marketing: false,
};

export function getStoredPreferences() {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    try {
    const raw = window.localStorage.getItem(CONSENT_PREFERENCES_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed, essential: true };
    } catch {
    return DEFAULT_PREFERENCES;
    }
}

export function saveStoredPreferences(preferences) {
    if (typeof window === "undefined") return;
    try {
    window.localStorage.setItem(
    CONSENT_PREFERENCES_KEY,
    JSON.stringify({ ...preferences, essential: true })
    );
    } catch {
    // Storage can be unavailable in private mode or locked-down browsers.
    }
    window.dispatchEvent(new Event(CONSENT_UPDATED_EVENT));
}

export function hasAnalyticsConsent() {
    return getStoredPreferences().analytics === true;
}

export function hasMarketingConsent() {
    return getStoredPreferences().marketing === true;
}

export function hasFunctionalConsent() {
    return getStoredPreferences().functional === true;
}
