import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useUserId() {
  const [user_id, setUserID] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user_id").then(setUserID);
  }, []);

  return user_id;
}
