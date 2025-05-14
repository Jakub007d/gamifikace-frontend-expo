import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import getInitials from "@/func/getInitials";
import { ArrowLeft } from "lucide-react-native";

import { useUser } from "@/app/hooks/useUser";
import { HStack } from "@/components/ui/hstack";

/**
 * CustomHeader komponent zobrazujúci horný navigačný panel.
 *
 * Obsahuje:
 * - tlačidlo "Späť" ak `back` je true,
 * - nadpis (`text`),
 * - a avatar aktuálne prihláseného používateľa (ak je načítaný).
 *
 * @component
 * @example
 * <CustomHeader text="Môj kurz" back={true} />
 *
 * @param {Object} props - Vstupné vlastnosti komponentu.
 * @param {string} props.text - Nadpis zobrazovaný v strede hlavičky.
 * @param {boolean} props.back - Určuje, či sa zobrazí tlačidlo "späť".
 * @param {boolean} [props.courses_list] - Voliteľný parameter, ktorý povolí navigáciu do profilu, aj keď `back` je false.
 *
 * @returns {JSX.Element} React komponent reprezentujúci hlavičku aplikácie.
 */

export default function CustomHeader({
  text,
  back,
  courses_list,
}: {
  text: string;
  back: boolean;
  courses_list?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, loading } = useUser(true);
  return (
    <View
      className="flex-row items-center justify-between bg-white border-b border-gray-200 px-4"
      style={{ paddingTop: insets.top + 5, paddingBottom: 5 }}
    >
      {/* 🔙 Späť + Názov */}
      <HStack className=" items-center gap-x-8">
        {!back && (
          <TouchableOpacity
            disabled={true}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft color="#aaa" size={24} />
          </TouchableOpacity>
        )}
        {back && (
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-semibold">{text}</Text>
      </HStack>

      {/* 👤 Avatar */}
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : user ? (
        <TouchableOpacity
          disabled={!back && !courses_list}
          onPress={() =>
            router.push({
              pathname: "/user/userProfile",
              params: { user_id: user.id, user_name: user.username },
            })
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Avatar size="md">
            <Text className="text-white text-base">
              {getInitials(user.username)}
            </Text>
          </Avatar>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
