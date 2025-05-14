import { Course } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Načíta zoznam kurzov, ktoré navštevuje používateľ so zadaným `userID`.
 *
 * V prípade chyby v sieti alebo odpovedi API sa vráti prázdne pole a chyba sa zaloguje do konzoly.
 *
 * @param {string} userID - ID používateľa, pre ktorého sa majú získať navštevované kurzy.
 * @returns {Promise<Course[]>} Pole objektov typu `Course` alebo prázdne pole pri chybe.
 *
 * @example
 * const courses = await fetchCourseByID("123");
 */

async function fetchCourseByID(userID: string): Promise<Course[]> {
  try {
    const response = await fetch(
      API_URL + "/courses/visited?format=json&user_id=" + userID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
export default fetchCourseByID;
