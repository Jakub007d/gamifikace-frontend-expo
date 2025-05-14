import { Answer } from "@/constants/props";
/**
 * Funkcia `handleAnswerColor` určuje farbu pozadia pre zobrazenie odpovede v kvíze
 * na základe toho, či boli odpovede odoslané a či bola odpoveď správna alebo zvolená.
 *
 * Pravidlá farieb:
 * - Zvolená správna odpoveď: zelená `#28a745`
 * - Nezvolená správna odpoveď: oranžová `#FFA500`
 * - Zvolená nesprávna odpoveď: červená `#FF0000`
 * @param {Answer} answer - Odpoveď, pre ktorú sa má určiť farba.
 * @param {boolean} answers_sent - Indikuje, či boli odpovede už odoslané.
 * @param {Answer[]} selectedAnswers - Pole odpovedí, ktoré používateľ vybral.
 *
 * @returns {string | undefined} Farba v HEX formáte podľa logiky výberu alebo `undefined`, ak sa nehodí žiadna.
 *
 * @example
 * const color = handleAnswerColor(answer, true, selectedAnswers);
 * // Výstup: "#28a745" ak bola správna a zvolená
 */

export function handleAnswerColor(
  answer: Answer,
  answers_sent: boolean,
  selectedAnswers: Answer[]
): string | undefined {
  if (answers_sent) {
    if (
      answer.answer_type == true &&
      selectedAnswers.some((selected) => selected.id === answer.id)
    ) {
      return "#28a745";
    }
    if (
      answer.answer_type == true &&
      !selectedAnswers.some((selected) => selected.id === answer.id)
    ) {
      return "#FFA500"; // Oranžová pre spravnu nezvolenú odpoveď
    }
    if (
      answer.answer_type == false &&
      selectedAnswers.some((selected) => selected.id === answer.id)
    ) {
      return "#FF0000"; // Červená pre nesprávnu zvolenú odpoveď
    }
  } else {
    return selectedAnswers.some((selected) => selected.id === answer.id)
      ? "#33CC33" // Zelena pre zvolenu spravnu odpoved
      : "#00bcd4";
  }
}
