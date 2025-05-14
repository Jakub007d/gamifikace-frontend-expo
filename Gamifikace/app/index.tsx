import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import React, { useEffect, useState } from "react";
import { Authentification } from "../api/Authentification";
import { router, useNavigation } from "expo-router";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Image } from "@/components/ui/image";
import { showToast } from "@/components/custom/customToast/customToast";
import { EyeOffIcon, EyeIcon, User } from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import { SafeAreaView, View } from "react-native";

interface User {
  username: string;
  password: string;
}
/**
 * @screen
 * Prihlasovacia obrazovka aplikácie.
 * Umožňuje používateľovi zadať meno a heslo a pokúsiť sa prihlásiť do systému.
 *
 * Obsahuje spracovanie zobrazenia/skrývania hesla, spracovanie chybných údajov
 * a navigáciu po úspešnom prihlásení.
 *
 * @component
 */

const Login = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Nastavenie custom navigačného headera
  useEffect(() => {
    navigation.setOptions({
      title: "Prihlásenie",
      headerBackVisible: false,
    });
  }, [navigation]);

  /**
   * Spracovanie prihlásenia používateľa.
   *
   * @param {User} user - Objekt s používateľským menom a heslom.
   * @returns {Promise<void>}
   */
  async function handleLogin(user: User) {
    setLoading(true);
    try {
      const result = await Authentification(user);
      if (result) {
        showToast(toast, "Úspešne prihlásený", "info");
        router.replace("/courses/courses_list/user_courses");
      } else {
        setLoading(false);
        showToast(toast, "Zlé údaje", "error", "Skontroluj meno a heslo");
      }
    } catch {
      setLoading(false);
      showToast(toast, "Chyba siete", "error", "Skontroluj pripojenie");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <VStack className="flex-1 items-center justify-between px-6 py-6">
        {/* Logo */}
        <Image
          source={require("../assets/images/splash-icon.png")}
          alt="logo"
          className="w-[100%] h-28 mt-4"
          resizeMode="contain"
        />

        {/* Formulár */}
        <VStack className="w-full flex-1 justify-center items-center space-y-6 gap-y-2">
          {/* Používateľské meno */}
          <VStack className="w-full max-w-[400px] space-y-2">
            <Text className="text-lg">Používateľské meno</Text>
            <Input className="border border-gray-300 rounded-lg px-3 py-2">
              <InputSlot className="pl-3">
                <Icon as={User} />
              </InputSlot>
              <InputField
                placeholder="Meno"
                value={username}
                onChangeText={setUsername}
                className="text-base flex-1"
              />
            </Input>
          </VStack>

          {/* Heslo */}
          <VStack className="w-full max-w-[400px] space-y-2">
            <Text className="text-lg">Heslo</Text>
            <Input className="border border-gray-300 rounded-lg px-3 py-2">
              <InputField
                placeholder="Heslo"
                value={password}
                type={show ? "text" : "password"}
                onChangeText={setPassword}
                className="text-base flex-1"
              />
              <InputSlot>
                <Pressable onPress={() => setShow(!show)}>
                  <Icon as={show ? EyeOffIcon : EyeIcon} />
                </Pressable>
              </InputSlot>
            </Input>
          </VStack>

          {/* Tlačidlá */}
          {isLoading ? (
            <Spinner className="text-blue-500" />
          ) : (
            <VStack className="w-full max-w-[400px] space-y-4">
              <Button
                className="bg-primaryButton h-14 rounded-lg"
                onPress={() => handleLogin({ username, password })}
              >
                <ButtonText className="text-white text-lg">
                  Prihlásiť sa
                </ButtonText>
              </Button>
              <Divider className="bg-gray-200 h-0.5" />
              <Text className="text-center text-gray-500 text-md">
                Ešte nemáš účet?
              </Text>
              <Button
                className="bg-secondaryButton h-14 rounded-lg"
                onPress={() => router.push("/register")}
              >
                <ButtonText className="text-white text-lg">
                  Registrácia
                </ButtonText>
              </Button>
            </VStack>
          )}
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default Login;
