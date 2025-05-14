import api from "../api";

/**
 * Načíta zoznam absolvovaných kurzov a ich stav dokončenia pre aktuálneho používateľa.
 *
 * Vykoná GET požiadavku na endpoint `/user/completion/` pomocou `api` klienta.
 *
 * @returns {Promise<any>} Dáta o stave dokončenia kurzov (napr. pole objektov s ID kurzov).
 * @throws {Error} Ak dôjde k chybe počas načítavania údajov.
 *
 * @example
 * const completions = await fetchUserCourseCompletion();
 */

export const fetchUserCourseCompletion = async () => {
  try {
    const response = await api.get("/user/completion/");
    return response.data;
  } catch (error) {
    console.error("Error fetching course completion data:", error);
    throw error;
  }
};
