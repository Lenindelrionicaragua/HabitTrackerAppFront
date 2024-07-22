import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";

import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
  Feather
} from "@expo/vector-icons";

import {
  StyledContainer,
  FocusTitleContainer,
  FocusTitleText,
  IconContainer,
  InfoText,
  ScreenTitle,
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
  const [infoText, setInfoText] = useState(
    "Choose your task\nand adjust the time\n to start the timer."
  );

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

  const fetchTimeRecords = () => {
    console.log("Saved records: ", savedRecords);
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
      <ScreenTitle>ZenTimer</ScreenTitle>
      <TimeButtonsContainer>
        <TimeButton
          onPress={() => {
            handleTimeSelection(5 * 60);
            handleButtonPress(1);
          }}
          style={{
            borderColor: activeButtons[1] ? Colors.seaGreen : Colors.white,
            borderWidth: 2,
            borderStyle: "solid"
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
            borderColor: activeButtons[2] ? Colors.seaGreen : Colors.white,
            borderWidth: 2,
            borderStyle: "solid"
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
            borderColor: activeButtons[3] ? Colors.seaGreen : Colors.white,
            borderWidth: 2,
            borderStyle: "solid"
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
            borderColor: activeButtons[4] ? Colors.seaGreen : Colors.white,
            borderWidth: 2,
            borderStyle: "solid"
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
            borderColor: activeButtons[5] ? Colors.seaGreen : Colors.white,
            borderWidth: 2,
            borderStyle: "solid"
          }}
        >
          <ButtonTimeText>55</ButtonTimeText>
        </TimeButton>
      </TimeButtonsContainer>
      {/* <Line /> */}
      <View style={styles.svgContainer}>
        <Svg height="360" width="360" viewBox="0 0 360 360">
          <Rect x="0" y="0" width="360" height="360" fill="transparent" />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke={white}
            strokeWidth="20"
            fill="none"
          />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke={black}
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
          />

          <SvgText
            x="180"
            y="180"
            textAnchor="middle"
            dy=".3em"
            fontSize="48"
            fontWeight="bold"
            fill={black}
          >
            {formatTime(currentTime)}
          </SvgText>
          <SvgText
            x="180"
            y="230"
            textAnchor="middle"
            fontSize="10"
            fill={lightPink}
          >
            {infoText}
          </SvgText>
        </Svg>
      </View>
      <InfoText>Im Focusing on</InfoText>
      <FocusTitleContainer>
        <FocusTitleText
          onPress={() => {
            handleActivityChange();
            handleButtonPress(10);
          }}
          style={{
            boxShadow: activeButtons[10] ? 1.2 : 0.8
          }}
        >
          {activityIndex === null
            ? "Choose your focus "
            : activities[activityIndex]}
        </FocusTitleText>
        <IconContainer>
          <AntDesign
            name="edit"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
        </IconContainer>
      </FocusTitleContainer>

      <RowContainer>
        <StyledButtonLeft
          onPress={() => {
            resetStopwatch();
            handleButtonPress(6);
          }}
          style={{
            backgroundColor: activeButtons[6] ? seaGreen : lightPink
          }}
        >
          <MaterialCommunityIcons name="restart" size={34} color="black" />
          <ButtonText>RESET</ButtonText>
        </StyledButtonLeft>
        {running ? (
          <StyledStartButton
            onPress={() => {
              pauseStopwatch();
              handleButtonPress(7);
            }}
            style={{
              backgroundColor: activeButtons[7] ? seaGreen : lightPink
            }}
          >
            <AntDesign name="pause" size={44} color="black" />
          </StyledStartButton>
        ) : (
          <StyledStartButton
            onPress={() => {
              startStopwatch();
              handleButtonPress(8);
            }}
            style={{
              backgroundColor: activeButtons[8] ? seaGreen : lightPink
            }}
          >
            <MaterialIcons name="play-arrow" size={44} color="black" />
          </StyledStartButton>
        )}
        <StyledButtonRight
          onPress={() => {
            resetStopwatch();
            handleButtonPress(9);
          }}
          style={{
            backgroundColor: activeButtons[9] ? seaGreen : lightPink
          }}
        >
          <Feather name="save" size={34} color="black" />
          <ButtonText>SAVE TIME</ButtonText>
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
