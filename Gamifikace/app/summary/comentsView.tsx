import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchComments from "@/api/Downloaders/fetchComments";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Avatar } from "@/components/ui/avatar";
import getInitials from "@/func/getInitials";
import { ScrollView, View } from "react-native";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import FullNavigationButton from "@/components/custom/customButtons/fullNavigationButton";
import addComment from "@/api/Uploaders/commentUploader";
import { useUserId } from "../hooks/useUserId";
import { useUserName } from "../hooks/useUserName";
/**
 * @screen
 * Obrazovka komentárov k otázke (comentsView).
 *
 *  Navigovateľná stránka v Expo Router, slúžiaca na:
 * - zobrazenie komentárov k danej otázke,
 * - pridanie nového komentára prihláseným používateľom,
 * - vizuálne odlíšenie komentujúcich pomocou avatara.
 *
 * Funkcie:
 * - Načíta komentáre cez React Query (`fetchComments`).
 * - Získava ID používateľa a jeho meno cez hooky `useUserId` a `useUserName`.
 * - Umožňuje vytvoriť nový komentár pomocou `addComment` a obnoviť cache komentárov.
 * - Zobrazuje meno autora a text každého komentára s vizuálnym layoutom.
 * - Nastavuje hlavičku obrazovky (`navigation.setOptions`) s názvom otázky a avatarom používateľa.
 *
 * @fileoverview TSX stránka pre `app/comments/comentsView.tsx` v rámci Expo Router projektu.
 *
 * @component
 * @example
 * // Navigácia na stránku komentárov pre konkrétnu otázku:
 * router.push({
 *   pathname: "/comments/comentsView",
 *   params: { question_id: "abc123", question_name: "Otázka č. 1" },
 * });
 *
 * @returns {JSX.Element} Zobrazí zoznam komentárov, vstupné pole a tlačidlo na pridanie komentára.
 */

export default function comentsView() {
  const { question_id, question_name } = useLocalSearchParams();
  const { status: comments_status, data: comments } = useQuery({
    queryKey: ["comments", question_id],
    enabled: !!question_id,
    queryFn: () => fetchComments(String(question_id)),
  });
  const [comment_text, setCommentText] = useState("");
  const maxLength = 200;
  const queryClient = useQueryClient();
  const userID = useUserId();
  const userName = useUserName();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: "Komentáre otázky: " + question_name,
      headerRight: () => (
        <Avatar size="md">
          <Text size="lg" className="text-white">
            {getInitials(String(userName))}
          </Text>
        </Avatar>
      ),
    });
  }, [navigation, userID, userName]);
  if (comments_status === "success" && userName && userID) {
    return (
      <VStack className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <VStack className="gap-y-4 p-4 rounded-lg bg-backgroundLight shadow-md flex-1">
            {comments.map((comment, idx) => (
              <HStack
                key={idx}
                space="md"
                className="items-center justify-start border border-black rounded-lg p-4 mb-4 bg-white shadow-md"
              >
                <Avatar size="md">
                  <Text size="lg" className="text-white">
                    {getInitials(comment.created_by)}
                  </Text>
                </Avatar>
                <Text size="lg" style={{ flexShrink: 1 }}>
                  <Text
                    className="text-base"
                    bold={true}
                    style={{ color: "#0A5999" }}
                  >
                    {comment.created_by + ": "}
                  </Text>
                  <Text className="text-black">{comment.text}</Text>
                </Text>
              </HStack>
            ))}
          </VStack>
        </ScrollView>
        <VStack className="p-4 bg-white">
          <Text className="text-lg mb-2">Nový komentár</Text>
          <Input className="border border-gray-300 rounded-lg px-3 py-10 w-full">
            <InputSlot className="pl-3">
              <Avatar size="md">
                <Text size="lg" className="text-white">
                  {getInitials(userName)}
                </Text>
              </Avatar>
            </InputSlot>
            <InputField
              multiline={true}
              maxLength={maxLength}
              textAlignVertical="top"
              placeholder="Sem napíš svoj komentár"
              value={comment_text}
              onChangeText={setCommentText}
              className="text-base text-gray-700 flex-1 min-h-[90px] pt-5"
            />
          </Input>
          <Text style={{ alignSelf: "flex-end", marginTop: 4 }}>
            {comment_text.length}/{maxLength} znakov
          </Text>
        </VStack>

        <View className="p-4">
          <FullNavigationButton
            disabled={comment_text.length === 0}
            action={async () => {
              await addComment(String(question_id), comment_text, userID);
              await queryClient.invalidateQueries({
                queryKey: ["comments", question_id],
              });
              setCommentText("");
            }}
            text="Pridať komentár"
          />
        </View>
      </VStack>
    );
  }
  return (
    <>
      <Text>Question ID: {question_id}</Text>
      {comments_status === "pending" ? (
        <Text>Loading...</Text>
      ) : comments_status === "error" ? (
        <Text>Error loading comments</Text>
      ) : (
        <>
          {comments.map((comment) => (
            <Text key={comment.id}>{comment.text}</Text>
          ))}
        </>
      )}
    </>
  );
}
