import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Pointer } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { report_question } from "@/api/Uploaders/reportQuestion";
import { useToast } from "@/components/ui/toast";
import { showToast } from "@/components/custom/customToast/customToast";

interface StudyCardWindowInterface {
  flash_cards: boolean;
  question: string;
  question_id: string;
  reported: boolean;
  answer: string | string[];
  answer_shown: boolean;
  setShown: () => void;
  position: number;
  max_questions: number;
  question_approved: boolean;
  flex?: boolean;
}
interface StudyCardWindowInterfaceAI {
  aiAnswer: string;
}

/**
 * Komponent `StudyCardWindow` zobrazuje otázku alebo odpoveď vo forme študijnej karty.
 *
 * Používa sa v režime flash kariet aj v klasickom kvízovom zobrazení.
 *
 * Funkcie:
 * - Zobrazuje buď otázku, alebo odpoveď (alebo zoznam odpovedí).
 * - Umožňuje používateľovi kliknutím prepínať medzi otázkou a odpoveďou (`setShown`).
 * - Označuje, či bola otázka nahlásená alebo schválená správcom.
 * - V prípade neschválenej otázky umožňuje jej nahlásenie (s potvrdením v modálnom okne).
 * - V režime `flash_cards` zobrazuje výzvu „Klikni pre zobrazenie...“ v dolnej časti karty.
 *
 * @component
 * @param {Object} props - Vlastnosti komponentu.
 * @param {boolean} props.flash_cards - Či je karta v režime flash kariet.
 * @param {string} props.question - Text otázky.
 * @param {string} props.question_id - ID otázky (na nahlásenie).
 * @param {boolean} props.reported - Či bola otázka nahlásená.
 * @param {string | string[]} props.answer - Odpoveď alebo pole odpovedí.
 * @param {boolean} props.answer_shown - Či sa má zobraziť odpoveď (ináč otázka).
 * @param {() => void} props.setShown - Callback na prepnutie zobrazenia.
 * @param {number} props.position - Poradie aktuálnej otázky (napr. 3/10).
 * @param {number} props.max_questions - Celkový počet otázok.
 * @param {boolean} props.question_approved - Či bola otázka schválená.
 * @param {boolean} [props.flex] - Voliteľne či má komponent využívať `flex: 1` layout.
 *
 * @returns {JSX.Element} Interaktívna študijná karta s otázkou a odpoveďou.
 *
 * @example
 * <StudyCardWindow
 *   flash_cards={true}
 *   question="Čo je hlavné mesto Slovenska?"
 *   question_id="1993"
 *   reported={false}
 *   answer={["Bratislava"]}
 *   answer_shown={true}
 *   setShown={() => toggle()}
 *   position={3}
 *   max_questions={10}
 *   question_approved={true}
 * />
 */

export const StudyCardWindow = (props: StudyCardWindowInterface) => {
  const answerIndex = ["a", "b", "c", "d", "e", "f"];
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  async function handleReportQuestion() {
    const succesfull = report_question(props.question_id);
    if (await succesfull) {
      showToast(toast, "Otázka úspešne nahlásená", "info");
    } else {
      showToast(toast, "Chyba pri nahlasovaní otázky", "error");
    }
    setIsOpen(false);
  }
  return (
    <Pressable onPress={() => props.setShown()} className="flex-1">
      <VStack className="flex-1">
        <VStack
          className={`bg-gray-200 ${
            props.flash_cards
              ? "rounded-tr-lg rounded-tl-lg mx-auto w-[90%]"
              : "rounded-lg mx-auto w-[90%]"
          } mt-5`}
          style={props.flex ? { flex: 1 } : { height: "95%" }}
        >
          {props.position !== 0 && props.max_questions !== 0 && (
            <VStack className="pt-1">
              <Text className="text-center text-lg font-semibold">
                {props.position}/{props.max_questions}
              </Text>
              <Text className="text-center text-lg font-semibold">
                {props.answer_shown
                  ? props.answer.length > 1
                    ? "Odpovede:"
                    : "Odpoveď:"
                  : "Otázka:"}
              </Text>
            </VStack>
          )}
          <ScrollView
            className="w-full mt-4"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 0,
            }}
          >
            <View
              className=" items-center justify-center px-4 w-full mt-auto mb-auto"
              style={{ flexWrap: "wrap" }}
            >
              {props.answer_shown ? (
                Array.isArray(props.answer) ? (
                  props.answer.map((ans, index) => (
                    <Text
                      key={index}
                      className="w-full text-center pb-2 break-words text-lg font-semibold"
                    >
                      {answerIndex[index]}. {ans}
                    </Text>
                  ))
                ) : (
                  <Text className="w-full text-center break-words text-lg font-semibold">
                    {props.answer}
                  </Text>
                )
              ) : (
                <Text className="w-full text-center break-words text-lg font-semibold">
                  {props.question}
                </Text>
              )}
            </View>
          </ScrollView>
          {!props.reported && !props.question_approved && (
            <Pressable onPress={() => setIsOpen(true)}>
              <Text className="text-blue-600 underline text-center font-semibold mt-2 mb-2 text-md">
                Nahlásiť otázku
              </Text>
            </Pressable>
          )}
          {props.reported && !props.question_approved && (
            <Text className="text-red-600 underline text-center font-semibold mt-2 mb-2 text-md">
              Pozor otázka bola nahlásená môže byť nesprávna
            </Text>
          )}
          {props.question_approved && (
            <Text className="text-green-600 underline text-center font-semibold mt-2 mb-2 text-md">
              Otázka bola schválená správcom predmetu
            </Text>
          )}
          {props.flash_cards && (
            <Box className="w-[100%] bg-primaryButton rounded-bl-lg rounded-br-lg mr-auto ml-auto h-[12%]">
              <Text className="text-white text-center font-semibold mt-auto mb-auto">
                Klikni ▶ pre zobrazenie{" "}
                {props.answer_shown
                  ? "otázky"
                  : Array.isArray(props.answer)
                  ? "odpovede"
                  : "odpoveď"}
              </Text>
            </Box>
          )}
        </VStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalBackdrop />
        <ModalContent className="rounded-2xl bg-white p-4">
          <ModalHeader>
            <Text className="text-lg font-semibold">Nahlásenie otázky</Text>
          </ModalHeader>
          <ModalBody>
            <Text className="text-base text-gray-700">
              Naozaj chceš nahlásiť túto otázku?
            </Text>
          </ModalBody>
          <ModalFooter className="flex-row justify-end space-x-3">
            <Button onPress={() => setIsOpen(false)}>
              <ButtonText>Nie</ButtonText>
            </Button>
            <Button onPress={() => handleReportQuestion()}>
              <ButtonText>Ano</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Pressable>
  );
};

export const StudyCardWindowAI = (props: StudyCardWindowInterfaceAI) => {
  return (
    <Pressable>
      <Box className="bg-gray-200 p-4 rounded-lg w-9/10 mx-auto min-w-[90%] min-h-[90%] mt-5 flex items-center justify-center">
        <View>
          <Text size="xl">{props.aiAnswer}</Text>
        </View>
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
    padding: 10,
    justifyContent: "center", // Vertikálne vycentrovanie
    alignItems: "center", // Horizontálne vycentrovanie
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "gray",
  },
});
