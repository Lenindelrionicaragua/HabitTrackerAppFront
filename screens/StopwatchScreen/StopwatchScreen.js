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
  InfoText,
  ScreenTitle,
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
const MIN_TIME_MINUTES = 0; // min time allowed

const activities = [
  "Study",
  "Work",
  "Exercise",
  "Family time",
  "Screen-free time",
  "Rest"
];

const StopwatchScreen = () => {
  const [initialTime, setInitialTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [firstRun, setFirstRun] = useState(true);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const [activityIndex, setActivityIndex] = useState(null);
  const [resetClicks, setResetClicks] = useState(0);
  const [infoText, setInfoText] = useState(
    "Choose your task\nand adjust the time\n to start the tracker."
  );
  const [resetButtonLabel, setResetButtonLabel] = useState("RESET");
  const [resetTimeouts, setResetTimeouts] = useState([]);
  const [activeButtons, setActiveButtons] = useState({});
  const [defaultActivityIndex, setDefaultActivityIndex] = useState(0);
  const [defaultTime, setDefaultTime] = useState(300); // time in seconds

  useEffect(() => {
    if (infoText) {
      const timer = setTimeout(() => {
        setInfoText("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [infoText]);

  const pad = num => num.toString().padStart(2, "0");

  // Start button
  const startStopwatch = () => {
    // Clear any existing timeouts
    resetTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    setResetTimeouts([]);
    setInfoText("");

    const clearInfoTextAfter = delay => {
      const timeoutId = setTimeout(() => setInfoText(""), delay);
      setResetTimeouts(prevTimeouts => [...prevTimeouts, timeoutId]);
    };

    const startTimer = initialTime => {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = Math.max(
            0,
            initialTime - Math.floor((Date.now() - startTimeRef.current) / 1000)
          );

          return newTime;
        });

        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
    };

    const setDefaultsAndStartTimer = (activityIdx, time, infoText) => {
      if (activityIndex !== null) {
      } else {
        setActivityIndex(defaultActivityIndex);
      }

      handleTimeSelection(time);
      setInfoText(infoText);

      setInitialTime(time);
      setCurrentTime(time);

      startTimer(time);
      setRunning(true);
      clearInfoTextAfter(5000);
    };

    if (!running) {
      // Case 1: No activity and no time set
      if (activityIndex === null && currentTime === 0) {
        setDefaultsAndStartTimer(
          defaultTime,
          firstRun
            ? "Timer started with a default time and activity."
            : "Timer restarted with a default time and activity."
        );
        setFirstRun(false);
        return;
      }

      // Case 2: Activity set but no time set
      if (activityIndex !== null && currentTime === 0) {
        setDefaultsAndStartTimer(
          defaultTime,
          firstRun
            ? "Timer started with the selected activity and a default time."
            : "Timer restarted with the selected activity and a default time."
        );
        setFirstRun(false);
        return;
      }

      // Case 3: No activity but time set
      if (activityIndex === null && currentTime > 0) {
        setDefaultsAndStartTimer(
          currentTime,
          firstRun
            ? "Timer started with a default activity."
            : "Timer restarted with a default activity."
        );
        setFirstRun(false);
        return;
      }

      // Case 4: Activity and time set but paused
      if (activityIndex !== null && currentTime > 0) {
        startTimer(currentTime);
        setRunning(true);
        setInfoText(
          firstRun
            ? "Timer resumed with the selected activity."
            : "Timer restarted with the selected activity."
        );
        setFirstRun(false);
        clearInfoTextAfter(5000);
        return;
      }
    }
  };

  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setElapsedTime(
      prevElapsedTime => prevElapsedTime + (initialTime - currentTime)
    );
  };

  const fetchTimeRecords = () => {
    console.log("Saved records: ", savedRecords);
  };

  // Reset Button

  const resetStopwatch = () => {
    setResetClicks(prevClicks => prevClicks + 1);
    setFirstRun(true);

    // Clear any existing timeouts
    resetTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    setResetTimeouts([]);
    setInfoText("");

    // Utility function to clear info text after a delay
    const clearInfoTextAfter = delay => {
      const timeoutId = setTimeout(() => setInfoText(""), delay);
      setResetTimeouts(prevTimeouts => [...prevTimeouts, timeoutId]);
    };

    // Utility function to update button label and info text
    const updateButtonAndInfoText = (label, infoText, cancelAfter) => {
      setResetButtonLabel(label);
      setInfoText(infoText);
      if (cancelAfter) {
        const timeoutId = setTimeout(() => {
          setResetButtonLabel("RESET");
          setResetClicks(0);
          setInfoText("Reset cancelled.");
        }, cancelAfter);
        setResetTimeouts(prevTimeouts => [...prevTimeouts, timeoutId]);
      }
    };

    if (currentTime === 0 && resetClicks === 0) {
      setRunning(false);
      updateButtonAndInfoText(
        "CONFIRM RESET",
        "Are you sure you want to reset the stopwatch?",
        10000
      );
      clearInfoTextAfter(12000);
      return;
    }

    if (currentTime === 0 && resetClicks === 1) {
      setRunning(false);
      updateButtonAndInfoText("RESET", "Stopwatch has been reset.");
      clearInfoTextAfter(12000);
      return;
    }

    if (currentTime === 0 && resetClicks >= 2) {
      setRunning(false);
      updateButtonAndInfoText(
        "RESET",
        "The stopwatch is already reset.",
        10000
      );
      setResetClicks(0);
      clearInfoTextAfter(12000);
      return;
    }

    if (currentTime !== 0 && running && resetClicks === 0) {
      setRunning(false);
      clearInterval(intervalRef.current);
      updateButtonAndInfoText(
        "CONFIRM RESET",
        "Are you sure you want to reset the stopwatch?",
        10000
      );
      clearInfoTextAfter(2000);
      return;
    }

    if (currentTime !== 0 && !running && resetClicks === 0) {
      setRunning(false);
      updateButtonAndInfoText(
        "CONFIRM RESET",
        "Are you sure you want to reset the stopwatch?",
        10000
      );
      clearInfoTextAfter(2000);
      return;
    }

    if (currentTime !== 0 && resetClicks === 1) {
      setResetButtonLabel("RESET");
      clearInterval(intervalRef.current);
      setCurrentTime(0);
      setInitialTime(0);
      setElapsedTime(0);
      setResetClicks(0);
      setActivityIndex(null);
      setRunning(false);
      setInfoText("Stopwatch has been reset.");
      clearInfoTextAfter(2000);
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

    if (newInitialTime < MIN_TIME_MINUTES) {
      return;
    }

    if (newInitialTime <= MAX_TIME_SECONDS) {
      setInitialTime(newInitialTime);

      if (currentTime > 0) {
        clearInterval(intervalRef.current);
        setCurrentTime(newInitialTime);
        setElapsedTime(0);
        setRunning(false);
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
    // clean the active state of all the buttons
    setActiveButtons(prevState => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      // Active the clicked button
      newState[buttonId] = true;
      return newState;
    });

    // Disable the button after one second
    setTimeout(() => {
      setActiveButtons(prevState => ({ ...prevState, [buttonId]: false }));
    }, 2000);
  };

  return (
    <StyledContainer>
      <ScreenTitle>Habit Tracker</ScreenTitle>
      <TimeButtonsContainer>
        <TimeButton
          onPress={() => {
            handleTimeSelection(currentTime - 60);
            handleButtonPress(12);
          }}
          style={{
            borderColor: activeButtons[12] ? Colors.seaGreen : Colors.white,
            borderWidth: 2,
            borderStyle: "solid"
          }}
        >
          <ButtonTimeText>-</ButtonTimeText>
        </TimeButton>
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
        <TimeButton
          onPress={() => {
            handleTimeSelection(currentTime + 60);
            handleButtonPress(11);
          }}
          style={{
            borderColor: activeButtons[11] ? Colors.seaGreen : Colors.white,
            borderWidth: 2,
            borderStyle: "solid"
          }}
        >
          <ButtonTimeText>+</ButtonTimeText>
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
            stroke={skyBlue}
            strokeWidth="20"
            fill="none"
          />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke={white}
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
            fill={black}
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
          {activityIndex === null ? "Click here" : activities[activityIndex]}
        </FocusTitleText>
        {/* <IconContainer>
          <AntDesign
            name="edit"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
        </IconContainer> */}
      </FocusTitleContainer>

      <RowContainer>
        <StyledButtonLeft
          onPress={() => {
            resetStopwatch();
            handleButtonPress(6);
          }}
          style={{
            backgroundColor: activeButtons[6] ? darkGrey : darkGrey
          }}
        >
          <MaterialCommunityIcons
            name="restart"
            size={34}
            color={activeButtons[6] ? Colors.skyBlue : Colors.black}
          />
          <ButtonText>{resetButtonLabel}</ButtonText>
        </StyledButtonLeft>
        {running ? (
          <StyledStartButton
            onPress={() => {
              pauseStopwatch();
              handleButtonPress(7);
            }}
            style={{
              backgroundColor: activeButtons[7] ? darkGrey : darkGrey
            }}
          >
            <AntDesign
              name="pause"
              size={44}
              color={activeButtons[7] ? Colors.skyBlue : Colors.black}
            />
          </StyledStartButton>
        ) : (
          <StyledStartButton
            onPress={() => {
              startStopwatch();
              handleButtonPress(8);
            }}
            style={{
              backgroundColor: activeButtons[8] ? darkGrey : darkGrey
            }}
          >
            <MaterialIcons
              name="play-arrow"
              size={44}
              color={activeButtons[8] ? Colors.skyBlue : Colors.black}
            />
          </StyledStartButton>
        )}
        <StyledButtonRight
          onPress={() => {
            resetStopwatch();
            handleButtonPress(9);
          }}
          style={{
            backgroundColor: activeButtons[9] ? darkGrey : darkGrey
          }}
        >
          <Feather
            name="save"
            size={34}
            color={activeButtons[9] ? Colors.skyBlue : Colors.black}
          />
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
