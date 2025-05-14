import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { View, StyleSheet, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Okruh } from "@/constants/props";
import fetchLecturesForCourse from "@/api/Downloaders/fetchLectureForCourse";
import FullNavigationButton from "@/components/custom/customButtons/fullNavigationButton";
import { ScrollView } from "react-native";
import LectureCard from "./components/LectureCard";
import { useUser } from "@/app/hooks/useUser";
import CustomHeader from "@/components/custom/navigation/CustomHeader";

/**
 * @screen
 * Komponent `LectureList` zobrazuje zoznam okruhov (lectures) patriacich ku konkrétnemu kurzu.
 *
 * Podporuje dva režimy:
 * - `FlashCards` – slúži na precvičovanie pomocou pamäťových kariet.
 * - `Quiz` – umožňuje spustiť test z konkrétneho okruhu.
 *
 * Zdroje dát:
 * - Načítava okruhy pomocou `fetchLecturesForCourse` cez `react-query`.
 *
 * Navigácia:
 * - Využíva `expo-router` na navigáciu späť a na pridanie nového okruhu (ak je používateľ `is_staff`).
 *
 * Funkcionalita:
 * - Zobrazuje vlastný `CustomHeader` s názvom predmetu a režimom.
 * - Zobrazuje komponent `LectureCard` pre každý okruh.
 * - Umožňuje učiteľovi (`is_staff`) pridať nový okruh cez `FullNavigationButton`.
 * - Obsah je zabalený vo `ScrollView` pre podporu prehľadávania pri dlhších zoznamoch.
 *
 * @returns {JSX.Element} Zoznam okruhov v rámci kurzu.
 *
 * @example
 * router.push({
 *   pathname: "/courses/lectureList",
 *   params: { id: "101", name: "Sčítanie", mode: "Quiz", user_name: "Igor" }
 * });
 */

const LectureList = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { name } = useLocalSearchParams();
  const { user_name } = useLocalSearchParams();
  const { mode } = useLocalSearchParams();
  const user = useUser();
  const { status: lecture_status, data: lectures } = useQuery({
    queryKey: ["lectures", id],
    enabled: !!id,
    queryFn: () => fetchLecturesForCourse(id[0]!),
  });
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          back={true}
          text={String(
            (mode == "FlashCards" ? "Pamätové Karty: " : "Quiz: ") +
              "Okruhy " +
              name
          )}
        />
      ),
    });
  }, [navigation, user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Box style={styles.buttonList} className="w-[90%] mx-auto flex-1">
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
              flexGrow: 1,
            }}
            className="w-full"
          >
            {!!id && lecture_status === "success" && (
              <>
                {lectures!.map((lecture: Okruh) => (
                  <View className="mt-4" key={lecture.id}>
                    <LectureCard
                      item={lecture}
                      courseID={String(id)}
                      mode={String(mode)}
                    />
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </Box>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  buttonList: {
    marginTop: 10,
    flexDirection: "column", // Usporiada prvky v riadku (name vľavo, zvyšok vpravo)
    gap: 10,
  },
});
export default LectureList;
