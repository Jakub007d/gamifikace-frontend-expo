import { User } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Načíta údaje používateľa na základe jeho ID.
 *
 * Vykoná GET požiadavku na API endpoint `/user/query?user_id=...`
 * a očakáva zoznam používateľov, zvyčajne s jedným záznamom.
 *
 * @param {String} userID - ID používateľa, pre ktorého sa majú získať údaje.
 * @returns {Promise<User[]>} Pole objektov typu User. Môže byť prázdne, ak sa používateľ nenašiel.
 * @throws {Error} Pri chybe počas volania API.
 *
 * @example
 * const users = await fetchUserData("123");
 * const user = users[0];
 */

async function fetchUserData(userID: String): Promise<User[]> {
  try {
    const response = await fetch(
      API_URL + "/user/query?format=json&user_id=" + userID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
export default fetchUserData;
