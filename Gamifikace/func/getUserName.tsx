import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function getUserNameFromStorage(): Promise<string | null> {
  return await AsyncStorage.getItem("user_name");
}
