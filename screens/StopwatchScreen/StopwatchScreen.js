import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import BackgroundTimer from "react-native-background-timer";

const StopwatchScreen = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timerId;

    if (isRunning) {
      timerId = BackgroundTimer.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      BackgroundTimer.clearInterval(timerId);
    }

    return () => {
      BackgroundTimer.clearInterval(timerId);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setIsRunning(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Elapsed Time: {elapsedTime} seconds</Text>
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Button title={isRunning ? "Stop" : "Start"} onPress={toggleTimer} />
        <Button title="Reset" onPress={resetTimer} />
      </View>
    </View>
  );
};

export default StopwatchScreen;
