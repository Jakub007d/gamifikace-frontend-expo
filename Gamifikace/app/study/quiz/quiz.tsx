import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Answer, SavedQuestion } from "@/constants/props";
import { Center } from "@/components/ui/center";
import { StudyCardWindow } from "../components/StudyWindow";
import ScoreUploader from "@/api/Uploaders/scoreUploader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnswerOptionButton from "@/components/custom/customButtons/AnswerOptionButton";
import FullNavigationButton from "@/components/custom/customButtons/fullNavigationButton";
import { useQuizLogic } from "./hooks/useQuizLogic";
import { useQuizTimer } from "./hooks/useQuizTimer";
import { useUserId } from "@/app/hooks/useUserId";
import { useFetchQuestionsAndAnswers } from "./hooks/useFetchQuestionsAndAnswers";
import { useAnswerFeedback } from "./hooks/useAnswerFeedback";
import { useNavigationHeader } from "./hooks/useNavigationHeader";
import { useCorrectAnswersCount } from "./hooks/useCorrectAnswersCount";
import { handleAnswerColor } from "./functions/handleAnswerColor";
import { getCorrectAnswers } from "./functions/getCorrectAnswers";

/**
 * @screen
 * @component
 * Obrazovka pre vykonanie kvízu alebo výzvy (QuizView).
 *
 *  Navigovateľná stránka v prostredí Expo Router, slúžiaca na zobrazovanie otázok,
 * zaznamenávanie odpovedí, vyhodnocovanie výsledkov a odosielanie skóre.
 *
 * Funkcie:
 * - Načíta otázky a odpovede pomocou custom hookov: `useFetchQuestionsAndAnswers`, `useQuizLogic`.
 * - Zobrazuje otázky v komponentoch `StudyCardWindow` a odpovede cez `AnswerOptionButton`.
 * - Rozlišuje medzi výberovými a textovými odpoveďami.
 * - Vyhodnocuje odpovede: správne odpovede zafarbí (zelená/oranžová/červená) a prehrá zvukovú spätnú väzbu.
 * - Po dokončení kvízu alebo výzvy naviguje na obrazovku `SumaryView` a odosiela výsledné skóre cez  `ScoreUploader` na backend.
 * - Používa `AsyncStorage` uloženie odpovedí a výsledkov (`saved_questions`) z ktorého sa následne načítajú v rámci answeredQuestionsDetail obrazovky.
 * - Sleduje čas výzvy pomocou hooku `useQuizTimer`.
 * - Pri opustení obrazovky pred ukončením výzvy odošle skóre s hodnotou 0.
 *
 * Navigácia:
 * - Vstupné parametre cez `useLocalSearchParams`: `id`, `is_challange`, `course_id`.
 * - Navigácia pomocou `router.replace()` po ukončení testu.
 *
 * Rozhranie odpovedí:
 * - Jedna správna odpoveď: prepína sa výberová logika.
 * - Viac správnych odpovedí: umožňuje multi-select.
 * - Textová odpoveď: porovnávanie bez ohľadu na veľkosť písmen (`.trim().toUpperCase()`).
 *
 * Použité hooky:
 * - `useQuizLogic`, `useQuizTimer`, `useFetchQuestionsAndAnswers`, `useCorrectAnswersCount`,
 * - `useAnswerFeedback`, `useUserId`, `useNavigationHeader`
 *
 * @fileoverview Expo Router stránka TSX zobrazujúca interaktívny kvíz.
 *
 *
 * @example
 * router.push({
 *   pathname: "/study/quiz/QuizView",
 *   params: { id: "123", is_challange: "true", course_id: "456" }
 * });
 *
 * @returns {JSX.Element} Interaktívna kvízová stránka s otázkami, odpoveďami, spätnou väzbou a navigáciou na súhrn.
 */

const QuizView = () => {
  const {
    selectedAnswers,
    toggleSingleAnswer,
    toggleMultipleAnswers,
    resetAnswers,
  } = useQuizLogic();
  const [running, setRunning] = useState(true);
  const user_id = useUserId();
  const [question_position, setPosition] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [answers_sent, setAnswersSent] = useState(false);
  const { id, is_challange, course_id } = useLocalSearchParams();
  const { seconds, setSeconds } = useQuizTimer(running, String(is_challange));
  const [score, setScore] = useState(0);
  const [bad, setBad] = useState(0);
  const [bad_index, setBadIndex] = useState<String[]>([]);
  const [correct_answers, setCorrectAnswers] = useState(0);
  const [answer_text, setAnswerText] = useState("");
  const [saved_questions, setSavedQuestion] = useState<SavedQuestion[]>([]);
  const { questions, answers, questionsStatus, answerStatus } =
    useFetchQuestionsAndAnswers(
      String(id),
      String(is_challange),
      question_position
    );
  const { playCorrect, playIncorrect } = useAnswerFeedback();
  useNavigationHeader({
    is_challange: String(is_challange),
  });
  const correctAnswerCount = useCorrectAnswersCount(answers);
  const handleNextOrValidate = async () => {
    if (!answers_sent) {
      const newSavedQuestion: SavedQuestion = {
        question: questions![question_position],
        answers: answers!,
        selectedAnswers: selectedAnswers,
      };

      validateSelectedAnswers(); // validácia odpovede
      setSavedQuestion((prev) => {
        const alreadySaved = prev.some(
          (item) => item.question.id === newSavedQuestion.question.id
        );

        if (alreadySaved) return prev; // neukladaj znovu

        return [...prev, newSavedQuestion];
      });
      return;
    }

    if (question_position + 1 < questions!.length) {
      setPosition(question_position + 1);

      resetAnswers();
      setAnswerText("");
      setAnswersSent(false);
    } else {
      setRunning(false);
      setIsQuizFinished(true);
      const finalScore = (score * 100) / seconds;
      await AsyncStorage.setItem(
        "saved_questions",
        JSON.stringify(saved_questions)
      );
      if (String(is_challange) === "true" && user_id) {
        ScoreUploader(String(id), finalScore, String(user_id));
      }
      router.replace({
        pathname: "/summary/sumaryView",
        params: {
          score: finalScore.toString(),
          bad: bad,
          id: id,
          bad_index: String(bad_index),
          is_challange: is_challange,
          time: seconds,
          course_id: course_id,
          correct_answers: correct_answers,
        },
      });
    }
  };
  const handleTextAnswerNextOrValidate = async () => {
    const newSavedQuestion: SavedQuestion = {
      question: questions![question_position],
      answers: answers!,
      selectedAnswers: [
        {
          id: answers![0].id,
          text: answer_text,
          answer_type: true,
          question: answers![0].question,
        },
      ],
    };
    setSavedQuestion((prev) => {
      const alreadySaved = prev.some(
        (item) => item.question.id === newSavedQuestion.question.id
      );

      if (alreadySaved) return prev; // neukladaj znovu

      return [...prev, newSavedQuestion];
    });
    if (!answers_sent) {
      handleTextAnswer(answers![0].text, answer_text);
      setAnswersSent(true);
      return;
    }

    if (question_position + 1 < questions!.length) {
      setPosition(question_position + 1);
      resetAnswers();
      setAnswerText("");
      setAnswersSent(false);
    } else {
      setRunning(false);
      setIsQuizFinished(true);
      const finalScore = (score * 100) / seconds;
      if (String(is_challange) === "true" && user_id) {
        ScoreUploader(String(id), finalScore, String(user_id));
      }
      await AsyncStorage.setItem(
        "saved_questions",
        JSON.stringify(saved_questions)
      );
      router.replace({
        pathname: "/summary/sumaryView",
        params: {
          score: finalScore.toString(),
          bad: bad,
          id: id,
          bad_index: String(bad_index),
          is_challange: is_challange,
          time: seconds,
          course_id: course_id,
          correct_answers: correct_answers,
        },
      });
    }
  };
  useEffect(() => {
    if (answers) {
      let correct = 0;
      answers.forEach((answer) => {
        if (answer.answer_type == true) {
          correct += 1;
          setCorrectAnswers(correct_answers + 1);
        }
      });
      setCorrectAnswers(correct);
    }
  }, [answers]);
  //Pri opusteni obrazovky sa ulozi skore do databazy
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (String(is_challange) === "true" && user_id) {
          if (!isQuizFinished) {
            ScoreUploader(String(id), 0, user_id);
          }
        }
      };
    }, [isQuizFinished])
  );
  const handleToggleAnswer = (answer: Answer) => {
    if (correctAnswerCount === 1) {
      toggleSingleAnswer(answer);
    } else {
      toggleMultipleAnswers(answer);
    }
  };
  async function validateSelectedAnswers() {
    var correctSelectedAnswers = 0;
    var corectAnswers = 0;

    if (selectedAnswers.length == 0) {
      setBad((prev) => prev + 1);
      setBadIndex((prevBadIndex) =>
        prevBadIndex.includes(String(question_position))
          ? prevBadIndex
          : [...prevBadIndex, String(question_position)]
      );
      await playIncorrect();
      setAnswersSent(true);

      return;
    }

    selectedAnswers.forEach((answer) => {
      if (answer.answer_type) {
        correctSelectedAnswers += 1;
      } else {
        setBad((prev) => prev + 1);
        setBadIndex((prevBadIndex) =>
          prevBadIndex.includes(String(question_position))
            ? prevBadIndex
            : [...prevBadIndex, String(question_position)]
        );
      }
    });

    answers?.slice(0, 4).forEach((answer) => {
      if (answer.answer_type) {
        corectAnswers += 1;
      }
    });
    if (
      corectAnswers > 0 &&
      correctSelectedAnswers === corectAnswers &&
      selectedAnswers.length === corectAnswers
    ) {
      await playCorrect();
      setScore((prev) => prev + 1);
    } else {
      await playIncorrect();
    }
    setAnswersSent(true);
  }

  async function handleTextAnswer(answer: string, input: string) {
    if (input.trim().toUpperCase() == answer.trim().toUpperCase()) {
      await playCorrect();
      setScore((prev) => prev + 1);
    } else {
      setBad((prev) => prev + 1);
      await playIncorrect();
      setBadIndex((prevBadIndex) =>
        prevBadIndex.includes(String(question_position))
          ? prevBadIndex
          : [...prevBadIndex, String(question_position)]
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="w-full">
      <Center className="flex-1">
        <View style={{ width: "100%" }} className="flex-1">
          {questionsStatus === "success" && answerStatus === "success" && (
            <>
              <View className="flex-[2]">
                {is_challange === "true" && (
                  <Center>
                    <Text>Tvoj čas : {seconds}s</Text>
                  </Center>
                )}

                <StudyCardWindow
                  position={question_position + 1}
                  question_id={questions[question_position].id}
                  reported={questions[question_position].reported}
                  max_questions={questions.length}
                  flash_cards={false}
                  question={questions[question_position].text}
                  answer={getCorrectAnswers(answers)}
                  answer_shown={false}
                  setShown={() => {}}
                  question_approved={questions[question_position].approved}
                  flex={true}
                />
              </View>
              {answers.length > 1 && (
                <>
                  <View className="flex-[2] w-[90%] ml-auto mr-auto ">
                    {answers.slice(0, 4).map((answer: Answer, index) => (
                      <View key={index}>
                        <AnswerOptionButton
                          answer={answer}
                          isSelected={selectedAnswers.some(
                            (a) => a.id === answer.id
                          )}
                          onSelect={() => handleToggleAnswer(answer)}
                          answersSent={answers_sent}
                          backgroundColor={handleAnswerColor(
                            answer,
                            answers_sent,
                            selectedAnswers
                          )}
                          multipleAnswers={correctAnswerCount > 1}
                        />
                      </View>
                    ))}
                  </View>
                  <View className="flex-[0.5] justify-end items-center pb-4 w-[90%] mr-auto ml-auto">
                    <FullNavigationButton
                      action={handleNextOrValidate}
                      text={answers_sent ? "Dalej" : "Zadaj"}
                      height={"14"}
                    />
                  </View>
                </>
              )}
              {answers.length == 1 && (
                <>
                  <View className="flex-[1.5] w-[90%] mr-auto ml-auto pt-5">
                    <Input isDisabled={answers_sent} className="h-[20%]">
                      <InputField
                        placeholder="Zadaj odpoveď"
                        value={answer_text}
                        onChangeText={(text: string) => setAnswerText(text)}
                        className={`rounded-lg shadow-md flex-1 ${
                          answers_sent &&
                          answers[0]?.text.trim().toUpperCase() ===
                            answer_text.trim().toUpperCase()
                            ? "bg-green-200" // Light Green for correct answer
                            : answers_sent &&
                              answers[0]?.text.trim().toUpperCase() !==
                                answer_text.trim().toUpperCase()
                            ? "bg-red-200" // Light Red for incorrect answer
                            : "bg-transparent" // Transparent if not sent
                        }`}
                      />
                    </Input>
                  </View>
                  <View className="flex-[0.5] justify-end items-center w-[90%] mr-auto ml-auto pb-4">
                    <FullNavigationButton
                      action={handleTextAnswerNextOrValidate}
                      text={answers_sent ? "Dalej" : "Zadaj"}
                      height={"14"}
                    />
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </Center>
    </ScrollView>
  );
};

export default QuizView;
