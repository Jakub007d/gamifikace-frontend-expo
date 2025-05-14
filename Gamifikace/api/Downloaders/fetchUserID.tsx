import { API_URL } from "../constants";
import axios from "axios";

/**
 * Získa ID používateľa na základe prístupového tokenu (access_token).
 *
 * Odosiela POST požiadavku na endpoint `/userID/` s tokenom v tele žiadosti.
 * Ak je požiadavka úspešná, vráti ID používateľa ako reťazec.
 *
 * @param {String} access_token - Prístupový token používateľa.
 * @returns {Promise<string>} ID používateľa ako string, alebo "ERR" v prípade chyby.
 *
 * @example
 * const userId = await fetchUserID("your_token_here");
 */

async function fetchUserID(access_token: String): Promise<string> {
  try {
    const { data } = await axios.post(API_URL + "/userID/", {
      access_token: access_token,
    });
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return "ERR";
  }
}
export default fetchUserID;
