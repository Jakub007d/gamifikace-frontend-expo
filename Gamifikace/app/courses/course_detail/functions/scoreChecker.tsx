import { Score } from "@/constants/props";

/**
 * Skontroluje, či používateľ s daným `user_id` už má záznam vo výsledkoch výzvy (scoreboarde).
 *
 * Používa sa napríklad na zakázanie opätovného spustenia výzvy, ak už bola absolvovaná.
 *
 * @param {Score[]} scores - Pole všetkých výsledkov výzvy pre konkrétny kurz.
 * @param {string} user_id - ID aktuálneho používateľa, ktorý sa overuje.
 * @returns {boolean} - `true` ak používateľ už absolvoval výzvu, inak `false`.
 *
 * @example
 * const hasScore = scoreChecker(scoreboardData, "42");
 * if (hasScore) {
 *   // Zakáž spustenie výzvy
 * }
 */

export function scoreChecker(scores: Score[], user_id: string): boolean {
  const exists = scores.some((score) => String(score.user) === user_id);
  if (exists) {
    return true;
  }
  return false;
}
