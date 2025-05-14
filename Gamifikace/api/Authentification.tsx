import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import fetchUserID from "./Downloaders/fetchUserID";
import { API_URL } from "./constants";
import fetchUserName from "./Downloaders/userDataDownloader";
import fetchUserData from "./Downloaders/userDataDownloader";
interface User {
  username: string;
  password: string;
}

interface TokenResponse {
  access: string; // Change based on your API response
  refresh: string; // Change based on your API response
}
/**
 * Funkcia, ktorá autentifikuje používateľa pomocou prihlasovacích údajov.
 * Po úspešnom prihlásení uloží access a refresh token do AsyncStorage,
 * spolu s ID a údajmi používateľa.
 *
 * @param {User} user - Objekt obsahujúci prihlasovacie meno a heslo.
 * @returns {Promise<boolean>} True ak autentifikácia prebehla úspešne, inak false.
 */
export async function Authentification(user: User): Promise<boolean> {
  try {
    const response = await axios.post(API_URL + "/token/", user, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });

    // Clear stored tokens
    {
      /*
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
        await AsyncStorage.removeItem("user_id");
      */
    }

    // Store tokens using AsyncStorage
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.setItem("access_token", response.data.access);
    await AsyncStorage.removeItem("user_name");
    await AsyncStorage.setItem("user_name", user.username);
    await AsyncStorage.setItem("refresh_token", response.data.refresh);
    const userID = await fetchUserID(response.data.access);
    const user_data = await fetchUserData(userID);
    await AsyncStorage.setItem("user", JSON.stringify(user_data[0]));
    await AsyncStorage.setItem("user_id", userID);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access}`;
    return true;
  } catch (error) {
    return false;
  }
}
