import { Question } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Načíta zoznam otázok podľa typu módu (bežný režim alebo výzva).
 *
 * - Ak je `is_challange` `"false"`, získa otázky pre konkrétny okruh (`okruhID`).
 * - Ak je `is_challange` `"true"`, získa otázky pre výzvu v rámci daného kurzu (`courseID`).
 *
 * @param {String} id - ID okruhu alebo kurzu v závislosti od `is_challange`.
 * @param {String} is_challange - Reťazec `"true"` alebo `"false"`, ktorý určuje typ dopytu.
 * @returns {Promise<Question[]>} Pole otázok typu `Question`. Pri chybe vráti prázdne pole.
 *
 * @example
 * const questions = await fetchQuestions("123", "false"); // otázky pre okruh
 * const challengeQuestions = await fetchQuestions("456", "true"); // otázky pre výzvu
 */

async function fetchQuestions(
  id: String,
  is_challange: String
): Promise<Question[]> {
  if (is_challange === "false") {
    try {
      const response = await fetch(
        API_URL + "/question/query?format=json&okruhID=" + id
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  } else {
    try {
      const response = await fetch(
        API_URL + "/challange/query?format=json&courseID=" + id
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }
}
export default fetchQuestions;
