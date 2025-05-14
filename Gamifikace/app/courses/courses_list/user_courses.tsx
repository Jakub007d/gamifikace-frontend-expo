import { useFocusEffect, useNavigation } from "expo-router";
import { View, Pressable, StyleSheet, ScrollView } from "react-native";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";
import { Actionsheet, ActionsheetContent } from "@/components/ui/actionsheet";
import { VStack } from "@/components/ui/vstack";
import { Checkbox, CheckboxIndicator } from "@/components/ui/checkbox";
import { Icon, EditIcon } from "@/components/ui/icon";
import { Check } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import fetchCourseByID from "@/api/Downloaders/fetchCourseByID";
import fetchCourses from "@/api/Downloaders/fetchAllCourses";
import { fetchUserCourseCompletion } from "@/api/Downloaders/lectureCompleationDownloader";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import uploadVisitedCourse from "@/api/Uploaders/addVisitedCourse";
import removeVisitedCourse from "@/api/Uploaders/removeVisitedCourse";
import FullNavigationButton from "@/components/custom/customButtons/fullNavigationButton";
import { Box } from "@/components/ui/box";
import { useUser } from "@/app/hooks/useUser";
import AddCourseModal from "@/app/admin/addCourseModal";
import { fetchAchievements } from "@/app/docs-exports";
import CustomHeader from "@/components/custom/navigation/CustomHeader";
import { Course } from "@/constants/props";
import CourseCard from "@/components/custom/course-card/course_card";

/**
 *@screen
 * `HomePage` je Expo Router screen, ktorý slúži ako hlavná obrazovka
 * pre používateľa po prihlásení.
 *
 * Funkcie:
 * - Zobrazuje navštevované kurzy používateľa.
 * - Poskytuje možnosť správy kurzov cez výberové akčné menu (`Actionsheet`).
 * - Umožňuje adminom pridávať nové kurzy (cez modálne okno).
 *
 * Integrácia:
 * - React Query pre fetchovanie dát (`fetchCourses`, `fetchCourseByID`, `fetchUserCourseCompletion`).
 * - `AsyncStorage` pre lokálne dáta a tokeny.
 * - Využíva vlastný `CustomHeader`, `CourseCard`, `FullNavigationButton` a `Fab`.
 *
 * Navigácia:
 * - Navigácia je riešená pomocou `expo-router`.
 * - Používa `useFocusEffect` na obnovenie dát pri návrate na obrazovku.
 *
 * @returns {JSX.Element} Komponent obrazovky so správou kurzov používateľa.
 *
 * @example
 * // Použitie cez navigáciu:
 * router.push("/courses/courses_list/user_courses");
 */

const HomePage = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [isOpen, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [visitedCoursesIds, setVisitedCoursesIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const user = useUser();

  const refreshUserCourses = async () => {
    if (user?.id) {
      queryClient.invalidateQueries({
        queryKey: ["userCourses", user.id],
      });
    }
  };
  const { status: allCoursesStatus, data: allCourses } = useQuery({
    queryKey: ["allCourses"],
    enabled: !!user?.id,
    queryFn: () => fetchCourses(),
  });
  const { status: course_status, data: courses } = useQuery({
    queryKey: ["userCourses", user?.id],
    enabled: !!user?.id,
    queryFn: () => fetchCourseByID(user!.id),
  });
  const { status: compleated, data: compleated_list } = useQuery({
    enabled: !!user?.id,
    queryKey: ["compleated", user?.id],
    queryFn: () => fetchUserCourseCompletion(),
  });
  const { status: achivements_status, data: achivements } = useQuery({
    enabled: !!user?.id,
    queryKey: ["achivements", user?.id],
    queryFn: () => fetchAchievements(user!.id),
  });
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          back={false}
          text={String("Navštevované predmety")}
          courses_list={true}
        />
      ),
    });
  }, [navigation, user?.id, user?.username]);
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({
        queryKey: ["compleated", user?.id],
      });
      return () => {};
    }, [user?.id, queryClient])
  );

  useEffect(() => {
    if (course_status === "success" && courses) {
      const ids = courses.map((course) => course.id); // Extractovanie id navstevovaných kurzov
      setVisitedCoursesIds(ids);
      setSelectedItems(ids);
    }
  }, [course_status, courses]);
  const toggleSelection = (item: string) => {
    setSelectedItems((prevSelected: string[]) => {
      if (prevSelected.includes(item)) {
        removeVisitedCourse(user!.id, item, queryClient);
        return prevSelected.filter((i) => i !== item);
      } else {
        uploadVisitedCourse(user!.id, item, queryClient);
        return [...prevSelected, item];
      }
    });
  };

  return (
    <View className="flex-1 relative">
      <Actionsheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <ActionsheetContent className="flex-1">
          <Text size="3xl" bold={true}>
            Vyberte predmety
          </Text>

          <ScrollView className="flex-1 w-full min-h-[75%] max-h-[75%]">
            <VStack className="space-y-4">
              {allCourses?.map((item) => (
                <Pressable onPress={() => toggleSelection(item.id)}>
                  <HStack
                    key={item.id}
                    className="px-4 py-2 justify-between items-center w-full border-b border-gray-300"
                  >
                    <Text className="text-2xl">{item.name}</Text>
                    <Checkbox
                      value={item.id}
                      size="lg"
                      isChecked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      aria-label={`Select ${item.name}`}
                    >
                      <CheckboxIndicator>
                        <Icon as={Check} size="md" color="white" />
                      </CheckboxIndicator>
                    </Checkbox>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </ScrollView>
          <VStack className="gap-y-4 mt-4 mb-4 w-full items-center min-h-[25%] max-h-[25%]">
            {user?.is_staff && (
              <Button
                className="bg-primaryButton rounded-lg w-4/5 h-14"
                onPress={() => {
                  setShowModal(true);
                }}
              >
                <ButtonText className="text-white">
                  Pridať nový predmet
                </ButtonText>
              </Button>
            )}
            <Button
              className="bg-primaryButton rounded-lg w-4/5 h-14"
              onPress={() => {
                setOpen(false);
                refreshUserCourses();
              }}
            >
              <ButtonText className="text-white">Uložiť výber</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
      <AddCourseModal visible={showModal} onClose={() => setShowModal(false)} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1">
        {!!user?.id &&
          achivements_status === "success" &&
          course_status === "success" &&
          courses.length > 0 &&
          allCoursesStatus === "success" &&
          compleated == "success" &&
          courses!.map((course: Course) => (
            <CourseCard
              key={course.id}
              course_id={course.id}
              description={course.full_name}
              name={course.name}
              grade="TBA"
              short_descripstion={course.full_name}
              user_name={String(user.username)}
              compleated_list={compleated_list}
              profile_view={false}
              achivements={achivements}
            />
          ))}
        {!!user?.id &&
          course_status === "success" &&
          courses.length == 0 &&
          allCoursesStatus === "success" &&
          compleated == "success" && (
            <VStack className="gap-y-10">
              <Text size="xl" className="mr-auto ml-auto">
                Ešte nemáš zapísané žiadne predmety
              </Text>
              <Box className="w-[80%] mr-auto ml-auto">
                <FullNavigationButton
                  action={function (): void {
                    setOpen(!isOpen);
                  }}
                  text={"Pridať predmety"}
                ></FullNavigationButton>
              </Box>
            </VStack>
          )}
      </ScrollView>

      {/* FAB umiestnený absolútne */}
      {course_status === "success" && courses.length > 0 && (
        <Fab
          size="lg"
          className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 absolute bottom-4 right-4"
          onPress={() => setOpen(!isOpen)}
        >
          <FabIcon as={EditIcon} color="white" />
          <FabLabel>Pridať predmet</FabLabel>
        </Fab>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  leftColumn: {
    flex: 1,
    justifyContent: "center",
  },
  rightColumn: {
    flex: 2,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default HomePage;
