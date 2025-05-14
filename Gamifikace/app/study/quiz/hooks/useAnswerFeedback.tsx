import { Audio } from "expo-av";

export const useAnswerFeedback = () => {
  const playSound = async (path: any) => {
    const { sound } = await Audio.Sound.createAsync(path);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  };

  const playCorrect = () => playSound(require("@/assets/sounds/correct.mp3"));
  const playIncorrect = () =>
    playSound(require("@/assets/sounds/incorrect.mp3"));

  return { playCorrect, playIncorrect };
};
