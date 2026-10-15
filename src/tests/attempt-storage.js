/** Browser-local attempt storage. This module never sends results to a server. */
function completionMarker(lang) {
  return { v: 1, phase: 'done', serverSaved: true, lang: lang === 'en' ? 'en' : 'ru' };
}
function existingMarker(storage, key) {
  try {
    const value = JSON.parse(storage.getItem(key));
    return value?.serverSaved === true ? completionMarker(value.lang) : null;
  } catch { return null; }
}

export function saveAttempt(storage, key, state) {
  // A late autosave/pagehide from this or another tab must not restore personal
  // data after successful database persistence has cleared the attempt.
  storage.setItem(key, JSON.stringify(existingMarker(storage, key) || state));
}

/**
 * Cleanup after the MySQL API acknowledgement. Call ONLY after the backend has
 * confirmed a committed database write, never on a click, timeout, network
 * error, merely HTTP 200, or demo completion.
 *
 * The success handler must assign its return value to in-memory state:
 *   S = clearAfterConfirmedDatabaseSave(localStorage, SKEY, S);
 * This replaces personal details, answers and technical metadata with a minimal
 * completion marker, preserving only completion status and interface language.
 * Errors propagate to the caller; failed cleanup must not be reported as done.
 */
export function clearAfterConfirmedDatabaseSave(storage, key, state) {
  const marker = completionMarker(state.lang);
  storage.setItem(key, JSON.stringify(marker));
  return marker;
}
