import React from "react";
import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import getInitials from "@/func/getInitials";
import { Score } from "@/constants/props";
import { Box } from "../../ui/box";
import { Avatar } from "../../ui/avatar";
import { VStack } from "../../ui/vstack";

interface UserScoreCardProps {
  score: Score[];
  userID: string;
  index: number;
  place: string;
  place_colour: string;
  first: boolean;
}

const Top3ScoreboardPressable = (props: UserScoreCardProps) => {
  const user = props.score[props.index];
  if (!user) return null;

  const isCurrentUser = props.userID === user.user;

  return (
    <VStack
      className="items-center justify-center flex-1 min-w-[90px] max-w-[120px]"
      style={{
        marginBottom: props.first ? 30 : 0, // zvýši pozíciu 1. miesta
      }}
    >
      <Text
        style={{
          color: props.place_colour,
          fontWeight: "bold",
          fontSize: 18,
          marginBottom: 4,
        }}
      >
        {props.place}
      </Text>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/user/userProfile",
            params: {
              user_id: user.user,
              user_name: user.username,
            },
          })
        }
        style={{ width: "100%", alignItems: "center" }}
      >
        <Box
          className={`bg-white rounded-lg p-3 items-center justify-center w-full ${
            isCurrentUser ? "border-2 border-black" : "border border-gray-300"
          }`}
        >
          <Avatar size="md">
            <Text className="text-white text-md">
              {getInitials(user.username)}
            </Text>
          </Avatar>
          <Text
            className="text-center font-semibold mt-1"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {user.username}
          </Text>
          <Text className="text-center text-sm text-gray-600">
            {user.points ?? "0"} b
          </Text>
        </Box>
      </Pressable>
    </VStack>
  );
};

export default Top3ScoreboardPressable;
