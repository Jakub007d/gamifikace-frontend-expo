import axios from "axios";
import { API_URL } from "../constants";
import { useQueryClient } from "@tanstack/react-query";
import { Score_POST } from "@/constants/props";
/**
 * Odosiela skóre používateľa na backend pre daný kurz.
 *
 * Táto funkcia vytvorí POST požiadavku na endpoint `/score/entry`,
 * kde odošle informácie o tom, aké skóre používateľ dosiahol v konkrétnom kurze.
 *
 * @async
 * @function
 * @param {string} courseID - ID kurzu, ku ktorému sa skóre vzťahuje.
 * @param {number} points - Počet bodov, ktoré používateľ dosiahol.
 * @param {string} user_id - ID používateľa, ktorý skóre dosiahol.
 * @returns {Promise<void>} - Funkcia nevracia hodnotu, ale môže vyhodiť výnimku v prípade chyby.
 *
 * @example
 * await ScoreUploader("course123", 85, "user456");
 */
async function ScoreUploader(
  courseID: String,
  points: number,
  user_id: String
) {
  const score: Score_POST = {
    user_id: user_id,
    courseID: courseID,
    point: points,
  }; // Create the POST requuest
  const { data } = await axios.post(API_URL + "/score/entry", score, {
    headers: { "Content-Type": "application/json" },
  });
}

export default ScoreUploader;
