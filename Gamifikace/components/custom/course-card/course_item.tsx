import { router } from "expo-router";
import React from "react";
import { Text, Pressable } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { CourseCompletion } from "@/constants/props";

interface CourseInfoCardProps {
  course_id: string;
  name: string;
  description: string;
  short_descripstion: string;
  grade: string;
  user_name: string;
  compleated_list: CourseCompletion[];
}
function CourseItem(props: CourseInfoCardProps) {
  const getColorBasedOnPercentage = (percentage: number) => {
    let red, green, blue;

    if (percentage <= 50) {
      red = 255;
      green = Math.round(percentage * 5.1);
      blue = 0;
    } else {
      red = Math.round(255 - (percentage - 50) * 5.1);
      green = 255;
      blue = 0;
    }

    return `rgb(${red}, ${green}, ${blue})`;
  };

  const courseCompletion = props.compleated_list.find(
    (item) => item.course === props.name
  );

  const completionPercentage = courseCompletion?.completion_percentage ?? 0;

  return (
    <>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/courses/course_detail/[course_id]",
            params: {
              course_id: props.course_id,
              name: props.name,
              user_name: props.user_name,
            },
          })
        }
      >
        <Box className="bg-white p-6 mt-1 rounded-lg shadow-md border border-gray-200">
          <HStack className="justify-between items-center">
            <VStack className="space-y-2">
              <Text className="font-bold text-xl text-gray-800">
                {props.name}
              </Text>
              <Text className="text-gray-600">{props.short_descripstion}</Text>
              <Text className="text-gray-600">{props.grade}</Text>
            </VStack>
            <AnimatedCircularProgress
              size={50}
              width={5}
              fill={completionPercentage} // Percento dokončenia (0 až 100)
              tintColor={getColorBasedOnPercentage(completionPercentage)}
              backgroundColor="#D3D3D3"
              rotation={0}
            >
              {(fill: number) => <Text>{`${Math.round(fill)}%`}</Text>}
            </AnimatedCircularProgress>
          </HStack>
        </Box>
      </Pressable>
    </>
  );
}

export default CourseItem;
