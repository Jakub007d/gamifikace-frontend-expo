import React from "react";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { LucideIcon, Sword } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
type Props = {
  action: () => void;
  text: string;
  icon: LucideIcon;
  notPrimary?: boolean;
};
export default function sideNavigationButton({
  action,
  text,
  icon,
  notPrimary = false,
}: Props) {
  const backgroundClass = notPrimary
    ? "bg-secondaryButton"
    : "bg-primaryButton";
  return (
    <Pressable
      className={`p-2 pt-4 pb-4 w-[49%] ${backgroundClass} rounded-2xl shadow-lg flex items-center justify-center`}
      onPress={action}
    >
      {icon && <Icon as={icon} size="xl" color="white" />}
      <Text size="lg" className="text-white font-bold text-center">
        {text}
      </Text>
    </Pressable>
  );
}
