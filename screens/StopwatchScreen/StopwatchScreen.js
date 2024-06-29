import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";
import {
  MaterialIcons,
  AntDesign,
  FontAwesome5,
  Ionicons
} from "@expo/vector-icons";

import {
  StyledContainer,
  PageTitle,
  Line,
  FocusTitle,
  StyledButton,
  StyledStartButton,
  ButtonsContainer,
  RowContainer,
  SwapButton
} from "./StopwatchScreenStyles";

const { white, black, orange, grey } = Colors;
const MAX_TIME = 60;

const activities = [
  "Study",
  "Rest",
  "Exercise",
  "Family time",
  "Screen-free time"
];

const StopwatchScreen = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const [label, setLabel] = useState("FOCUS");
  const [activityIndex, setActivityIndex] = useState(null);

  const pad = num => {
    return num.toString().padStart(2, "0");
  };

  const startStopwatch = () => {
    startTimeRef.current = Date.now() - time * 10;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 10));
    }, 10);
    setRunning(true);
  };

  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
    setActivityIndex(null);
  };

  const formatTime = totalMilliseconds => {
    const minutes = Math.floor((totalMilliseconds / (100 * 60)) % 60);
    const seconds = Math.floor((totalMilliseconds / 100) % 60);
    const milliseconds = Math.floor((totalMilliseconds % 100) / 1);
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  };

  const swapFocus = () => {
    setLabel(prevLabel => (prevLabel === "FOCUS" ? "REST" : "FOCUS"));
    if (activityIndex === 1 ? setActivityIndex(1) : setActivityIndex(0));
  };

  const handleActivityChange = () => {
    setActivityIndex(prevIndex => (prevIndex + 1) % activities.length);
  };

  const circumference = 2 * Math.PI * 150;

  return (
    <StyledContainer>
      <PageTitle>
        {activityIndex === null ? "ZenTimer" : activities[activityIndex]}
      </PageTitle>
      <Line />
      <View style={styles.svgContainer}>
        <Svg height="360" width="360" viewBox="0 0 360 360">
          <Rect x="0" y="0" width="360" height="360" fill="transparent" />

          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke={black}
            strokeWidth="10"
            fill="none"
          />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke={white}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (circumference * time) / (MAX_TIME * 100)
            }
          />
          <SvgText
            x="180"
            y="180"
            textAnchor="middle"
            dy=".3em"
            fontSize="48"
            fontWeight="bold"
            fill={grey}
          >
            {formatTime(time)}
          </SvgText>
        </Svg>
        <FocusTitle>{label}</FocusTitle>
        <SwapButton onPress={swapFocus}>
          <Ionicons name="swap-horizontal" size={24} color="black" />
        </SwapButton>
      </View>
      {/* <Line /> */}
      <ButtonsContainer>
        <RowContainer>
          <StyledButton onPress={handleActivityChange}>
            <FontAwesome5 name="list-ul" size={44} color="white" />
          </StyledButton>
          {running ? (
            <StyledStartButton onPress={pauseStopwatch}>
              <AntDesign name="pause" size={74} color="white" />
            </StyledStartButton>
          ) : (
            <StyledStartButton onPress={startStopwatch}>
              <AntDesign name="playcircleo" size={74} color="white" />
            </StyledStartButton>
          )}
          <StyledButton onPress={resetStopwatch}>
            <MaterialIcons name="data-saver-on" size={44} color="white" />
          </StyledButton>
        </RowContainer>
      </ButtonsContainer>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    marginVertical: 0
  }
});

export default StopwatchScreen;
