import { useState, useEffect } from "react";
import { Course } from "@/constants/props";
import fetchCourses from "@/api/Downloaders/fetchAllCourses";

/**
 * Hook `useCourseByID` načíta kurz zo zoznamu všetkých kurzov podľa zadaného `courseID`.
 *
 * Používa `fetchCourses()` na získanie všetkých kurzov a nájde zodpovedajúci podľa ID.
 *
 * Funkcie:
 * - Vráti `course` (alebo `null`, ak sa nenašiel),
 * - Nastaví `isLoading` počas fetchovania,
 * - V prípade chyby nastaví `error`.
 *
 * @param {string} courseID - ID kurzu, ktorý chceme načítať.
 * @returns {{
 *   course: Course | null,
 *   isLoading: boolean,
 *   error: Error | null
 * }} Objekt obsahujúci nájdený kurz, stav načítania a prípadnú chybu.
 *
 * @example
 * const { course, isLoading, error } = useCourseByID("123");
 */

export function useCourseByID(courseID: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseID) return;

    const loadCourse = async () => {
      setIsLoading(true);
      try {
        const courses = await fetchCourses();
        const foundCourse = courses.find(
          (c) => String(c.id) === String(courseID)
        );
        if (!foundCourse) {
          throw new Error(`Kurz s ID ${courseID} nebol nájdený`);
        }
        setCourse(foundCourse);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseID]);

  return { course, isLoading, error };
}
