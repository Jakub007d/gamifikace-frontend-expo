import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Answer, SavedQuestion } from "@/constants/props";
import { Center } from "@/components/ui/center";
import { StudyCardWindow } from "../study/components/StudyWindow";
import { VStack } from "@/components/ui/vstack";
import AnswerOptionButton from "@/components/custom/customButtons/AnswerOptionButton";
import FullNavigationButton from "@/components/custom/customButtons/fullNavigationButton";
import { router, useNavigation } from "expo-router";
import CustomHeader from "@/components/custom/navigation/CustomHeader";

/**
 * @screen
 * Obrazovka detailu zodpovedanej otázky (AnsweredQuestionDetail).
 *
 *  Navigovateľná stránka v Expo Router (TSX) určená na spätné zobrazenie odpovede používateľa.
 *
 * Funkcie:
 * - Z `AsyncStorage` načíta lokálne uložené otázky a odpovede používateľa (uložené po kvíze/výzve).
 * - Zobrazí samotnú otázku v komponentne `StudyCardWindow`.
 * - Vizuálne odlíši správne, nesprávne a zvolené odpovede pomocou farieb:
 *   - 🟩 zelená: správna odpoveď, ktorú používateľ zvolil,
 *   - 🟧 oranžová: správna odpoveď, ktorú používateľ nezvolil,
 *   - 🟥 červená: nesprávna odpoveď, ktorú používateľ zvolil.
 * - Pri textovej odpovedi porovnáva odpovede nezávisle od veľkosti písmen a prázdnych znakov (`trim().toUpperCase()`).
 * - Umožňuje prejsť na komentáre k danej otázke.
 *
 * Navigácia:
 * - Prijíma `questionIndex` ako parameter cez `useRoute()` (index otázky v poli `saved_questions`).
 * - Využíva `router.push()` na navigáciu do obrazovky s komentármi.
 *
 * Detail odpovede na konkrétnu otázku — zobrazovaný v rámci súhrnu alebo histórie odpovedí.
 *
 * @component
 * @example
 * router.push({
 *   pathname: "/summary/answeredQuestionDetail",
 *   params: { questionIndex: "2" },
 * });
 *
 * @returns {JSX.Element} Komponent zobrazujúci otázku, odpovede a spätnú väzbu na odpoveď používateľa.
 */

const AnsweredQuestionDetail = () => {
  const route = useRoute();
  const { questionIndex } = route.params as { questionIndex: string };
  const [saved_questions, setSavedQuestion] = useState<SavedQuestion[]>([]);
  const navigation = useNavigation();
  useEffect(() => {
    const loadSavedQuestions = async () => {
      const saved = await AsyncStorage.getItem("saved_questions");
      if (saved) {
        const parsed = JSON.parse(saved) as SavedQuestion[];
        setSavedQuestion(parsed); // alebo čo chceš
      }
    };
    loadSavedQuestions();
  }, []);
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          back={true}
          text={String(
            "Otázka: " + saved_questions[Number(questionIndex)]?.question.name
          )}
        />
      ),
    });
  }, [navigation, saved_questions]);
  return (
    <View className="flex-1">
      <VStack className="flex-1">
        <View className="flex-[2] justify-center">
          <StudyCardWindow
            position={0}
            max_questions={0}
            flash_cards={false}
            question={saved_questions[Number(questionIndex)]?.question.text}
            answer={[]}
            answer_shown={false}
            setShown={() => {}}
            question_id={""}
            reported={saved_questions[Number(questionIndex)]?.question.reported}
            question_approved={
              saved_questions[Number(questionIndex)]?.question.approved
            }
            flex={true}
          />
        </View>
        {saved_questions[Number(questionIndex)]?.answers.length > 1 && (
          <View className="flex-[3] justify-start">
            {saved_questions[Number(questionIndex)]!.answers.slice(0, 4).map(
              (answer: Answer, index) => (
                <View key={index} className=" w-[90%] ml-auto mr-auto">
                  <AnswerOptionButton
                    answer={answer}
                    isSelected={saved_questions[
                      Number(questionIndex)
                    ]!.selectedAnswers.some((a) => a.id === answer.id)}
                    onSelect={() => {}}
                    answersSent={true}
                    backgroundColor={
                      saved_questions[
                        Number(questionIndex)
                      ]!.selectedAnswers.some((a) => a.id === answer.id) &&
                      answer.answer_type == true
                        ? "#33CC33" // green
                        : !saved_questions[
                            Number(questionIndex)
                          ]!.selectedAnswers.some((a) => a.id === answer.id) &&
                          answer.answer_type == true
                        ? "#FFA500" // orange
                        : saved_questions[
                            Number(questionIndex)
                          ]!.selectedAnswers.some((a) => a.id === answer.id) &&
                          answer.answer_type == false
                        ? "#FF0000" // red
                        : undefined
                    }
                  />
                </View>
              )
            )}
          </View>
        )}
        {saved_questions[Number(questionIndex)]?.answers.length == 1 && (
          <View className="flex-[3] justify-start">
            <View key={0} className="pt-4 w-[90%] ml-auto mr-auto">
              <AnswerOptionButton
                answer={saved_questions[Number(questionIndex)]?.answers[0]}
                isSelected={true}
                onSelect={() => {}}
                answersSent={true}
                backgroundColor={"green"}
              />
            </View>
            {saved_questions[Number(questionIndex)]?.answers[0].text
              .trim()
              .toUpperCase() !=
              saved_questions[Number(questionIndex)]?.selectedAnswers[0].text
                .trim()
                .toUpperCase() && (
              <View key={1} className="pt-4 w-[90%] ml-auto mr-auto">
                <AnswerOptionButton
                  answer={
                    saved_questions[Number(questionIndex)]?.selectedAnswers[0]
                  }
                  isSelected={true}
                  onSelect={() => {}}
                  answersSent={true}
                  backgroundColor={"red"}
                />
              </View>
            )}
          </View>
        )}
        <View className="flex-[1] justify-end items-center pb-4">
          <FullNavigationButton
            width="[90%]"
            height={"[80px]"}
            center={true}
            action={async () => {
              router.push({
                pathname: "/summary/comentsView",
                params: {
                  question_id: String(
                    saved_questions[Number(questionIndex)]?.question.id
                  ),
                  question_name: String(
                    saved_questions[Number(questionIndex)]?.question.name
                  ),
                },
              });
            }}
            text={"Komentáre"}
          />
        </View>
      </VStack>
    </View>
  );
};

export default AnsweredQuestionDetail;
