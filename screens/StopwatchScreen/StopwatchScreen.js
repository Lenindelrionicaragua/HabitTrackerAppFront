import React, { useState, useRef, useEffect } from "react";
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
  StyledButtonLeft,
  StyledButtonRight,
  StyledStartButton,
  ButtonsContainer,
  RowContainer,
  SwapButton,
  ButtonText
} from "./StopwatchScreenStyles";

const { white, black, orange, grey } = Colors;
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
  const [label, setLabel] = useState("FOCUS");
  const [activityIndex, setActivityIndex] = useState(null);
  const [prevActivityIndex, setPrevActivityIndex] = useState(null);
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

  const pad = num => {
    return num.toString().padStart(2, "0");
  };

  const startStopwatch = () => {
    if (activityIndex === null) {
      setInfoText("select your focus");

      // Clear infoText after 3 seconds
      setTimeout(() => {
        setInfoText("");
      }, 5000);
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
      setInfoText(null);
      setLabelResetButton("save-data");
      setInfoText("㊑");
      setTimeout(() => {
        setInfoText("");
      }, 1000);
      return;
    }

    if (resetClicks === 0 && setTime !== 0) {
      setInfoText("time-saved");
      setLabelResetButton("reset-all");
      setRunning(false);
      setTimeout(() => {
        setInfoText("");
      }, 5000);
      clearInterval(intervalRef.current);
    } else if (resetClicks >= 1 && setTime !== 0) {
      clearInterval(intervalRef.current);
      setTime(0);
      setResetClicks(0);
      setActivityIndex(null);
      setRunning(false);
      setLabelResetButton("remember");
      setInfoText("clear");
      setLabel("FOCUS");
    }
  };

  const handleActivityChange = () => {
    setPrevActivityIndex(activityIndex);
    clearInterval(intervalRef.current);
    setRunning(false);
    setInfoText(null);
    setActivityIndex(prevIndex =>
      prevIndex === 3 ? 0 : (prevIndex + 1) % (activities.length - 1)
    );
  };

  const formatTime = totalMilliseconds => {
    const minutes = Math.floor((totalMilliseconds / (100 * 60)) % 60);
    const seconds = Math.floor((totalMilliseconds / 100) % 60);
    const milliseconds = Math.floor((totalMilliseconds % 100) / 1);
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  };

  const swapFocus = () => {
    setLabel(prevLabel => (prevLabel === "FOCUS" ? "REST" : "FOCUS"));
    setActivityIndex(prevIndex => {
      if (prevIndex === null || prevIndex !== 4) {
        setPrevActivityIndex(prevIndex);
        return 4;
      } else if (prevIndex !== null || prevIndex !== 4) {
        return prevActivityIndex;
      }
    });
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
        <FocusTitle>{label}</FocusTitle>
        <SwapButton onPress={swapFocus}>
          <Ionicons name="swap-horizontal" size={24} color="black" />
        </SwapButton>
      </View>
      <ButtonsContainer>
        <RowContainer>
          <StyledButtonLeft onPress={handleActivityChange}>
            <FontAwesome5 name="list-ul" size={44} color="black" />

            <ButtonText>Focus</ButtonText>
          </StyledButtonLeft>
          {running ? (
            <StyledStartButton onPress={pauseStopwatch}>
              <AntDesign name="pause" size={74} color="black" />
            </StyledStartButton>
          ) : (
            <StyledStartButton onPress={startStopwatch}>
              <AntDesign name="playcircleo" size={74} color="black" />
            </StyledStartButton>
          )}
          <StyledButtonRight onPress={resetStopwatch}>
            <MaterialIcons name="data-saver-on" size={44} color="black" />
            <ButtonText>{labelResetButton}</ButtonText>
          </StyledButtonRight>
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
