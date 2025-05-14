import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants";
import { Visited_POST } from "@/constants/props";

/**
 * Odstraňuje kurz zo zoznamu navštevovaných kurzov daného používateľa.
 *
 * Funkcia odosiela POST požiadavku na endpoint `/visited/remove` s informáciou o používateľovi a kurze.
 * Po úspešnom odstránení invaliduje cache v React Query pre kľúč `["userCourses"]`.
 *
 * @async
 * @param {string} userID - ID používateľa.
 * @param {string} courseID - ID kurzu, ktorý sa má odstrániť zo zoznamu navštevovaných.
 * @param {QueryClient} queryClient - Inštancia QueryClient na zneplatnenie cache.
 *
 * @returns {Promise<void>} - Funkcia nevracia hodnotu, ale zabezpečuje zneplatnenie cache.
 *
 * @example
 * await removeVisitedCourse("123", "456", queryClient);
 */

async function removeVisitedCourse(
  userID: string,
  courseID: string,
  queryClient: QueryClient
) {
  const visited: Visited_POST = {
    userID: userID,
    courseID: courseID,
  };
  axios
    .post(API_URL + "/visited/remove", visited, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      queryClient.invalidateQueries({
        queryKey: ["userCourses"],
      });
    });
}
export default removeVisitedCourse;
