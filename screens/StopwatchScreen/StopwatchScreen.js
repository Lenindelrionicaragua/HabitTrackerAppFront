import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";
import {
  MaterialIcons,
  AntDesign,
  FontAwesome5,
  Octicons
} from "@expo/vector-icons";
import {
  StyledContainer,
  PageTitle,
  Line,
  StyledButtonLeft,
  StyledButtonRight,
  StyledStartButton,
  DotTimeButtonsContainer,
  DotTimeButton,
  RowContainer,
  ButtonText
} from "./StopwatchScreenStyles";

const { black, orange, grey } = Colors;
const MAX_TIME = 60;

const activities = [
  "Study",
  "Exercise",
  "Family time",
  "Screen-free time",
  "Rest"
];

const StopwatchScreen = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const [activityIndex, setActivityIndex] = useState(null);
  const [resetClicks, setResetClicks] = useState(0);
  const resetTimeoutRef = useRef(null);
  const [labelResetButton, setLabelResetButton] = useState("Complete");
  const [infoText, setInfoText] = useState("select your focus");

  useEffect(() => {
    if (infoText) {
      const timer = setTimeout(() => {
        setInfoText("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [infoText]);

  const pad = num => num.toString().padStart(2, "0");

  const startStopwatch = () => {
    if (activityIndex === null) {
      setInfoText("select your focus");
      setTimeout(() => setInfoText(""), 5000);
      return;
    }

    if (resetClicks >= 1) {
      setTime(0);
      setRunning(false);
      setResetClicks(0);
    }

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
    setResetClicks(prevClicks => prevClicks + 1);
    if (resetTimeoutRef.current !== null) {
      clearTimeout(resetTimeoutRef.current);
    }

    if (time === 0) {
      setInfoText("㊑");
      setLabelResetButton("save-data");
      setTimeout(() => setInfoText(""), 1000);
      return;
    }

    if (resetClicks === 0) {
      setInfoText("time-saved");
      setLabelResetButton("reset-all");
      setRunning(false);
      setTimeout(() => setInfoText(""), 5000);
      clearInterval(intervalRef.current);
    } else if (resetClicks >= 1) {
      clearInterval(intervalRef.current);
      setTime(0);
      setResetClicks(0);
      setActivityIndex(null);
      setRunning(false);
      setLabelResetButton("remember");
      setInfoText("clear");
    }
  };

  const handleActivityChange = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setInfoText(null);
    setActivityIndex(prevIndex =>
      prevIndex === activities.length - 1 ? 0 : prevIndex + 1
    );
  };

  const formatTime = totalMilliseconds => {
    const minutes = Math.floor((totalMilliseconds / (100 * 60)) % 60);
    const seconds = Math.floor((totalMilliseconds / 100) % 60);
    const milliseconds = Math.floor((totalMilliseconds % 100) / 1);
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
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
            stroke={orange}
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
          <SvgText
            x="180"
            y="230"
            textAnchor="middle"
            fontSize="24"
            fill={orange}
          >
            {infoText}
          </SvgText>
        </Svg>
      </View>
      <DotTimeButtonsContainer>
        <DotTimeButton>
          <Octicons name="dot-fill" size={44} color="black" />
        </DotTimeButton>
        <DotTimeButton>
          <Octicons name="dot-fill" size={44} color="black" />
        </DotTimeButton>
        <DotTimeButton>
          <Octicons name="dot-fill" size={44} color="black" />
        </DotTimeButton>
        <DotTimeButton>
          <Octicons name="dot-fill" size={44} color="black" />
        </DotTimeButton>
      </DotTimeButtonsContainer>
      <RowContainer>
        <StyledButtonLeft onPress={handleActivityChange}>
          <FontAwesome5 name="list-ul" size={44} color="black" />
          <ButtonText>Focus</ButtonText>
        </StyledButtonLeft>
        {running ? (
          <StyledStartButton onPress={pauseStopwatch}>
            <AntDesign name="pause" size={54} color="black" />
          </StyledStartButton>
        ) : (
          <StyledStartButton onPress={startStopwatch}>
            <MaterialIcons name="play-arrow" size={54} color="black" />
          </StyledStartButton>
        )}
        <StyledButtonRight onPress={resetStopwatch}>
          <MaterialIcons name="data-saver-on" size={44} color="black" />
          <ButtonText>{labelResetButton}</ButtonText>
        </StyledButtonRight>
      </RowContainer>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default StopwatchScreen;
