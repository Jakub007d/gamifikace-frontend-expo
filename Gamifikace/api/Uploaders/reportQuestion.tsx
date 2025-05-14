import axios from "axios";
import { API_URL } from "../constants";

/**
 * Nahlási otázku na serveri pomocou PATCH požiadavky.
 *
 * Táto funkcia odošle požiadavku na endpoint `/report-question/` s ID otázky, ktorá má byť nahlásená.
 * Očakáva sa, že server spracuje nahlásenie a vráti HTTP 200 ak bolo úspešné.
 *
 * @async
 * @function
 * @param {string} question_id - ID otázky, ktorá sa má nahlásiť.
 * @returns {Promise<boolean>} - `true`, ak bolo nahlásenie úspešné (status 200), inak `false`.
 *
 * @example
 * const success = await report_question("abc123");
 * if (success) {
 *   console.log("Otázka bola úspešne nahlásená.");
 * } else {
 *   console.log("Nahlásenie zlyhalo.");
 * }
 */

export async function report_question(question_id: string): Promise<boolean> {
  try {
    const response = await axios.patch(
      `${API_URL}/report-question/`,
      { questionID: question_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
}
export default report_question;
