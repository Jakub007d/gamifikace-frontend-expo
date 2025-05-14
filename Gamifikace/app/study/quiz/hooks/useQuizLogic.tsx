import { useState } from "react";
import { Answer } from "@/constants/props";

export function useQuizLogic() {
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);

  const toggleSingleAnswer = (answer: Answer) => {
    setSelectedAnswers((prev) =>
      prev.some((a) => a.id === answer.id) ? [] : [answer]
    );
  };

  const toggleMultipleAnswers = (answer: Answer) => {
    setSelectedAnswers((prev) =>
      prev.some((a) => a.id === answer.id)
        ? prev.filter((a) => a.id !== answer.id)
        : [...prev, answer]
    );
  };

  const resetAnswers = () => setSelectedAnswers([]);

  return {
    selectedAnswers,
    toggleSingleAnswer,
    toggleMultipleAnswers,
    resetAnswers,
  };
}
