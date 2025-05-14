import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Answer, Question } from "@/constants/props";

let refresh = false;

/**
 * Aktualizuje AI kontext danej otázky na serveri.
 *
 * Táto funkcia načíta access token z AsyncStorage a vykoná PATCH požiadavku
 * na endpoint, ktorý aktualizuje `ai_context` pre otázku so zadaným `question_id`.
 *
 * Používa autentifikáciu cez Bearer token. V prípade chýb (napr. neprítomný token) sa chyba zaloguje.
 *
 * @async
 * @function
 * @param {string} ai_context - Nový AI kontext, ktorý sa má priradiť otázke.
 * @param {string} question_id - ID otázky, pre ktorú sa AI kontext aktualizuje.
 *
 * @returns {Promise<void>} Funkcia nevracia hodnotu, ale môže zalogovať chybu pri zlyhaní.
 *
 * @example
 * await post_ai_context_for_question("Toto je nový AI kontext", "42");
 */

axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;
      const response = await axios.post(
        API_URL + "/token/refresh/",
        {
          refresh: localStorage.getItem("refresh_token"),
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data["access"]}`;
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        return axios(error.config);
      }
    }
    refresh = false;
    return Promise.reject(error);
  }
);

// Funkcia pre načítanie access tokenu
async function retrieveAccessToken(): Promise<string | null> {
  const accessToken = await AsyncStorage.getItem("access_token");
  return accessToken;
}

/**
 * Funkcia na aktualizáciu AI kontextu k otázke
 * @param {string} ai_context - nový AI kontext, ktorý sa má priradiť k otázke
 * @param {string} question_id - ID otázky, pre ktorú aktualizujeme AI kontext
 */
async function post_ai_context_for_question(
  ai_context: string,
  question_id: string
) {
  try {
    // Získajte access token
    const access_token = await retrieveAccessToken();
    if (!access_token) {
      console.error("No user ID found in AsyncStorage");
      return; // Ukončite funkciu, ak neexistuje žiadny ID používateľa
    }

    // Odosielanie požiadavky na server
    const { data } = await axios.patch(
      `${API_URL}/questions/${question_id}/update-ai-context/`, // Používame šablónu reťazca pre lepšiu čitateľnosť
      { ai_context }, // Obohatenie ai_context v objekte
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`, // Ak potrebujete autentifikáciu
        },
      }
    );
  } catch (error) {
    console.error("Error updating AI context:", error); // Správne spracovanie chýb
  }
}

export { post_ai_context_for_question };
