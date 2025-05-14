import { Okruh } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Načíta všetky okruhy priradené ku konkrétnemu predmetu.
 *
 * @param {string} courseID - ID predmetu, pre ktorý sa majú získať okruhy.
 * @returns {Promise<Okruh[]>} Pole objektov typu `Okruh`. V prípade chyby sa vráti prázdne pole.
 *
 * @example
 * const okruhy = await fetchLecturesForCourse("123");
 */

async function fetchLecturesForCourse(courseID: String): Promise<Okruh[]> {
  try {
    const response = await fetch(
      API_URL + "/lectures/query?format=json&courseID=" + courseID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
export default fetchLecturesForCourse;
