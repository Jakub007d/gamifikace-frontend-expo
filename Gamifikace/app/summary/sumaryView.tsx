import axios from "axios";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { Pressable, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import fetchQuestions from "@/api/Downloaders/fetchQuestions";
import { API_URL } from "@/api/constants";
import { Question, SavedQuestion } from "@/constants/props";
import FullNavigationButton from "@/components/custom/customButtons/fullNavigationButton";
import { Pre } from "@expo/html-elements";
import { Audio } from "expo-av";
import { useUserId } from "../hooks/useUserId";
import { useCourseByID } from "../hooks/useCourseByID";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { Center } from "@/components/ui/center";
import CustomHeader from "@/components/custom/navigation/CustomHeader";
/**
 * @screen
 * Obrazovka súhrnu výsledkov (SumaryView) po absolvovaní kvízu alebo výzvy.
 *
 *  Navigovateľná obrazovka v prostredí Expo Router (Next.js štýl).
 *
 * Funkcionalita:
 * - Získava dáta o otázkach, skóre, čase a správnych odpovediach.
 * - Zobrazuje výsledky, progres bar, skóre, a prehráva zvuk podľa úspešnosti.
 * - Označí okruh ako dokončený (ak žiadna odpoveď nie je chybná).
 * - Zobrazuje detailnú spätnú väzbu na všetky otázky.
 * - Obsahuje navigačné tlačidlá späť na detail kurzu alebo zoznam kurzov.
 *
 * Hooky a dáta:
 * - `useLocalSearchParams` na získanie parametrov z URL (napr. score, id, bad, time...),
 * - `useUserId`, `useCourseByID` na získanie používateľa a kurzu,
 * - `useQuery` na načítanie otázok.
 * - `AsyncStorage` na správu tokenu a uložených otázok.
 *
 * @fileoverview Expo Router stránka (TSX) typu `summary/sumaryView.tsx`, ktorá zobrazuje súhrn výsledkov po kvíze.
 *
 * @component
 * @example
 * // Navigácia do súhrnu výsledkov po teste:
 * router.push({
 *   pathname: "/summary/sumaryView",
 *   params: { id: "123", score: "90", bad: "1", is_challange: "false" },
 * });
 *
 * @returns {JSX.Element} Zobrazí súhrnný prehľad odpovedí, hodnotenie a navigáciu späť.
 */
const SumaryView = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const userID = useUserId();
  const {
    score,
    bad,
    id,
    bad_index,
    is_challange,
    time,
    course_id,
    correct_answers,
  } = useLocalSearchParams();
  const [token, setToken] = useState("");
  const [isLectureCompleted, setIsLectureCompleted] = useState(false);
  const [saved_questions, setSavedQuestion] = useState<SavedQuestion[]>([]);
  const { course, isLoading, error } = useCourseByID(String(course_id));

  const { status: questions_status, data: questions } = useQuery({
    queryKey: ["questions", id],
    enabled: !!id,
    queryFn: () =>
      fetchQuestions(
        typeof id === "string" ? id : id.join(", "),
        String(is_challange)
      ),
  });
  const totalQuestions = questions?.length ?? 0;
  const correctAnswers = totalQuestions - Number(bad);
  const progress =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  const handleHappySound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/happy.mp3")
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  };
  const handleSadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/sad.mp3")
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  };
  useEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader back={true} text={String("Súhrn")} />,
    });
  }, [navigation]);
  useEffect(() => {
    const loadSavedQuestions = async () => {
      const saved = await AsyncStorage.getItem("saved_questions");
      if (saved) {
        const parsed = JSON.parse(saved) as SavedQuestion[];
        setSavedQuestion(parsed);
      }
    };
    loadSavedQuestions();
  }, []);

  // Funkcia na získanie access_tokenu
  const retrieveToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("access_token");
      if (userToken) {
        setToken(userToken);
      } else {
        alert("Chyba pri získavaní tokenu.");
      }
    } catch (error) {
      console.error("Chyba pri získavaní tokenu:", error);
    }
  };

  // Funkcia na dokončeinie okruhu
  const handleCompleteLecture = async (accessToken: string) => {
    if (is_challange === "false")
      try {
        const response = await axios.post(
          API_URL + `/lecture/${String(id)}/complete/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          setIsLectureCompleted(true);
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error completing lecture:", error);
      }
  };

  useEffect(() => {
    const initialize = async () => {
      await retrieveToken();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (token && !isLectureCompleted && Number(bad) == 0) {
      handleCompleteLecture(token);
    }
  }, [token]);
  useEffect(() => {
    if (questions_status === "success" && Number(bad) === 0) {
      handleHappySound(); // prehrá zvuk len raz
    }
  }, [questions_status, bad, score]);
  useEffect(() => {
    if (questions_status === "success" && Number(bad) != 0) {
      handleSadSound(); // prehrá zvuk len raz
    }
  }, [questions_status, bad, score]);
  console.log("Cislo" + Number(bad));
  if (questions_status === "success") {
    if (true) {
      return (
        <VStack className="flex-1 p-4 gap-y-1">
          {is_challange == "false" && Number(bad) != 0 && (
            <Text size="xl" className="text-center text-red-500">
              Mal si viacej ako jednu nesprávnu odpoved. Skús to znovu aby si
              dokončil okruh úspešne.
            </Text>
          )}

          <VStack className="flex-[0.5] w-full">
            <HStack className="  justify-between items-center mt-2">
              <Text className="mb-2 text-base text-gray-700 text-xl text-bold">
                Správne odpovede:
              </Text>
              <Box className="relative w-[50%] h-10">
                <Progress
                  value={progress}
                  className=" rounded-full h-full bg-gray-300 overflow-hidden"
                >
                  <ProgressFilledTrack className="bg-green-400" />
                </Progress>
                <Box className="absolute inset-0 flex items-center justify-center">
                  <Text size="xl" className="text-center text-gray-600">
                    {Number(
                      questions_status
                        ? questions!.length == 0
                          ? 0
                          : questions!.length
                        : 0
                    ) - Number(bad)}
                    /{Number(questions_status ? questions!.length : 0)}
                  </Text>
                </Box>
              </Box>
            </HStack>
            {is_challange == "true" && (
              <>
                <HStack className="justify-between items-center mt-2">
                  <Text className="mb-2 text-base text-gray-700 text-xl text-bold">
                    Tvoj čas:
                  </Text>
                  <Box className="relative w-[50%] h-10 rounded-full h-full bg-gray-300 overflow-hidden">
                    <Box className="absolute inset-0 flex items-center justify-center">
                      <Text size="xl" className="text-center text-gray-600">
                        {time} sekúnd
                      </Text>
                    </Box>
                  </Box>
                </HStack>
                <HStack className="justify-between items-center mt-2">
                  <Text className="mb-2 text-base text-gray-700 text-xl text-bold">
                    Získané skóre:
                  </Text>
                  <Box className="relative w-[50%] h-10 rounded-full h-full bg-gray-300 overflow-hidden">
                    <Box className="absolute inset-0 flex items-center justify-center">
                      <Text size="xl" className="text-center text-gray-600">
                        {Math.round(Number(score))}b
                      </Text>
                    </Box>
                  </Box>
                </HStack>
              </>
            )}
          </VStack>
          <Divider className="h-1 bg-gray-200 mt-10" />
          <Text className="mb-2 text-center text-gray-700 text-xl text-bold mt-5">
            Detail otázok:
          </Text>

          <View className="flex-[3]">
            <ScrollView
              className="w-full"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {questions!.map((question: Question, index) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/summary/answeredQuestionDetail",
                      params: { questionIndex: index },
                    })
                  }
                >
                  <Box
                    key={index}
                    className={`w-full border-2 mt-2 border-gray-300 text-center p-4 rounded-lg mx-auto flex justify-center items-center ${
                      bad_index.includes(String(index))
                        ? "bg-red-500"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text className="text-lg font-semibold text-gray-800">
                      {question.name}
                    </Text>
                  </Box>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <FullNavigationButton
            action={async function (): Promise<void> {
              await AsyncStorage.removeItem("saved_questions");
              router.push({
                pathname: "/courses/course_detail/[course_id]",
                params: {
                  course_id: String(course_id),
                  name: course!.name,
                  user_name: "JOZEF",
                },
              });
            }}
            text={"Späť na detail predmetu"}
            height="20"
          />
          <FullNavigationButton
            action={async function (): Promise<void> {
              await AsyncStorage.removeItem("saved_questions");
              router.push({
                pathname: "/courses/courses_list/user_courses",
                params: { user_id: String(userID) },
              });
            }}
            text={"Späť na zoznam predmetov"}
            height="20"
          />
        </VStack>
      );
    }
  } else if (questions_status === "pending") {
    return (
      <VStack className="flex-1">
        <Center className="flex-1">
          <VStack className="items-center space-y-2">
            <Spinner
              className="text-blue-500"
              accessibilityLabel="Načítavam súhrn"
            />
            <Text className="text-md text-gray-700 font-medium">
              Načítavam súhrn…
            </Text>
          </VStack>
        </Center>
      </VStack>
    );
  } else {
    <VStack className="flex-1">
      <Center className="flex-1">
        <VStack className="items-center space-y-2">
          <Text className="text-lg text-red-700 font-medium">
            Chyba načítavania súhrnu skús to prosím neskôr.
          </Text>
        </VStack>
      </Center>
    </VStack>;
  }
};

export default SumaryView;
