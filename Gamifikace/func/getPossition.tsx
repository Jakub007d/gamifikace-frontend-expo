import { Score } from "@/constants/props";

export default function getPosition(scores: Score[], user_id: string): string {
  if (scores.length == 0) return "-";
  const userIndex = scores.findIndex((score) => score.user == user_id);
  if (userIndex == -1) return "-";
  else return String(userIndex + 1);
}
