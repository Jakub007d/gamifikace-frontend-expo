import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { View, Text, ScrollView, Animated } from "react-native";
import { ChevronDown } from "lucide-react-native";

type Props = {
  question_position: number;
  gpt_shown: boolean;
  setGptShown: (shown: boolean) => void;
  handleAccordionToggle: () => void;
  questions: any[];
  gpt_status: string;
  gpt: string | null;
};

/**
 * Komponent `AiAccordion` zobrazuje AI vysvetlenie (kontext) k aktuálnej otázke
 * pomocou rozbaľovacieho `Accordion` rozhrania.
 *
 * Funkcie:
 * - Zobrazí buď predgenerovaný `ai_context` z otázky, alebo AI kontext z OpenAI (cez `gpt` prop).
 * - Na otvorenie panelu spustí `handleAccordionToggle()` – čím vyvolá generovanie novej AI odpovede, ak ešte nie je dostupná.
 * - Otváranie/zatváranie je vizuálne indikované otočením ikony `ChevronDown`.
 *
 * Správa stavu:
 * - `isExpanded`: lokálny stav otvorenia akordeónu,
 * - `gpt_shown`: stav indikujúci, či je AI sekcia zobrazená (riadený z rodiča),
 * - `setGptShown`: callback na aktualizáciu `gpt_shown` v rodičovskom komponente.
 *
 * @param {Object} props - Vstupné vlastnosti komponentu.
 * @param {number} props.question_position - Index aktuálnej otázky.
 * @param {boolean} props.gpt_shown - Indikuje, či je AI kontext momentálne zobrazený.
 * @param {(shown: boolean) => void} props.setGptShown - Callback na nastavenie stavu `gpt_shown`.
 * @param {() => void} props.handleAccordionToggle - Callback spúšťaný pri otvorení akordeónu, ktorý generuje AI odpoveď.
 * @param {any[]} props.questions - Pole všetkých otázok (vrátane AI kontextu).
 * @param {string} props.gpt_status - Stav načítavania AI odpovede (`pending` | `success` | `error`).
 * @param {string | null} props.gpt - Vygenerovaná AI odpoveď (ak nie je `null`).
 *
 * @returns {JSX.Element} Accordion s AI vysvetlením aktuálnej otázky.
 *
 * @example
 * <AiAccordion
 *   question_position={0}
 *   gpt_shown={false}
 *   setGptShown={setGptShown}
 *   handleAccordionToggle={generateAI}
 *   questions={questions}
 *   gpt_status="success"
 *   gpt="Ai kontext otázky..."
 * />
 */

export default function AiAccordion({
  question_position,
  gpt_shown,
  setGptShown,
  handleAccordionToggle,
  questions,
  gpt_status,
  gpt,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Accordion
      key={question_position}
      type="single"
      collapsable
      defaultValue={gpt_shown ? ["ai"] : undefined}
      onValueChange={(value) => {
        const opened = value?.includes("ai");
        setIsExpanded(opened);
        if (opened) {
          handleAccordionToggle();
        } else {
          setGptShown(false);
        }
      }}
      className="w-full"
    >
      <AccordionItem value="ai">
        <AccordionHeader>
          <AccordionTrigger className="px-4 py-3 border border-gray-300 rounded-md bg-white">
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="text-base font-medium text-gray-800">
                AI kontext otázky
              </Text>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: isExpanded ? "180deg" : "0deg",
                    },
                  ],
                }}
              >
                <ChevronDown size={20} color="gray" />
              </Animated.View>
            </View>
          </AccordionTrigger>
        </AccordionHeader>

        <AccordionContent className="bg-gray-50 border border-t-0 border-gray-300 rounded-b-md px-4 py-3">
          <View style={{ maxHeight: 200, overflow: "hidden" }}>
            <ScrollView nestedScrollEnabled={true}>
              <Text className="text-gray-800 text-base leading-relaxed">
                {questions[question_position].ai_context !== ""
                  ? questions[question_position].ai_context
                  : gpt_status === "success"
                  ? String(gpt)
                  : gpt_status === "pending"
                  ? "Generujem AI kontext..."
                  : ""}
              </Text>
            </ScrollView>
          </View>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
