import { Answer } from "@/constants/props";

/**
 * Funkcia `getCorrectAnswers` vráti texty všetkých správnych odpovedí z poľa `Answer` objektov.
 *
 * Používa sa na zobrazenie alebo porovnanie správnych odpovedí pri vyhodnocovaní kvízov alebo výziev.
 *
 * @param {Answer[]} answers - Pole objektov typu `Answer`, ktoré obsahuje všetky možné odpovede k otázke.
 *
 * @returns {string[]} Pole textov odpovedí, ktoré sú označené ako správne (`answer_type === true`).
 *
 * @example
 * const corrects = getCorrectAnswers([
 *   { text: "Paríž", answer_type: true, ... },
 *   { text: "Londýn", answer_type: false, ... },
 * ]);
 * // Výstup: ["Paríž"]
 */

export function getCorrectAnswers(answers: Answer[]): string[] {
  return answers!
    .filter((answer: Answer) => answer.answer_type === true) // Filtruje správne odpovede
    .map((answer: Answer) => answer.text); // Extrahuje text správnych odpovedí
}
