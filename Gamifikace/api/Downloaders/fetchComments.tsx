import { Comment } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Načíta komentáre pre danú otázku podľa `questionID`.
 *
 * Volá endpoint `/comment/query` s parametrom `questionID` a vráti pole komentárov.
 *
 * @async
 * @function
 * @param {String} questionID - ID otázky, ku ktorej sa majú získať komentáre.
 * @returns {Promise<Comment[]>} Pole komentárov (`Comment[]`) alebo prázdne pole v prípade chyby.
 *
 * @example
 * const comments = await fetchComments("123");
 */

async function fetchComments(questionID: String): Promise<Comment[]> {
  try {
    const response = await fetch(
      API_URL + "/comment/query?format=json&questionID=" + questionID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
export default fetchComments;
