import { Course } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Načíta všetky dostupné kurzy zo servera vo formáte JSON.
 *
 * Volá endpoint `/courses/?format=json` na API serveri.
 *
 * @async
 * @function
 * @returns {Promise<Course[]>} Pole objektov typu `Course`, alebo prázdne pole v prípade chyby.
 *
 * @example
 * const courses = await fetchCourses();
 */
async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await fetch(API_URL + "/courses/?format=json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
export default fetchCourses;
