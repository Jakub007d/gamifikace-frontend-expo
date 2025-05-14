import React from "react";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { LucideIcon, Sword, View } from "lucide-react-native";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "react-native";
type Props = {
  action: () => void;
  text: string;
  icon?: LucideIcon;
  notPrimary?: boolean;
  height?: string;
  disabled?: boolean;
  isChallange?: boolean;
  width?: string;
  center?: boolean;
};
export default function fullNavigationButton({
  action,
  text,
  icon,
  notPrimary = false,
  height = "24",
  disabled = false,
  isChallange = false,
  width = "full",
  center = false,
}: Props) {
  const backgroundClass = notPrimary
    ? "bg-secondaryButton"
    : "bg-primaryButton";
  return (
    <Pressable
      className={`p-2 pt-4 pb-4 w-${width} ${backgroundClass} ${
        center ? "mr-auto ml-auto" : ""
      } rounded-2xl shadow-lg flex items-center justify-center`}
      onPress={action}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {icon && (
        <Center>
          <HStack>
            <Icon as={icon} size="xl" color="white" />{" "}
            {isChallange && (
              <Text size="sm" className="text-white text-center mt-1">
                {disabled ? "0/1" : "1/1"}
              </Text>
            )}
          </HStack>
        </Center>
      )}
      <Text size="lg" className="text-white font-bold text-center">
        {text}
      </Text>
    </Pressable>
  );
}
