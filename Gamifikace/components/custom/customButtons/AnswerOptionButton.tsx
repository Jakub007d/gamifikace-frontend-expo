import React from "react";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Square, SquareCheck } from "lucide-react-native";
import { Answer } from "@/constants/props";
import { HStack } from "@/components/ui/hstack";

type Props = {
  answer: Answer;
  isSelected: boolean;
  onSelect: () => void;
  answersSent: boolean;
  backgroundColor: string | undefined;
  multipleAnswers?: boolean;
};

function brightenHexColour(hex: string, amount: number = 180): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function AnswerOptionButton({
  answer,
  isSelected,
  onSelect,
  answersSent,
  backgroundColor,
  multipleAnswers = true,
}: Props) {
  const color = answersSent && backgroundColor ? backgroundColor : "#0A5999";

  const backgroundColorStyle =
    answersSent && backgroundColor
      ? brightenHexColour(backgroundColor)
      : !multipleAnswers && isSelected
      ? brightenHexColour("#0A5999")
      : "transparent";

  return (
    <Pressable
      onPress={!answersSent ? onSelect : undefined}
      className="w-full rounded-2xl border-2 my-1 px-4 py-3 min-h-[60px]"
      style={{
        backgroundColor: backgroundColorStyle,
        borderColor: color,
      }}
    >
      {multipleAnswers ? (
        <HStack className="items-center space-x-3">
          <Icon
            as={isSelected ? SquareCheck : Square}
            size="md"
            color={color}
          />
          <Text
            className="font-bold text-base flex-1 flex-wrap"
            style={{ color }}
          >
            {answer.text}
          </Text>
        </HStack>
      ) : (
        <Text
          className="font-bold text-base text-center px-2"
          style={{ color }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {answer.text}
        </Text>
      )}
    </Pressable>
  );
}
