import React, { useEffect, useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { EyeIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { useToast, Toast } from "@/components/ui/toast";
import { router, useNavigation } from "expo-router";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Image } from "@/components/ui/image";
import { showToast } from "@/components/custom/customToast/customToast";
import { EyeOffIcon, KeyRound, Lock, Mail, User } from "lucide-react-native";
import { handleRegister } from "@/api/Uploaders/registration";
/**
 * @screen
 * Registračná obrazovka aplikácie
 * Umožňuje používateľovi registrovať sa vyplnením mena, hesla, emailu, a registračného kódu.
 *
 * @component
 */
export default function register() {
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [registration_code, setRegistrationCode] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    password2: "",
    email: "",
    registration_code: "",
  });
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: "Registrácia",
      headerBackVisible: false,
    });
  }, [navigation]);
  function handleInputValidation(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let newErrors: any = {};
    if (username.length < 3) {
      newErrors.username = "Používateľské meno musí mať aspoň 3 znaky.";
    }
    if (password.length < 5) {
      newErrors.password = "Heslo musí mať aspoň 5 znakov.";
    }
    if (password2.length < 5) {
      newErrors.password2 = "Heslo musí mať aspoň 5 znakov.";
    }
    if (password !== password2) {
      newErrors.password2 = "Heslá sa musia zhodovať.";
    }
    if (email.length < 1) {
      newErrors.email = "Email je povinný.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email musí byť platný.";
    }
    if (registration_code.length < 1) {
      newErrors.registration_code = "Registračný kód je povinný.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      handleRegister(
        username,
        email,
        password,
        password2,
        registration_code
      ).then((response) => {
        if (response) {
          showToast(toast, "Registracia úspešná", "info");
          router.push({
            pathname: "/",
          });
        } else {
          showToast(toast, "Registracia zlyhala", "error");
        }
      });
    }
  }

  return (
    <VStack className="flex  bg-white h-[100%] gap-y-[30px]">
      <Image
        size="xl"
        source={require("../assets/images/splash-icon.png")}
        alt="image"
        className="w-100 mt-10"
      />
      <VStack className="space-y-4 w-full items-center gap-y-5">
        {/* Textové okno na zadanie používateľského mena */}
        <VStack>
          <Text className="text-lg">Používateľské meno</Text>
          <Input className="border border-gray-300 rounded-lg px-3 py-2 w-full">
            <InputSlot className="pl-1">
              <Icon className="text-typography-500 text-bold" as={User} />
            </InputSlot>
            <InputField
              placeholder="Meno"
              value={username}
              onChangeText={setUsername}
              className="text-base text-gray-700 flex-1"
            />
          </Input>
          {errors.username && (
            <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>
          )}
        </VStack>
        <VStack>
          <Text className="text-lg">Email</Text>
          <Input className="border border-gray-300 rounded-lg px-3 py-2 w-full">
            <InputSlot className="pl-1">
              <Icon className="text-typography-500 text-bold" as={Mail} />
            </InputSlot>
            <InputField
              placeholder="uzivatel@email.com"
              value={email}
              onChangeText={setEmail}
              className="text-base text-gray-700 flex-1"
            />
          </Input>
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
          )}
        </VStack>
        {/* Textové okno na zadanie hesla */}
        <VStack>
          <Text className="text-lg">Heslo</Text>
          <Input className="border border-gray-300 rounded-lg px-3 py-2 w-full">
            <InputField
              placeholder="Heslo"
              type={show ? "text" : "password"}
              value={password}
              onChangeText={setPassword}
              className="text-base text-gray-700 flex-1"
            />
            <InputSlot>
              <Pressable onPress={() => setShow(!show)}>
                <Icon as={show ? EyeOffIcon : EyeIcon} size="lg" />
              </Pressable>
            </InputSlot>
          </Input>
          {errors.password && (
            <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
          )}
        </VStack>
        {/* Textové okno na overenie hesla */}
        <VStack>
          <Text className="text-lg">Overenie hesla</Text>
          <Input className="border border-gray-300 rounded-lg px-3 py-2 w-full">
            <InputField
              placeholder="Heslo"
              type={show ? "text" : "password"}
              value={password2}
              onChangeText={setPassword2}
              className="text-base text-gray-700 flex-1"
            />

            <InputSlot>
              <Pressable onPress={() => setShow(!show)}>
                <Icon as={show ? EyeOffIcon : EyeIcon} size="lg" />
              </Pressable>
            </InputSlot>
          </Input>
          {errors.password2 && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.password2}
            </Text>
          )}
        </VStack>
        {/* Textové okno na zadanie registračného kódu */}
        <VStack>
          <Text className="text-lg">Registračný kód</Text>
          <Input className="border border-gray-300 rounded-lg px-3 py-2 w-full">
            <InputSlot className="pl-1">
              <Icon className="text-typography-500 text-bold" as={KeyRound} />
            </InputSlot>
            <InputField
              placeholder="Registračný kód"
              value={registration_code}
              onChangeText={setRegistrationCode}
              className="text-base text-gray-700 flex-1"
            />
          </Input>
        </VStack>
        {/* Registračné tlačítko */}
        {false ? (
          <Spinner className="text-blue-500" />
        ) : (
          <>
            <Button
              className="bg-primaryButton rounded-lg w-4/5 h-14"
              onPress={() => handleInputValidation()}
            >
              <ButtonText className="text-white text-lg font-semibold">
                Registrovať sa
              </ButtonText>
            </Button>
          </>
        )}
      </VStack>
    </VStack>
  );
}
