import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VStack } from "@/components/ui/vstack";
import ScoreBoard from "@/components/custom/scoreboard/scoreboard";
import {
  BookOpen,
  Brain,
  HelpCircle,
  Plus,
  Sword,
  FolderKanban,
} from "lucide-react-native";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import SideNavigationButton from "@/components/custom/customButtons/sideNavigationButton";
import FullNavigationButton from "@/components/custom/customButtons/fullNavigationButton";
import { useUserName } from "@/app/hooks/useUserName";
import { scoreChecker } from "./functions/scoreChecker";
import fetchScore from "@/api/Downloaders/fetchScoreboard";
import { useUser } from "@/app/hooks/useUser";
import { HStack } from "@/components/ui/hstack";
import CustomHeader from "@/components/custom/navigation/CustomHeader";

/**
 * @screen
 * `CourseDetail` je hlavná obrazovka predmetu, ktorá poskytuje prehľad a navigáciu
 * k rôznym režimom učenia a výzve v rámci konkrétneho kurzu.
 *
 * Funkcionalita:
 * - Zobrazuje skrátený rebríček (scoreboard) aktuálneho používateľa pre daný kurz.
 * - Ponúka navigáciu do režimov:
 *    - Výzva (challenge)
 *    - Pamäťové karty
 *    - Quiz
 * - Umožňuje pridať novú otázku cez FAB tlačidlo.
 *
 * Navigácia:
 * - Používa `useLocalSearchParams` na získanie parametrov:
 *   - `course_id: string` – ID kurzu
 *   - `name: string` – názov kurzu
 * - Pri prechode do výzvy overuje, či používateľ ešte neabsolvoval výzvu (`scoreChecker`).
 *
 * Komponenty:
 * - `ScoreBoard`: Zobrazí rebríček pre daný predmet.
 * - `FullNavigationButton`, `SideNavigationButton`: Na spustenie jednotlivých režimov.
 * - `Fab`: Tlačidlo pre pridanie otázky (umiestnené vpravo dole).
 * - `CustomHeader`: Vlastný header s názvom predmetu.
 *
 *
 * @returns {JSX.Element} Expo Router obrazovka zobrazujúca detail kurzu.
 *
 * @example
 * router.push({
 *   pathname: "/courses/course_detail/[course_id]",
 *   params: {
 *     course_id: "5",
 *     name: "Integrované obvody"
 *   }
 * });
 */

const CourseDetail = () => {
  const navigation = useNavigation();
  const user = useUser();
  const { course_id } = useLocalSearchParams();
  const { name } = useLocalSearchParams();

  const { user_name1 } = useLocalSearchParams();
  // generate checker that will check if user has score for this course
  const user_name = useUserName();
  const queryClient = useQueryClient();
  const { status, data: scores } = useQuery({
    queryKey: ["score", course_id, "full"],
    queryFn: () => fetchScore(String(course_id)),
  });
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: ["score", course_id],
        });
      }
      return () => {};
    }, [course_id, queryClient])
  );
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader back={true} text={String("Detail predmetu " + name)} />
      ),
    });
  }, [navigation, user?.id, user_name]);
  return (
    <SafeAreaView className="flex-1" edges={["bottom", "right", "left"]}>
      <View className="flex-1 bg-backgroundLight50 relative">
        <VStack className="flex-1 p-5 gap-y-5">
          {/* Scoreboard */}
          {user?.id && (
            <View className="flex-[2]">
              <ScoreBoard
                course_id={String(course_id)}
                course_name={String(name)}
                user_id={String(user.id)}
                user_name={String(user_name)}
              />
            </View>
          )}

          {/* Výber režimu */}
          <VStack className="flex-[1] gap-y-5 justify-start">
            {user?.is_staff && (
              <HStack className="w-full justify-between gap-x-2">
                <View className="w-[49%]">
                  <FullNavigationButton
                    isChallange={true}
                    disabled={
                      status !== "success"
                        ? true
                        : scoreChecker(scores, String(user?.id))
                    }
                    action={() => {
                      router.push({
                        pathname: "/study/quiz/challangeDescription",
                        params: {
                          id: String(course_id),
                          is_challange: "true",
                          course_id: course_id,
                          disabled: String(
                            scoreChecker(scores ? scores : [], String(user?.id))
                          ),
                        },
                      });
                    }}
                    text={"Výzva"}
                    icon={Sword}
                  />
                </View>
                <SideNavigationButton
                  notPrimary={false}
                  action={() =>
                    router.push({
                      pathname: "/courses/lectures/lecture_list",
                      params: {
                        id: course_id,
                        name: name,
                        user_name: user_name,
                        mode: "FlashCards",
                      },
                    })
                  }
                  text={"Správa otázok"}
                  icon={FolderKanban}
                />
              </HStack>
            )}
            {!user?.is_staff && (
              <View>
                <FullNavigationButton
                  isChallange={true}
                  action={() => {
                    router.push({
                      pathname: "/study/quiz/challangeDescription",
                      params: {
                        id: String(course_id),
                        is_challange: "true",
                        course_id: course_id,
                      },
                    });
                  }}
                  text={"Výzva"}
                  icon={Sword}
                  disabled={scoreChecker(
                    scores ? scores : [],
                    String(user?.id)
                  )}
                />
              </View>
            )}

            <View className="flex-row justify-between gap-1.5">
              <SideNavigationButton
                notPrimary={true}
                action={() =>
                  router.push({
                    pathname: "/courses/lectures/lecture_list",
                    params: {
                      id: course_id,
                      name: name,
                      user_name: user_name,
                      mode: "FlashCards",
                    },
                  })
                }
                text={"Pamäťové karty"}
                icon={Brain}
              />
              <SideNavigationButton
                notPrimary={true}
                action={() =>
                  router.push({
                    pathname: "/courses/lectures/lecture_list",
                    params: {
                      id: course_id,
                      name: name,
                      user_name: user_name,
                      mode: "Quiz",
                    },
                  })
                }
                text={"Quiz"}
                icon={HelpCircle}
              />
            </View>
          </VStack>
        </VStack>
        <View className="absolute bottom-4 right-4">
          <Fab
            size="lg"
            className="bg-primary-600 px-2 py-2 rounded-full flex-row items-center gap-1"
            onPress={() =>
              router.push({
                pathname: "/study/add_screens/add_question_screen",
                params: {
                  lectureID: "-1",
                  lectureName: "-1",
                  courseID: course_id,
                },
              })
            }
          >
            <FabIcon as={Plus} color="white" />
            <FabLabel>Pridať otázku</FabLabel>
          </Fab>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  button: {
    margin: 10,
    display: "flex",
    gap: 10,
  },
});
export default CourseDetail;
