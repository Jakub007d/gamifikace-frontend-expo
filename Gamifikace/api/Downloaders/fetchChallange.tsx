import { Question } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Načíta otázky pre mód výzva (challenge) podľa ID kurzu.
 *
 * Volá endpoint `/challange/query` s parametrom `courseID` a vráti zoznam otázok.
 *
 * @async
 * @function
 * @param {String} courseID - ID kurzu, pre ktorý sa má načítať výzva.
 * @returns {Promise<Question[]>} Pole otázok (`Question[]`) alebo prázdne pole v prípade chyby.
 *
 * @example
 * const questions = await fetchChallange("42");
 */

async function fetchChallange(courseID: String): Promise<Question[]> {
  try {
    const response = await fetch(
      API_URL + "/challange/query?format=json&courseID=" + courseID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
export default fetchChallange;
