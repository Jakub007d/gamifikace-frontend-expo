import { View } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchScore from "@/api/Downloaders/fetchScoreboard";
import { Spinner } from "@/components/ui/spinner";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import React, { useCallback } from "react";

import Top3Scoreboard from "./top3_scoreboard";
import { Score } from "@/constants/props";
import { router, useFocusEffect } from "expo-router";
import { ScoreboardItem } from "./scoreboard_item";
import { useUser } from "@/app/hooks/useUser";

interface ScoreBoardProps {
  user_id: string;
  course_id: string;
  user_name: string;
  course_name: string;
}

const getScoreBoardForUser = (
  score: Score[],
  userIndex: number
): (Score & { originalIndex: number })[] => {
  // používateľ je v top 3 -> zobraz 4. a 5. miesto
  if (userIndex >= 0 && userIndex < 3) {
    return score.slice(3, 5).map((item) => ({
      ...item,
      originalIndex: score.indexOf(item),
    }));
  }

  // inak zobraz 1 nad používateľom a jeho samotného
  const startIndex = Math.max(userIndex - 1, 0);
  const endIndex = userIndex + 1;

  return score.slice(startIndex, endIndex).map((item) => ({
    ...item,
    originalIndex: score.indexOf(item),
  }));
};

const ScoreBoard = (props: ScoreBoardProps) => {
  const user = useUser();
  const { status, data: scores } = useQuery({
    queryKey: ["score", props.course_id],
    queryFn: () => fetchScore(props.course_id),
  });

  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      queryClient.refetchQueries({
        queryKey: ["score", props.course_id],
      });
    }, [props.course_id])
  );

  if (status === "success") {
    const userIndex = scores.findIndex(
      (score) => String(score.user) === String(props.user_id)
    );

    const refinedScore = getScoreBoardForUser(scores, userIndex);

    return (
      <VStack className=" w-full px-4 py-2">
        <Box className=" bg-gray-200 rounded-2xl w-full px-4 py-3">
          <VStack className=" justify-between">
            <VStack>
              <Center className="mb-3">
                <Text className="text-xl font-bold">Rebríček</Text>
              </Center>

              {/* Horná časť s Top 3 a zoznamom */}
              <VStack className="gap-y-2">
                <Top3Scoreboard
                  score={scores.slice(0, 3)}
                  userID={props.user_id}
                />

                {refinedScore.length > 0 && (
                  <VStack className="mt-2 gap-y-2">
                    {refinedScore.map((score_1, index) => (
                      <ScoreboardItem
                        key={index}
                        score={score_1.points}
                        user_name={score_1.username}
                        user_id={score_1.user}
                        current_user={props.user_id}
                        possition={`${score_1.originalIndex + 1}.`}
                      />
                    ))}
                  </VStack>
                )}
              </VStack>
            </VStack>

            {/* Tlačidlo zarovnané dolu */}
            <View className="mt-4">
              <Button
                disabled={scores.length < 3}
                className={`py-2 px-4 rounded-md border transition w-full ${
                  scores.length < 3
                    ? "border-gray-400 bg-transparent"
                    : "bg-secondaryButton"
                }`}
                onPress={() =>
                  router.push({
                    pathname: "/courses/course_detail/scoreboard_full",
                    params: {
                      course_id: props.course_id,
                      user_id: props.user_id,
                      user_name: props.user_name,
                      course_name: props.course_name,
                    },
                  })
                }
              >
                <ButtonText
                  className={`text-lg ${
                    scores.length < 3 ? "text-gray-400" : "text-white"
                  } text-center`}
                >
                  Viac
                </ButtonText>
              </Button>
            </View>
          </VStack>
        </Box>
      </VStack>
    );
  }

  if (status === "pending") {
    return (
      <View className="w-4/5 h-3/5 mx-auto mt-4 flex justify-center items-center border-2 border-gray-400 rounded-lg p-2">
        <HStack className="flex-row space-x-2 justify-center">
          <Spinner
            className="text-blue-500"
            accessibilityLabel="Loading posts"
          />
          <Heading className="text-blue-500 text-md">
            <Text>Loading</Text>
          </Heading>
        </HStack>
      </View>
    );
  }

  if (status === "error")
    return <View className="w-4/5 h-3/5 mx-auto mt-4"></View>;
};

export default ScoreBoard;
