import { useState } from "react";
import { Audio } from "expo-av";

export const usePlayAlarm = (logInfo, logError) => {
  const [alarm, setAlarm] = useState(null);

  const playAlarm = async soundPath => {
    try {
      logInfo("Loading Sound");
      if (alarm) {
        await alarm.unloadAsync();
        setAlarm(null);
      }

      const { sound } = await Audio.Sound.createAsync(soundPath);
      setAlarm(sound);

      logInfo("Playing notification Sound");
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) {
          logInfo("Sound has finished playing");
          sound.unloadAsync();
        }
      });
    } catch (error) {
      logError("Error playing the notification sound:", error);
    }
  };

  return { playAlarm, alarm };
};
