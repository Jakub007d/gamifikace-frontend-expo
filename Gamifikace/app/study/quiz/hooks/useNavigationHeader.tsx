import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { useUserName } from "@/app/hooks/useUserName";
import { useUserId } from "@/app/hooks/useUserId";
import CustomHeader from "@/components/custom/navigation/CustomHeader";

interface NavigationHeaderProps {
  is_challange: string;
}

export const useNavigationHeader = ({
  is_challange,
}: NavigationHeaderProps) => {
  const navigation = useNavigation();
  const userName = useUserName();
  const user_id = useUserId();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomHeader
          back={is_challange === "false"}
          text={is_challange === "true" ? "Výzva" : "Quiz"}
        />
      ),
    });
  }, [navigation, is_challange, user_id, userName]);
};
