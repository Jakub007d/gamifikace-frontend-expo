import { Okruh } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Načíta detaily okruhu podľa jeho `lecture_id`.
 *
 * @param {string} lecture_id - ID okruhu (prednášky), ktorého detaily sa majú načítať.
 * @returns {Promise<Okruh[]>} Zoznam objektov typu `Okruh`. V prípade chyby vráti prázdne pole.
 *
 * @example
 * const details = await fetchLectureDetails("456");
 */

async function fetchLectureDetails(lecture_id: string): Promise<Okruh[]> {
  try {
    const response = await fetch(
      API_URL + "/lectures/byID?format=json&okruhID=" + lecture_id
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching lecture:", error);
    return [];
  }
}
export default fetchLectureDetails;
