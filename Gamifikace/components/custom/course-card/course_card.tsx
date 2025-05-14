import React, { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { router, useFocusEffect } from "expo-router";
import { Achievement, CourseCompletion } from "@/constants/props";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchScore from "@/api/Downloaders/fetchScoreboard";
import getPosition from "@/func/getPossition";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
interface CourseInfoCardProps {
  course_id: string;
  name: string;
  description: string;
  short_descripstion: string;
  grade: string;
  user_name: string;
  compleated_list: CourseCompletion[];
  profile_view: boolean;
  achivements?: Achievement[];
}

export default function CourseCard(props: CourseInfoCardProps) {
  const [user_id, setUserID] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const retrieveUserID = async () => {
    const userID = await AsyncStorage.getItem("user_id");
    setUserID(userID);
  };
  const courseCompletion = props.compleated_list.find(
    (item) => item.course === props.name
  );
  const getColorBasedOnPercentage = (percentage: number) => {
    let red, green, blue;

    if (percentage <= 50) {
      // Gradual transition from red to orange (0% to 50%)
      red = 255;
      green = Math.round(percentage * 5.1); // Gradually increases green
      blue = 0;
    } else {
      // Gradual transition from orange to green (50% to 100%)
      red = Math.round(255 - (percentage - 50) * 5.1); // Gradually decrease red
      green = 255;
      blue = 0;
    }

    return `rgb(${red}, ${green}, ${blue})`; // Return the interpolated color
  };
  const { status, data: scores } = useQuery({
    queryKey: ["score", props.course_id],
    queryFn: () => fetchScore(props.course_id),
  });

  useFocusEffect(
    useCallback(() => {
      retrieveUserID(); // Your existing function
      queryClient.invalidateQueries({ queryKey: ["score", props.course_id] });
    }, [queryClient, props.course_id]) // Dependencies
  );
  const completionPercentage = courseCompletion?.completion_percentage ?? 0;
  return (
    <>
      <Pressable
        onPress={() => {
          if (!props.profile_view) {
            router.push({
              pathname: "/courses/course_detail/[course_id]",
              params: {
                course_id: props.course_id,
                name: props.name,
                user_name: props.user_name,
              },
            });
          }
        }}
      >
        <Box className="bg-white p-6 mt-1 rounded-lg shadow-md border border-gray-200 w-full">
          <HStack className="justify-between items-start space-x-4">
            <VStack className="space-y-2" style={{ flex: 1 }}>
              <Text className="font-bold text-xl text-gray-800">
                {props.name}
              </Text>
              <Text className="text-gray-600">{props.short_descripstion}</Text>
              <Text className="text-gray-600">{props.grade}</Text>
            </VStack>

            <HStack className="space-x-2">
              <VStack className="mr-2">
                <HStack className="space-x-2 mt-2">
                  <FontAwesome
                    key={2}
                    name="trophy"
                    size={24}
                    color={
                      props.achivements != null &&
                      props.achivements.some(
                        (ach) =>
                          ach.name === "Dosiahnuté 1. miesto v " + props.name
                      )
                        ? "gold"
                        : "gray"
                    }
                  />
                  <View className="w-5"></View>
                  <FontAwesome
                    key={1}
                    name="check-circle"
                    size={24}
                    color={completionPercentage == 100 ? "green" : "gray"}
                  />
                </HStack>
                <Text className="text-gray-800 font-semibold">
                  {status === "success" &&
                  user_id != null &&
                  getPosition(scores, user_id) != "-"
                    ? "Pozicia:" + getPosition(scores, user_id)
                    : ""}
                </Text>
              </VStack>
              {!props.profile_view && (
                <AnimatedCircularProgress
                  size={50}
                  width={5}
                  fill={completionPercentage}
                  tintColor={getColorBasedOnPercentage(completionPercentage)}
                  backgroundColor="#D3D3D3"
                  rotation={0}
                >
                  {(fill: number) => <Text>{`${Math.round(fill)}%`}</Text>}
                </AnimatedCircularProgress>
              )}
            </HStack>
          </HStack>
        </Box>
      </Pressable>
    </>
  );
}
