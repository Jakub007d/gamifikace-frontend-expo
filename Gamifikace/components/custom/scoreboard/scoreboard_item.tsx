import { View, StyleSheet, Button, Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import getInitials from "@/func/getInitials";
import { Spinner } from "../../ui/spinner";
import { router } from "expo-router";
interface ScoreboardItem {
  score: number;
  user_name: string;
  user_id: string;
  current_user: string;
  possition: string;
}
interface EmptyScoreboardItem {
  pending: boolean;
}
export const ScoreboardItem = (props: ScoreboardItem) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/user/userProfile",
          params: {
            user_id: props.user_id,
            user_name: props.user_name,
          },
        })
      }
    >
      <Box
        className={`bg-white rounded-xl px-4 pt-1 pb-1 ${
          props.current_user === props.user_id
            ? "border-2 border-black"
            : "border border-gray-200"
        }`}
      >
        <HStack className="items-center justify-between flex-wrap gap-x-3">
          <Text className="text-base font-medium">{props.possition}</Text>

          <HStack className="items-center gap-x-3 flex-1">
            <Avatar size="md">
              <Text className="text-white text-sm">
                {getInitials(props.user_name)}
              </Text>
            </Avatar>
            <Text
              className="text-base font-semibold"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {props.user_name}
            </Text>
          </HStack>

          <Text className="text-base font-semibold text-right">
            {props.score} b
          </Text>
        </HStack>
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  score_item: {
    width: "80%",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between", // Vertikálne vycentrovanie
    alignItems: "center", // Horizontálne vycentrovanie
  },
});
