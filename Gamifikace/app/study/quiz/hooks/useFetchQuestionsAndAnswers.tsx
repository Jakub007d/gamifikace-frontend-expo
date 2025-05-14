import fetchAnswers from "@/api/Downloaders/fetchAnswers";
import fetchQuestions from "@/api/Downloaders/fetchQuestions";
import { useQuery } from "@tanstack/react-query";

export const useFetchQuestionsAndAnswers = (
  id: string,
  is_challange: string,
  question_position: number
) => {
  const { data: questions = [], status: questionsStatus } = useQuery({
    queryKey: ["questions", id, is_challange],
    enabled: !!id,
    queryFn: () => fetchQuestions(id, is_challange),
  });
  const { data: answers = [], status: answerStatus } = useQuery({
    queryKey: ["answers", questions?.[question_position]?.id],
    enabled: !!questions?.[question_position],
    queryFn: () => fetchAnswers(questions[question_position].id),
  });

  return { questions, answers, questionsStatus, answerStatus };
};
