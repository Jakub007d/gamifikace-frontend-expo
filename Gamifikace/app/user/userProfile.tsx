import React, { useEffect } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trophy } from "lucide-react-native";
import getInitials from "@/func/getInitials";
import { Course } from "@/constants/props";
import fetchAchievements from "@/api/Downloaders/fetchUserAchivements";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";
import fetchCourseByID from "@/api/Downloaders/fetchCourseByID";
import { fetchUserCourseCompletion } from "@/api/Downloaders/lectureCompleationDownloader";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { ScrollView } from "react-native";
import CourseCard from "@/components/custom/course-card/course_card";
import FullNavigationButton from "@/components/custom/customButtons/fullNavigationButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../hooks/useUser";
import CustomHeader from "@/components/custom/navigation/CustomHeader";

/**
 * @screen
 * Komponent používateľského profilu.
 *
 * Zobrazuje:
 * - základné informácie o používateľovi (avatar, meno),
 * - zoznam dosiahnutých odmien (achievementov),
 * - zoznam navštevovaných kurzov a ich stav dokončenia,
 * - možnosť odhlásenia, ak sa zobrazuje vlastný profil.
 *
 * Údaje sú získavané cez React Query a lokálne parametre z `expo-router`.
 *
 *
 *
 * @returns {JSX.Element} Komponent zobrazujúci profil používateľa s kurzami, odmenami a tlačidlom odhlásenia.
 */
export default function userProfile() {
  const { user_id, user_name } = useLocalSearchParams();
  const user = useUser();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { status: achievements_status, data: achievements } = useQuery({
    queryKey: ["achivements", user_id],
    queryFn: () => fetchAchievements(String(user_id)),
  });
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["achivements", user_id],
    });
  });
  const { status: course_status, data: courses } = useQuery({
    queryKey: ["userCourses", user_id],
    enabled: !!user_id,
    queryFn: () => fetchCourseByID(String(user_id)),
  });
  const { status: compleated, data: compleated_list } = useQuery({
    queryKey: ["compleated", user_id],
    queryFn: () => fetchUserCourseCompletion(),
  });

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          back={true}
          text={String("Profil používateľa " + user_name)}
        />
      ),
    });
  }, [navigation, user_name]);
  return (
    <VStack className="flex-1">
      <VStack className="gap-y-4 items-center p-4 rounded-lg bg-backgroundLight shadow-md h-[40%]">
        <HStack className="items-center gap-x-4 self-start">
          <Avatar size="md">
            <Text className="text-white text-base">
              {getInitials(String(user_name))}
            </Text>
          </Avatar>
          <Text className="text-xl font-bold text-2xl">{user_name}</Text>
        </HStack>

        <Divider className="h-1 bg-gray-200" />
        <Text className="text-xl font-semibold">Odmeny</Text>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          className="w-full"
        >
          <VStack className="gap-y-4">
            {achievements_status === "success" &&
              achievements.map((achievement) => (
                <HStack
                  key={achievement.id}
                  className="gap-x-3 w-full items-center bg-gray-200 p-2 rounded-lg shadow-sm"
                >
                  {achievement.name.includes("Dokončené") ? (
                    <FontAwesome
                      key={1}
                      name="check-circle"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <Icon as={Trophy} className="w-5 h-5 text-yellow-500" />
                  )}
                  <Text className="text-md font-medium">
                    {achievement.name}
                  </Text>
                </HStack>
              ))}
          </VStack>
        </ScrollView>

        {achievements_status === "pending" && (
          <Spinner className="text-emerald-500" />
        )}
        {achievements_status === "error" && (
          <Text className="text-red-500">Chyba pri načítaní</Text>
        )}
      </VStack>
      <VStack className="gap-y-4 items-center p-4 h-[54%] rounded-lg bg-backgroundLight shadow-md">
        <Text className="text-xl font-semibold mt-5">Navštevované kurzy</Text>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          className="w-full h-1/2"
        >
          {!!user_id &&
            course_status === "success" &&
            compleated == "success" &&
            courses!.map((course: Course) => (
              <>
                <CourseCard
                  key={course.id}
                  course_id={course.id}
                  description={course.full_name}
                  name={course.name}
                  grade="TBA"
                  short_descripstion={course.full_name}
                  user_name={String(user_name)}
                  compleated_list={compleated_list}
                  profile_view={true}
                  achivements={achievements}
                ></CourseCard>
              </>
            ))}
          {/* Display the access token retrieved from AsyncStorage */}
        </ScrollView>
      </VStack>
      {user === null ? (
        <Spinner className="text-primary" />
      ) : String(user_id) === String(user!.id) ? (
        <Box className="w-[98%] ml-auto mr-auto">
          <FullNavigationButton
            height={"12"}
            action={async () => {
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{ name: "index" }], // Použite 'name' a názov obrazovky pre '/' ("index")
              });
            }}
            text={"Odhlásiť sa"}
          />
        </Box>
      ) : null}
    </VStack>
  );
}
