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
const MAX_TIME = 359999; // max time in seconds

const activities = [
  "Study",
  "Exercise",
  "Family time",
  "Screen-free time",
  "Rest"
];

const StopwatchScreen = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const [activityIndex, setActivityIndex] = useState(null);
  const [resetClicks, setResetClicks] = useState(0);
  const resetTimeoutRef = useRef(null);
  const [labelResetButton, setLabelResetButton] = useState("save-data");
  const [infoText, setInfoText] = useState("select your focus");
  const [timeIncrements, setTimeIncrements] = useState(0);

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
      setCurrentTime(0);
      setRunning(false);
      setResetClicks(0);
    }

    startTimeRef.current = Date.now() + currentTime * 1000;
    intervalRef.current = setInterval(() => {
      setCurrentTime(prevTime => Math.max(0, prevTime - 1));
    }, 1000);
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

    if (currentTime === 0) {
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
      setCurrentTime(0);
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

  const handleTimeIncrement = increment => {
    setTimeIncrements(increment);
    setCurrentTime(currentTime + increment);
  };

  const formatTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const calculateCircleParams = () => {
    const totalTrackingTime = timeIncrements;
    const percentage = (currentTime / totalTrackingTime) * 100;
    const strokeDasharray = `${percentage}, 100`;
    return { strokeDasharray };
  };

  const { strokeDasharray } = calculateCircleParams();

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
            strokeDasharray={strokeDasharray}
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
            {formatTime(currentTime)}
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
        <DotTimeButton onPress={() => handleTimeIncrement(5 * 60)}>
          <Octicons name="dot-fill" size={44} color="black" />
        </DotTimeButton>
        <DotTimeButton onPress={() => handleTimeIncrement(10 * 60)}>
          <Octicons name="dot-fill" size={44} color="black" />
        </DotTimeButton>
        <DotTimeButton onPress={() => handleTimeIncrement(30 * 60)}>
          <Octicons name="dot-fill" size={44} color="black" />
        </DotTimeButton>
        <DotTimeButton onPress={() => handleTimeIncrement(45 * 60)}>
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
