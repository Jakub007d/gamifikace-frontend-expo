import axios from "axios";
import { Comment_POST } from "@/constants/props";
import { API_URL } from "../constants";

/**
 * Funkcia na pridanie nového komentára.
 * @param questionID ID otázky
 * @param text Text komentára
 * @param userID ID používateľa
 */
async function addComment(questionID: string, text: string, userID: string) {
  const comment: Comment_POST = {
    user_id: userID,
    question_id: questionID,
    text: text,
  };

  try {
    const response = await axios.post(API_URL + "/comment/add", comment, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      console.log("Komentár bol úspešne pridaný.");
    } else {
      console.error("Komentár sa nepodarilo pridať.");
    }
  } catch (error) {
    console.error("Chyba pri pridávaní komentára:", error);
  }
}

export default addComment;
