// Answers given before signing in are kept here, so they survive the redirect
// to Google, Apple or Facebook and can be saved to the account once it exists.
const KEY = "pomi_onboarding_draft";

// A draft only belongs to the sign-in that immediately follows it: it expires so
// a shared device never offers one person's answers to the next account.
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function readOnboardingDraft() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft?.saved_at || Date.now() - draft.saved_at > MAX_AGE_MS) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function writeOnboardingDraft(draft) {
  window.localStorage.setItem(
    KEY,
    JSON.stringify({ ...draft, saved_at: Date.now() })
  );
}

export function clearOnboardingDraft() {
  window.localStorage.removeItem(KEY);
}