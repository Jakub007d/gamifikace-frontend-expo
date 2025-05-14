import React from "react";
import { Text } from "../../ui/text";
import { VStack } from "../../ui/vstack";
import Top3ScoreboardPressable from "./top3scoreboardPressable";
import { HStack } from "../../ui/hstack";
import { Center } from "../../ui/center";
import { Score } from "@/constants/props";

interface ScoreBoardProps {
  score: Score[];
  userID: string;
}

const Top3Scoreboard = ({ score, userID }: ScoreBoardProps) => {
  if (score.length === 0) {
    return (
      <Center className="w-full h-28">
        <Text size="xl" className="text-center text-gray-500">
          Staň sa prvým kto dokončí výzvu!
        </Text>
      </Center>
    );
  }

  return (
    <HStack className="w-full items-end justify-around min-h-[140px] mt-4">
      {score.length === 1 && (
        <Center className="w-full">
          <Top3ScoreboardPressable
            score={score}
            userID={userID}
            index={0}
            place="1st"
            place_colour="#EFBF04"
            first={true}
          />
        </Center>
      )}

      {score.length === 2 && (
        <>
          <Top3ScoreboardPressable
            score={score}
            userID={userID}
            index={1}
            place="2nd"
            place_colour="#C0C0C0"
            first={false}
          />
          <Top3ScoreboardPressable
            score={score}
            userID={userID}
            index={0}
            place="1st"
            place_colour="#EFBF04"
            first={true}
          />
        </>
      )}

      {score.length === 3 && (
        <>
          <Top3ScoreboardPressable
            score={score}
            userID={userID}
            index={1}
            place="2nd"
            place_colour="#C0C0C0"
            first={false}
          />
          <Top3ScoreboardPressable
            score={score}
            userID={userID}
            index={0}
            place="1st"
            place_colour="#EFBF04"
            first={true}
          />
          <Top3ScoreboardPressable
            score={score}
            userID={userID}
            index={2}
            place="3rd"
            place_colour="#CD7F32"
            first={false}
          />
        </>
      )}
    </HStack>
  );
};

export default Top3Scoreboard;
