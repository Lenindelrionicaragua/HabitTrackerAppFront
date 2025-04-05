import { useRef, useCallback } from "react";
import { Audio } from "expo-av";
import { logInfo, logError } from "../util/logging";

export const usePlayAlarm = (logInfo, logError) => {
  const soundRef = useRef(null);

  const playAlarm = useCallback(
    async soundPath => {
      try {
        logInfo("Loading Sound");

        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(soundPath);
        soundRef.current = sound;

        logInfo("Playing notification Sound");
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate(async status => {
          if (status.didJustFinish) {
            logInfo("Sound has finished playing");
            await sound.unloadAsync();
            soundRef.current = null;
          }
        });
      } catch (error) {
        logError("Error playing the notification sound:", error);
      }
    },
    [logInfo, logError] // Dependencias para que `playAlarm` se mantenga estable y no cambie entre renders
  );

  return { playAlarm, soundRef };
};
