import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { Answer } from "@/constants/props";
import fetchQuestions from "@/api/Downloaders/fetchQuestions";
import fetchAnswers from "@/api/Downloaders/fetchAnswers";
import { getOpenAIResponse } from "@/api/Downloaders/fetchOpenAIResponse";
import { StudyCardWindow, StudyCardWindowAI } from "../components/StudyWindow";
import SideNavigationButton from "@/components/custom/customButtons/sideNavigationButton";
import { ArrowLeft, ArrowRight, Atom, ChevronDown } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import AiAccordion from "./components/AiAccordion";
import { SafeAreaView } from "react-native-safe-area-context";
/**
 * @screen
 * Obrazovka študijných kariet (StudyCard).
 *
 * Interaktívne pamäťové karty s možnosťou zobrazenia správnych odpovedí a AI vysvetlení.
 *
 * Expo Router stránka, ktorá:
 * - načítava otázky a odpovede z backendu (`fetchQuestions`, `fetchAnswers`),
 * - umožňuje prepínať medzi otázkami pomocou navigačných tlačidiel,
 * - zobrazuje správne odpovede po kliknutí,
 * - poskytuje AI vysvetlenie otázky a odpovedí cez OpenAI (`getOpenAIResponse`),
 * - automaticky vygeneruje AI odpoveď, ak `ai_context` nie je dostupný,
 * - zobrazuje hlavičku s názvom okruhu cez `navigation.setOptions`.
 *
 * Stav a logika:
 * - `answerShown`: či sú zobrazené odpovede,
 * - `gpt_shown`: či je rozbalený AI výklad,
 * - `storedLocally`: či bola AI odpoveď predgenerovaná a uložená,
 * - `question_position`: aktuálne zobrazená otázka,
 * - `getQuestionPosition()`: zaistí kruhovú navigáciu v zozname otázok.
 *
 * Komponenty:
 * - `StudyCardWindow`: zobrazuje otázku a správne odpovede,
 * - `SideNavigationButton`: prepínanie otázok,
 * - `AiAccordion`: komponent pre AI konetxt s `Accordion` rozhraním.
 *
 * @fileoverview Navigovateľná obrazovka v `/study/cards/StudyCard.tsx` s pamäťovými kartami a AI kontextom.
 *
 * @component
 * @example
 * router.push({
 *   pathname: "/study/cards/StudyCard",
 *   params: { lectureID: "2", lecture_name: "Násobenie" }
 * });
 *
 * @returns {JSX.Element} Obrazovka pre precvičovanie otázok formou študijných kariet s AI kontextom.
 */

const StudyCard = () => {
  const navigation = useNavigation();

  const [answerShown, setAnswerShown] = useState(false);
  const [storedLocally, setStoredLocally] = useState(false);
  const [question_position, setPosition] = useState(0);
  const [gpt_shown, setGptShown] = useState(false);
  const [gpt_question, setGptQuestion] = useState<String | null>();
  const { lectureID, lecture_name } = useLocalSearchParams();
  const { status: questions_status, data: questions } = useQuery({
    queryKey: ["questions", lectureID],
    enabled: !!lectureID,
    queryFn: () =>
      fetchQuestions(
        typeof lectureID === "string" ? lectureID : lectureID.join(", "),
        "false"
      ),
  });
  const { status: gpt_status, data: gpt } = useQuery({
    queryKey: ["gpt_context", gpt_question],
    enabled: !!gpt_question,
    queryFn: () =>
      getOpenAIResponse(String(gpt_question), questions![question_position].id),
  });
  const { status: answer_status, data: answers } = useQuery({
    queryKey: ["answers", questions?.[question_position]?.id],
    enabled: !!questions,
    queryFn: () => fetchAnswers(questions![question_position].id),
  });
  function getQuestionPosition(next_position: number) {
    const maxSize: number = questions!.length;
    if (question_position + next_position >= maxSize) {
      setPosition(0);
    } else if (question_position <= 0 && next_position == -1) {
      setPosition(maxSize - 1);
    } else {
      setPosition(question_position + next_position);
    }
  }
  useFocusEffect(
    useCallback(() => {
      setGptShown(false);
      setGptQuestion(null); // Nastavenie hodnoty na false pri návrate na túto obrazovku
    }, [])
  );

  function getCorrectAnswers(): string[] {
    return answers!
      .filter((answer: Answer) => answer.answer_type === true) // Filtruje správne odpovede
      .map((answer: Answer) => answer.text); // Extrahuje text správnych odpovedí
  }
  useEffect(() => {
    navigation.setOptions({
      title: "Pamäťové karty " + lecture_name,
    });
  }, [navigation]);
  const handleAccordionToggle = () => {
    if (questions![question_position].ai_context === "") {
      setGptQuestion(
        "Vysvetli maximálne v 3 vetách otázku: " +
          questions![question_position].text +
          " a jej odpoved/odpovede: " +
          getCorrectAnswers()
      );
      setGptShown(!gpt_shown);
    } else {
      setGptShown(!gpt_shown);
      setStoredLocally(true);
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={["bottom", "right", "left"]}>
      {questions_status === "success" && answer_status === "success" && (
        <>
          <View className="flex-[2] w-full">
            <StudyCardWindow
              question_id={questions[question_position].id}
              reported={questions[question_position].reported}
              position={question_position + 1}
              max_questions={questions.length}
              flash_cards={true}
              question={questions[question_position].text}
              answer={getCorrectAnswers()}
              answer_shown={answerShown}
              setShown={() => setAnswerShown(!answerShown)}
              question_approved={questions[question_position].approved}
            />
          </View>
          <View className="flex-[3]">
            <VStack className="flex-1 justify-between w-[90%] mr-auto ml-auto mt-5">
              <View className="flex-row justify-between gap-1.5 pb-5">
                <SideNavigationButton
                  action={() => {
                    getQuestionPosition(-1);
                    setGptShown(false);
                    setAnswerShown(false);
                  }}
                  text={"Späť"}
                  icon={ArrowLeft}
                />
                <SideNavigationButton
                  action={() => {
                    getQuestionPosition(1);
                    setGptShown(false);
                    setAnswerShown(false);
                  }}
                  text={"Ďalej"}
                  icon={ArrowRight}
                />
              </View>
              <View className="flex-1">
                <AiAccordion
                  question_position={question_position}
                  gpt_shown={gpt_shown}
                  setGptShown={setGptShown}
                  handleAccordionToggle={handleAccordionToggle}
                  questions={questions}
                  gpt_status={gpt_status}
                  gpt={gpt ?? null}
                />
              </View>
            </VStack>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default StudyCard;
