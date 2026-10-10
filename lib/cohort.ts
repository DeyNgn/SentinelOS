/**
 * Local operations CTA for the live shell.
 *
 * Two placements share this module so the copy and the URL can never drift:
 *  - `CohortModal` — a one-time welcome pop-up on the home screen.
 *  - `CohortBanner` — a permanent footer CTA under every view.
 */

/** Where both placements send people. */
export const COHORT_URL = 'https://deyengineering.com/home';

/** The line that sits at the bottom of every page. */
export const COHORT_CTA =
  'Local SectionOS operations console. Keep this shell aligned with the active operator and mission.';

/** localStorage flag — set once the welcome pop-up has been dismissed. */
export const COHORT_STORAGE_KEY = 'deyengineering-cohort-invite';

/** Value written on dismissal (any non-null value suppresses the pop-up). */
export const COHORT_SEEN = 'seen';

/**
 * The pop-up is a welcome, not a nag: home screen only, and only until it has
 * been dismissed once in this browser.
 */
export function shouldShowCohortModal({
  pathname,
  stored,
}: {
  pathname: string;
  stored: string | null;
}): boolean {
  if (stored) return false;
  const route = pathname.replace(/\/+$/, '');
  return route === '';
}
