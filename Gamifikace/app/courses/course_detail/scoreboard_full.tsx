import React, { useEffect, useRef } from "react";
import { Text } from "@/components/ui/text";
import { Pressable, ScrollView, View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import fetchScore from "@/api/Downloaders/fetchScoreboard";
import { ScoreboardItem } from "@/components/custom/scoreboard/scoreboard_item";
import CustomHeader from "@/components/custom/navigation/CustomHeader";

/**
 *@screen
 * `scoreboard_full` je Expo Router screen, ktorý zobrazuje kompletný rebríček výsledkov používateľov
 * pre konkrétny kurz vo forme zoznamu.
 *
 * Funkcionalita:
 * - Načítava skóre pre daný kurz pomocou `fetchScore` a zobrazí výsledky používateľov.
 * - Automaticky scrolluje na pozíciu aktuálneho používateľa v rebríčku (ak je prítomný).
 * - Ak nie sú dostupné žiadne výsledky, zobrazí informáciu o tom, že zatiaľ nikto neabsolvoval výzvu.
 * - Počas načítavania zobrazí prázdny stav.
 *
 * Navigácia:
 * - Prijíma parametre cez `useLocalSearchParams`:
 *   - `course_id: string` – ID kurzu
 *   - `course_name: string` – Názov kurzu
 *   - `user_id: string` – ID aktuálneho používateľa
 *
 * Komponenty:
 * - `ScoreboardItem` – reprezentuje jednotlivé položky rebríčka.
 * - `CustomHeader` – vlastný navigačný header s tlačidlom späť a názvom kurzu.
 *
 * @returns {JSX.Element} Scrollovateľný rebríček alebo info o absencii údajov.
 *
 * @example
 * router.push({
 *   pathname: "/course_detail/scoreboard_full",
 *   params: {
 *     course_id: "12",
 *     course_name: "Elektronické súčiastkz",
 *     user_id: "7"
 *   }
 * });
 */

export default function scoreboard_full() {
  const navigation = useNavigation();
  const { course_id } = useLocalSearchParams();
  const { user_id } = useLocalSearchParams();
  const { course_name } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const { status, data: scores } = useQuery({
    queryKey: ["score", course_id, "full"],
    queryFn: () => fetchScore(String(course_id)),
  });
  useEffect(() => {
    if (status === "success") {
      const userIndex = scores.findIndex(
        (score) => score.user === String(user_id)
      );
      if (userIndex !== -1 && scrollViewRef.current) {
        // Posunieme na pozíciu aktuálneho používateľa (prispôsobené podľa výšky položky)
        scrollViewRef.current.scrollTo({ y: userIndex * 100, animated: true });
      }
    }
  }, [scores, user_id]);
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          back={true}
          text={String("Celý rebríček predmetu " + course_name)}
        />
      ),
    });
  }, [navigation, user_id]);
  if (status === "success") {
    if (scores.length == 0)
      return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Text className="text-center text-xl">
            Nikto ešte nedokončil výzvu
          </Text>
          <View className="p-2"></View>
        </ScrollView>
      );
    else
      return (
        <ScrollView
          ref={scrollViewRef}
          contentInsetAdjustmentBehavior="automatic"
        >
          {scores.map((score_1, index) => (
            <>
              <ScoreboardItem
                key={index}
                score={score_1.points}
                user_name={score_1.username}
                user_id={score_1.user}
                current_user={String(user_id)}
                possition={index + 1 + "."}
              />
            </>
          ))}
        </ScrollView>
      );
  }
  if (status === "pending") {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View className="p-2"></View>
      </ScrollView>
    );
  }
}
