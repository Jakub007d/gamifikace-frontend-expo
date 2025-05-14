import { ScrollView, Switch, View } from "react-native";
import { Text } from "@/components/ui/text";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useData } from "./components/answers_context";
import { useToast } from "@/components/ui/toast";
import fetchLecturesForCourse from "@/api/Downloaders/fetchLectureForCourse";
import { Answer } from "@/constants/props";
import { Center } from "@/components/ui/center";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { CheckIcon, ChevronDown } from "lucide-react-native";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import postQuestionWithAnswers from "@/api/Uploaders/uploadQuestion";
import { showToast } from "@/components/custom/customToast/customToast";
import CustomHeader from "@/components/custom/navigation/CustomHeader";

/**
 * @screen
 * Obrazovka `addQuestionScreen` umožňuje administrátorom alebo používateľom pridať vlastnú otázku
 * a k nej priradené odpovede do zvoleného okruhu (lecture) kurzu.
 *
 * Navigovateľná obrazovka používa Expo Router a prijíma `lectureID`, `lectureName` a `courseID`
 * z `useLocalSearchParams`.
 *
 * Funkcie:
 * - Načítava dostupné okruhy (lectures) cez `react-query`.
 * - Používateľ si zvolí okruh pomocou `Select`.
 * - Umožňuje zadanie textu otázky a až 4 odpovedí (každá s prepínačom správnosti).
 * - Validuje vstupy: otázka musí byť zadaná, všetky odpovede musia byť neprázdne a aspoň jedna musí byť správna.
 * - Po stlačení tlačidla „Odoslať“ sa volá `postQuestionWithAnswers`, čím sa otázka a odpovede uložia na server.
 * - Zobrazuje vlastný `CustomHeader`.
 *
 * Komponenty:
 * - `TextareaInput` pre text otázky,
 * - `InputField` pre text odpovedí,
 * - `Switch` pre označenie správnych odpovedí,
 * - `Select` na výber okruhu,
 * - `Button` na odoslanie.
 *
 * Lokálny stav:
 * - `answers_v2`: pole objektov typu `Answer` reprezentujúce odpovede,
 * - `question_text`, `selectedLectureID`: vstupné hodnoty z formulára,
 * - `lecture_status`: stav načítania okruhov,
 * - `toast`: výstupné hlásenia pomocou `showToast`.
 *
 * @returns {JSX.Element} Obrazovka pre pridanie novej otázky s odpoveďami do databázy kurzu.
 *
 * @example
 * router.push({
 *   pathname: "/admin/addQuestionScreen",
 *   params: { lectureID: "123", lectureName: "Delenie", courseID: "456" }
 * });
 */

export default function addQuestionScreen() {
  const navigation = useNavigation();

  const { answers, addAnswer } = useData();
  const { lectureID, lectureName, courseID } = useLocalSearchParams();
  const [selectedLectureID, setSelectedLectureID] = useState("");
  const [question_name, setQuestionName] = useState("");
  const [question_text, setQuestionText] = useState("");
  const toast = useToast();
  const [question_pos, setQuestionPos] = useState(0);
  const maxLength = 300;

  const { status: lecture_status, data: lectures } = useQuery({
    queryKey: ["lectures", courseID],
    enabled: !!courseID,
    queryFn: () => fetchLecturesForCourse(courseID[0]!),
  });

  const [answers_v2, setAnswers_v2] = useState<Answer[]>([
    {
      id: "",
      text: "",
      answer_type: false,
      question: "",
    },
  ]);

  const handleAddAnswer = () => {
    setAnswers_v2((prevAnswers) => [
      ...prevAnswers,
      {
        id: "",
        text: "",
        answer_type: false,
        question: "",
      },
    ]);
  };

  const handleOnAnswerNameChange = (text: string, index: number) => {
    const updatedAnswers = [...answers_v2];
    updatedAnswers[index].text = text;
    setAnswers_v2(updatedAnswers);
  };

  const handleOnAnswerTypeChange = (type: boolean, index: number) => {
    const updatedAnswers = [...answers_v2];
    updatedAnswers[index].answer_type = type;
    setAnswers_v2(updatedAnswers);
  };

  useEffect(() => {
    if (lecture_status === "success" && lectures && lectures.length > 0) {
      if (!selectedLectureID) {
        if (lectureID === "-1") {
          setSelectedLectureID("");
        } else {
          setSelectedLectureID(String(lectureID));
        }
      }
    }
  }, [lecture_status, lectures, lectureID, selectedLectureID]);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader back={true} text={String("Pridávanie otázky")} />
      ),
    });
  }, [navigation]);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: "space-between", padding: 16 }}>
        <View>
          <Center>
            {lecture_status === "success" && (
              <>
                <Text size="xl">Pozor pridané otázky sú verejné</Text>
                <Select
                  className="w-[90%] border border-gray-300 rounded-lg bg-white shadow-sm mt-5"
                  selectedValue={selectedLectureID}
                  onValueChange={setSelectedLectureID}
                >
                  <SelectTrigger className="text-gray-700 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center">
                    <SelectInput
                      placeholder="Vyber okruh"
                      className="text-lg text-gray-700"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </SelectTrigger>

                  <SelectPortal>
                    <SelectBackdrop className="bg-opacity-50" />
                    <SelectContent className="bg-white shadow-lg rounded-lg border border-gray-300 mt-1">
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {lectures.map((lecture) => (
                        <SelectItem
                          key={lecture.id}
                          value={String(lecture.id)}
                          className={`p-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between transition-colors duration-150 h-[75px]${
                            lecture.available
                              ? ""
                              : "opacity-50 pointer-events-none"
                          }`}
                          label={String(lecture.name)}
                        >
                          {lecture.name}
                          {selectedLectureID === String(lecture.id) && (
                            <CheckIcon className="w-4 h-4 text-blue-500" />
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </>
            )}
          </Center>

          <View className="w-full mt-6">
            <Text className="text-lg font-medium text-gray-700 mb-1">
              Text otázky
            </Text>
            <Textarea className="w-full h-[125px] border border-gray-300 rounded-lg p-3 text-gray-700">
              <TextareaInput
                multiline={true}
                maxLength={maxLength}
                textAlignVertical="top"
                className="h-[100%]"
                placeholder="Text Otázky"
                value={question_text}
                onChangeText={setQuestionText}
              />
              <Text style={{ alignSelf: "flex-end", marginRight: 4 }}>
                {question_text.length}/{maxLength} znakov
              </Text>
            </Textarea>

            <View className="mt-4 flex-1">
              <VStack>
                <HStack className="justify-between mb-2">
                  <Text className="text-base font-medium">Odpovede</Text>
                  <Text className="text-base font-medium">Je správna</Text>
                </HStack>

                {answers_v2.map((answer, index) => (
                  <HStack key={index} className="items-center mb-2 space-x-2">
                    <Input className="flex-1 border border-gray-300 rounded-lg p-2 h-[75px]">
                      <InputField
                        multiline={true}
                        maxLength={maxLength}
                        textAlignVertical="top"
                        placeholder="Odpoveď"
                        value={answer.text}
                        onChangeText={(text) =>
                          handleOnAnswerNameChange(text, index)
                        }
                      />
                      <Text style={{ alignSelf: "flex-end", marginRight: 4 }}>
                        {answer.text.length}/{maxLength} znakov
                      </Text>
                    </Input>
                    <Switch
                      value={answer.answer_type}
                      onValueChange={(value) =>
                        handleOnAnswerTypeChange(value, index)
                      }
                      className="ml-2"
                    />
                  </HStack>
                ))}

                {answers_v2.length < 4 && (
                  <Button
                    variant="outline"
                    className="mt-3 border-dashed border-gray-500 h-[75px]"
                    onPress={handleAddAnswer}
                  >
                    <ButtonText>+</ButtonText>
                  </Button>
                )}
              </VStack>
            </View>
          </View>
        </View>

        <Button
          isDisabled={
            question_text.trim() === "" ||
            selectedLectureID.trim() === "" ||
            answers_v2.some((a) => a.text.trim() === "") ||
            !answers_v2.some((a) => a.answer_type === true)
          }
          className="mt-4 h-[75px] bg-primaryButton"
          onPress={() => {
            postQuestionWithAnswers(
              true,
              question_text.slice(0, 17),
              question_text,
              String(selectedLectureID),
              answers_v2
            );
            showToast(toast, "Otázka a odpovede úspešne pridané", "info");
            router.back();
          }}
        >
          <ButtonText>Odoslať</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
}
