import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Answer, Question } from "@/constants/props";
let refresh = false;
/**
 * Axios interceptor, ktorý zachytí chyby 401 a pokúsi sa obnoviť prístupový token
 * pomocou refresh tokenu uloženého v AsyncStorage. Ak sa obnoví úspešne,
 * pôvodná požiadavka sa zopakuje automaticky.
 */
axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      const response = await axios.post(
        API_URL + "/token/refresh/",
        {
          refresh: refreshToken,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        axios.defaults.headers.common["Authorization"] = `Bearer 
        ${response.data["access"]}`;
        await AsyncStorage.setItem("access_token", response.data.access);
        await AsyncStorage.setItem("refresh_token", response.data.refresh);

        return axios(error.config);
      }
    }
    refresh = false;
    return Promise.reject(error);
  }
);
/**
 * Získa ID aktuálneho používateľa z AsyncStorage.
 * @returns {Promise<string>} - ID používateľa ako string
 */

async function retrieveUserID(): Promise<string> {
  const userID = await AsyncStorage.getItem("user_id");
  return userID!;
}

/**
 * Nahrá novú otázku spolu so zoznamom odpovedí na backend.
 *
 * @param {boolean} is_text_question - Určuje, či ide o textovú otázku.
 * @param {string} question_name - Názov otázky (skrátený question_text).
 * @param {string} question_text - Plné znenie otázky.
 * @param {string} question_okruh - ID okruhu, ku ktorému otázka patrí.
 * @param {Answer[]} answers - Pole odpovedí pre danú otázku.
 *
 * @returns {Promise<void>} - Funkcia nevracia výstup, len vykoná zápis.
 */
async function postQuestionWithAnswers(
  is_text_question: boolean,
  question_name: string,
  question_text: string,
  question_okruh: string,
  answers: Answer[]
) {
  var today = new Date();

  retrieveUserID().then(async (user_id: string) => {
    const question: Question = {
      id: "",
      approved: false,
      created_at: today,
      created_by: user_id,
      is_text_question: is_text_question,
      likes: 0,
      name: question_name,
      okruh: question_okruh,
      text: question_text,
      visible: true,
      ai_context: "",
      reported: false,
    };
    const { data } = await axios.post(API_URL + "/newQuestion/", question, {
      headers: { "Content-Type": "application/json" },
    });

    for (let answer of answers) {
      answer.question = data;
    }
    await axios.post(API_URL + "/newAnswers/", answers, {
      headers: { "Content-Type": "application/json" },
    });
  });
}

export default postQuestionWithAnswers;
