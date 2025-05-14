import React from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Okruh } from "@/constants/props";

interface Props {
  item: Okruh;
  courseID: string;
  mode: string;
}

/**
 * @comonent
 * Komponent `LectureCard` zobrazuje informácie o jednom okruhu (prednáške) daného kurzu.
 *
 * Podľa režimu (`FlashCards` alebo `Quiz`) umožňuje používateľovi prejsť na konkrétnu aktivitu.
 *
 * Ak `item.available` je `false`, karta je vizuálne deaktivovaná a nedá sa stlačiť.
 *
 * Dáta:
 * - `item.name` a `item.description` sú zobrazené ako hlavný obsah karty.
 * - Ak `description` nie je zadaný, zobrazí sa zástupný text.
 *
 * Navigácia:
 * - `mode === "FlashCards"` → presmeruje na obrazovku pamäťových kariet.
 * - `mode === "Quiz"` → presmeruje na obrazovku kvízu.
 *
 * @param {Object} props
 * @param {Okruh} props.item - Objekt okruhu s informáciami (názov, dostupnosť, popis).
 * @param {string} props.courseID - ID kurzu, ktorého je okruh súčasťou.
 * @param {string} props.mode - Režim spustenia (napr. `"FlashCards"` alebo `"Quiz"`).
 *
 * @returns {JSX.Element} Interaktívna karta s informáciami o okruhu.
 *
 * @example
 * <LectureCard item={okruh} courseID="123" mode="Quiz" />
 */

export default function LectureCard({ item, courseID, mode }: Props) {
  const isDisabled = !item.available;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => {
        if (mode == "FlashCards") {
          router.replace({
            pathname: "/study/flash_cards/flash_cards",
            params: {
              lectureID: item.id,
              lecture_name: item.name,
            },
          });
        }
        if (mode == "Quiz") {
          router.replace({
            pathname: "/study/quiz/quiz",
            params: { id: item.id, is_challange: "false", course_id: courseID },
          });
        }
      }}
      className={`w-[100%] rounded-2xl px-4 py-5 mx-auto mb-4 ${
        isDisabled
          ? "border border-gray-300 bg-transparent"
          : "bg-white shadow-md border"
      }`}
    >
      <View className="flex-1">
        <Text
          className={`text-xl font-semibold mb-1 ${
            isDisabled ? "text-gray-500" : "text-gray-800"
          }`}
        >
          {item.name}
        </Text>
        {item.description != "" && (
          <Text
            className={`text-sm ${
              isDisabled ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {item.description}
          </Text>
        )}
        {item.description == "" && (
          <Text
            className={`text-sm ${
              isDisabled ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Nebol poskytnutý popis okruhu
          </Text>
        )}
      </View>
    </Pressable>
  );
}
