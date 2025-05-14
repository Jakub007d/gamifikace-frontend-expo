import { Score } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Získa skóre používateľov pre daný kurz.
 *
 * Táto funkcia odosiela GET požiadavku na endpoint `/score/`,
 * pričom filtruje skóre podľa zadaného `courseID`.
 *
 * @param {string} courseID - ID kurzu, pre ktorý sa majú načítať výsledky.
 * @returns {Promise<Score[]>} Pole objektov typu `Score`. Pri chybe vráti prázdne pole.
 *
 * @example
 * const scores = await fetchScore("123"); // Získa skóre pre kurz s ID 123
 */

async function fetchScore(courseID: string): Promise<Score[]> {
  try {
    const response = await fetch(
      API_URL + "/score/?format=json&courseID=" + courseID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching score:", error);
    return [];
  }
}
export default fetchScore;
