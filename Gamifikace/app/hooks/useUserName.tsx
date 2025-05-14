import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useUserName() {
  const [user_name, setUserName] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user_name").then(setUserName);
  }, []);

  return user_name;
}
