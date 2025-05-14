import { Answer } from "@/constants/props";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AnswerContentType {
  answers: Answer[];
  addAnswer: (answer: Answer, pos?: number) => void; // Optional `pos`
}

const DataContext = createContext<AnswerContentType | undefined>(undefined);

/**
 * Kontext pre správu odpovedí (Answer[]) v rámci komponentového stromu.
 *
 * Obsahuje:
 * - Pole `answers`: aktuálne pridané odpovede,
 * - Funkciu `addAnswer`: umožňuje pridať alebo nahradiť odpoveď na danú pozíciu.
 *
 * Používateľ môže pomocou `pos` parameter vložiť odpoveď na konkrétnu pozíciu (napr. pre 2-odpoveďové otázky),
 * alebo ju pridať na koniec poľa.
 *
 * @fileoverview Kontextový modul pre prácu s odpoveďami v React Native aplikácii.
 */
export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Funkcia na pridanie jednej odpovede do array
  const addAnswer = (answer: Answer, pos?: number) => {
    if (pos === undefined) {
      setAnswers((prevAnswers) => [...prevAnswers, answer]);
    } else {
      if (answers.length < 2) setAnswers([answer]);
      else if (answers.length == 2) {
        if (pos == 0) {
          setAnswers([answer, answers[1]]);
        } else {
          setAnswers([answers[0], answer]);
        }
      } else {
        var leftSide = answers.slice(0, pos);
        var rightSide = answers.slice(pos + 1);
        setAnswers([...leftSide, answer, ...rightSide]);
      }
    }
  };

  return (
    <DataContext.Provider value={{ answers, addAnswer }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
