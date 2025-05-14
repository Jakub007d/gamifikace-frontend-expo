import { API_URL } from "../constants";
import { Achievement } from "@/constants/props";

/**
 * Získa zoznam dosiahnutých úspechov (achievements) pre konkrétneho používateľa.
 *
 * Odosiela GET požiadavku na endpoint `/user/{userId}/achievements/`
 * a očakáva späť pole objektov typu `Achievement`.
 *
 * @param {string} userId - ID používateľa, pre ktorého sa načítavajú úspechy.
 * @returns {Promise<Achievement[]>} Pole objektov typu `Achievement`. Pri chybe vráti prázdne pole.
 *
 * @example
 * const achievements = await fetchAchievements("42");
 */

async function fetchAchievements(userId: string): Promise<Achievement[]> {
  try {
    const response = await fetch(
      API_URL + "/user/" + userId + "/achievements/?format=json"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Achivements:", error);
    return [];
  }
}
export default fetchAchievements;
