import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";
import { MaterialIcons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import {
  StyledContainer,
  FocusTitle,
  Line,
  StyledButtonLeft,
  StyledButtonRight,
  StyledStartButton,
  TimeButtonsContainer,
  TimeButton,
  RowContainer,
  ButtonTimeText,
  ButtonText
} from "./StopwatchScreenStyles";

const { black, white, infoWhite, lightPink, darkGrey, seaGreen, skyBlue } =
  Colors;
const MAX_TIME_HOURS = 99; // max time in hours
const MAX_TIME_SECONDS = MAX_TIME_HOURS * 3600; // convert max time to seconds

const activities = [
  "Study",
  "Work",
  "Exercise",
  "Family time",
  "Screen-free time",
  "Rest"
];

const StopwatchScreen = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const [activityIndex, setActivityIndex] = useState(null);
  const [resetClicks, setResetClicks] = useState(0);
  const resetTimeoutRef = useRef(null);
  const [infoText, setInfoText] = useState("select your focus");

  const [activeButtons, setActiveButtons] = useState({});

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
      setInfoText("choose your focus");
      setTimeout(() => setInfoText(""), 5000);
      return;
    }

    if (currentTime === 0) {
      setInfoText("select time");
      setTimeout(() => setInfoText(""), 5000);
      return;
    }

    if (resetClicks >= 1) {
      setCurrentTime(0);
      setRunning(false);
      setResetClicks(0);
      setInitialTime(0);
    }

    if (currentTime > 0 && !running) {
      setInitialTime(currentTime);
      setElapsedTime(0);
    }

    startTimeRef.current = Date.now() + currentTime * 1000;
    intervalRef.current = setInterval(() => {
      setCurrentTime(prevTime => {
        const newTime = Math.max(0, prevTime - 1);
        setElapsedTime(initialTime - newTime);
        return newTime;
      });
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

      setTimeout(() => setInfoText(""), 1000);
      return;
    }

    if (resetClicks === 0) {
      setInfoText("time-saved");

      setRunning(false);
      setTimeout(() => setInfoText(""), 5000);
      clearInterval(intervalRef.current);
    } else if (resetClicks >= 1) {
      clearInterval(intervalRef.current);
      setCurrentTime(0);
      setInitialTime(0);
      setResetClicks(0);
      setActivityIndex(null);
      setRunning(false);
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

  const handleTimeSelection = selectedTime => {
    const newInitialTime = selectedTime;

    if (newInitialTime <= MAX_TIME_SECONDS) {
      setInitialTime(newInitialTime);

      if (running && currentTime > 0) {
        setRunning(false);
        clearInterval(intervalRef.current);
        setCurrentTime(newInitialTime);
        setElapsedTime(0);
      } else {
        setCurrentTime(newInitialTime);
      }
    } else {
      setCurrentTime(MAX_TIME_SECONDS);
      setInitialTime(MAX_TIME_SECONDS);
    }
  };

  const formatTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const calculateCircleParams = () => {
    const radius = 150;
    const circumference = 2 * Math.PI * radius;

    const effectiveElapsedTime = isNaN(elapsedTime) ? 0 : elapsedTime;
    const effectiveInitialTime = isNaN(initialTime) ? 0 : initialTime;

    const timeFraction = effectiveElapsedTime / effectiveInitialTime;

    let strokeDashoffset = circumference * (1 - timeFraction);

    if (isNaN(strokeDashoffset)) {
      strokeDashoffset = 0;
    }

    return { circumference, strokeDashoffset };
  };

  const { circumference, strokeDashoffset } = calculateCircleParams();

  const handleButtonPress = buttonId => {
    setActiveButtons(prevState => ({ ...prevState, [buttonId]: true }));
    setTimeout(() => {
      setActiveButtons(prevState => ({ ...prevState, [buttonId]: false }));
    }, 1000);
  };

  return (
    <StyledContainer>
      <FocusTitle onPress={handleActivityChange}>
        {activityIndex === null
          ? "Choose your focus"
          : activities[activityIndex]}
      </FocusTitle>
      <Line />
      <View style={styles.svgContainer}>
        <Svg height="360" width="360" viewBox="0 0 360 360">
          <Rect x="0" y="0" width="360" height="360" fill="transparent" />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke={white}
            strokeWidth="10"
            fill="none"
          />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke={black}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
          <SvgText
            x="180"
            y="180"
            textAnchor="middle"
            dy=".3em"
            fontSize="48"
            fontWeight="bold"
            fill={infoWhite}
          >
            {formatTime(currentTime)}
          </SvgText>
          <SvgText
            x="180"
            y="230"
            textAnchor="middle"
            fontSize="24"
            fill={white}
          >
            {infoText}
          </SvgText>
        </Svg>
      </View>
      <TimeButtonsContainer>
        <TimeButton
          onPress={() => {
            handleTimeSelection(5 * 60);
            handleButtonPress(1);
          }}
          style={{
            backgroundColor: activeButtons[1] ? seaGreen : black
          }}
        >
          <ButtonTimeText>05</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => {
            handleTimeSelection(15 * 60);
            handleButtonPress(2);
          }}
          style={{
            backgroundColor: activeButtons[2] ? seaGreen : black
          }}
        >
          <ButtonTimeText>15</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => {
            handleTimeSelection(30 * 60);
            handleButtonPress(3);
          }}
          style={{
            backgroundColor: activeButtons[3] ? seaGreen : black
          }}
        >
          <ButtonTimeText>30</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => {
            handleTimeSelection(45 * 60);
            handleButtonPress(4);
          }}
          style={{
            backgroundColor: activeButtons[4] ? seaGreen : black
          }}
        >
          <ButtonTimeText>45</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => {
            handleTimeSelection(55 * 60);
            handleButtonPress(5);
          }}
          style={{
            backgroundColor: activeButtons[5] ? seaGreen : black
          }}
        >
          <ButtonTimeText>55</ButtonTimeText>
        </TimeButton>
      </TimeButtonsContainer>

      <RowContainer>
        <StyledButtonLeft onPress={handleActivityChange}>
          <MaterialIcons name="restart-alt" size={44} color="black" />
          <ButtonText>RESET</ButtonText>
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
          <MaterialIcons name="track-changes" size={24} color="black" />
          <ButtonText>TRACK</ButtonText>
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
