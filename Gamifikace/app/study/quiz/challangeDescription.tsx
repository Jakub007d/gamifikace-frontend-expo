import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React from "react";
import FullNavigationButton from "@/components/custom/customButtons/fullNavigationButton";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, View } from "react-native";
import { useNavigationHeader } from "./hooks/useNavigationHeader";

/**
 * @screen
 * Obrazovka popisu výzvy (challangeDescription).
 *
 * Navigovateľná Expo Router stránka, ktorá zobrazuje používateľovi základné informácie
 * o týždennej výzve pred jej spustením.
 *
 * Funkcie:
 * - Vysvetľuje pravidlá výzvy, podmienky dokončenia a spôsob výpočtu skóre.
 * - Informuje o možnosti získať trofej a body do rebríčka.
 * - Po potvrdení spustí výzvu a presmeruje používateľa na obrazovku `/study/quiz/quiz`
 *   s parametrami pre výzvový režim (`is_challange: true`).
 *
 * Navigácia:
 * - Používa `useLocalSearchParams()` na načítanie `id` a `course_id`.
 * - Spúšťa navigáciu cez `router.replace()` po kliknutí na tlačidlo „Začať výzvu“.
 *
 * Použité hooky:
 * - `useNavigationHeader` na nastavenie hlavičky pre výzvový režim.
 *
 * UI komponenty:
 * - `FullNavigationButton`, `VStack`, `Text`, `SafeAreaView`
 *
 * @fileoverview Expo Router TSX stránka zobrazujúca popis výzvy pred jej spustením.
 *
 * @component
 * @example
 * router.push({
 *   pathname: "/study/quiz/challangeDescription",
 *   params: { id: "123", course_id: "456", is_challange: "true" }
 * });
 *
 * @returns {JSX.Element} Stránka s popisom výzvy a tlačidlom na jej spustenie.
 */

export default function challangeDescription() {
  const { id, is_challange, course_id } = useLocalSearchParams();
  useNavigationHeader({
    is_challange: String(is_challange),
  });
  return (
    <SafeAreaView className="flex-1 bg-white">
      <VStack className="flex-1 justify-between p-4 rounded-lg min-h-[100%]">
        <View>
          <Text className="text-center text-2xl font-bold">Výzva</Text>
          <View className="w-[90%] self-center">
            <Text className="text-lg font-semibold mt-4 text-justify">
              Za úspešné dokončenie výzvy je možné získať každý týždeň body
              ktoré upravujú poradie v rebríčku. Výzvu je možné dokončiť každý
              týždeň iba raz.
            </Text>
            <Text className="text-lg font-semibold mt-4 text-justify">
              Najlepšie hodnotený uživateľ na konci týždňa bude odmenený
              trofejou
            </Text>
            <Text className="text-lg font-semibold mt-4 text-justify">
              Skóre sa počíta ako súčet všetkých správnych odpovedí x 100 / čas
              dokončenia výzvy.
            </Text>
          </View>
        </View>

        <FullNavigationButton
          action={() => {
            router.replace({
              pathname: "/study/quiz/quiz",
              params: {
                id: String(course_id),
                is_challange: "true",
                course_id: course_id,
              },
            });
          }}
          text={"Začať výzvu"}
        />
      </VStack>
    </SafeAreaView>
  );
}
