import { Answer } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Načíta odpovede pre danú otázku podľa jej ID.
 *
 * Volá endpoint `/answer/query` s parametrom `questionID` na serveri.
 *
 * @async
 * @function
 * @param {String} questionID - ID otázky, pre ktorú chceme získať odpovede.
 * @returns {Promise<Answer[]>} Pole objektov typu `Answer`, alebo prázdne pole v prípade chyby.
 *
 * @example
 * const answers = await fetchAnswers("123");
 */

async function fetchAnswers(questionID: String): Promise<Answer[]> {
  try {
    const response = await fetch(
      API_URL + "/answer/query?format=json&questionID=" + questionID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
export default fetchAnswers;
