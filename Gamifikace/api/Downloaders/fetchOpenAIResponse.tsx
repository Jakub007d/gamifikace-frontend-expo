import axios from "axios";
import { OPENAI_API_KEY } from "../constants";
import { post_ai_context_for_question } from "../Uploaders/addAiContext";

// Definujeme typy podľa štruktúry odpovede OpenAI
interface OpenAIOutputContent {
  type: string;
  text: string;
  annotations: any[];
}

interface OpenAIOutput {
  type: string;
  id: string;
  status: string;
  role: string;
  content: OpenAIOutputContent[];
}

interface OpenAIResponse {
  id: string;
  object: string;
  created_at: number;
  status: string;
  model: string;
  output: OpenAIOutput[];
  usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  error?: { message: string };
}

/**
 * Zavolá OpenAI API (model gpt-4o-mini) na získanie textovej odpovede na zadaný vstup
 * a následne uloží odpoveď ako AI kontext k otázke do databázy.
 *
 * @param {string} input - Textový vstup, ktorý sa odošle do OpenAI API (napr. otázka a odpoveď).
 * @param {string} question_id - ID otázky, ku ktorej sa má priradiť vygenerovaný AI kontext.
 * @returns {Promise<string | null>} Text odpovede vygenerovaný modelom, alebo `null` pri chybe.
 *
 * @example
 * const result = await getOpenAIResponse("Vysvetli význam flex-boxu", "123");
 */

export async function getOpenAIResponse(
  input: string,
  question_id: string
): Promise<string | null> {
  try {
    const response = await axios.post<OpenAIResponse>(
      "https://api.openai.com/v1/responses",
      {
        model: "gpt-4o-mini",
        input: input,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    if (response.data.error) {
      console.error("OpenAI API Error:", response.data.error.message);
      return null;
    }

    const output = response.data.output?.[0]?.content?.[0]?.text || null;
    post_ai_context_for_question(String(output), question_id);
    return output;
  } catch (error: any) {
    console.error(
      "Error fetching OpenAI response:",
      error.response?.data || error.message
    );
    return null;
  }
}
