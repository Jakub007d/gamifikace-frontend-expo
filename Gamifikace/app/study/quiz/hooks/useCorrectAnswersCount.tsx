import { useEffect, useState } from "react";
import { Answer } from "@/constants/props";

export const useCorrectAnswersCount = (answers: Answer[] | undefined) => {
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (answers) {
      const count = answers.filter((a) => a.answer_type).length;
      setCorrectCount(count);
    }
  }, [answers]);

  return correctCount;
};
