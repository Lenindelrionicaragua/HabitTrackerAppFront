import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";
import { clearMessagesAndTimeouts, clearInfoTextAfter } from "../../util/utils";

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

const {
  black,
  white,
  infoWhite,
  lightPink,
  darkGrey,
  seaGreen,
  skyBlue,
  lightGreen,
  green
} = Colors;

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

  const [startClicks, setStartClicks] = useState(0);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const [activityIndex, setActivityIndex] = useState(null);
  const [resetClicks, setResetClicks] = useState(0);
  const [infoText, setInfoText] = useState(
    "Choose your task\nand adjust the time\n to start the tracker."
  );
  const [resetButtonLabel, setResetButtonLabel] = useState("RESET");
  const [saveTimeButtonLabel, setSaveTimeButtonLabel] = useState("SAVE TIME");
  const [resetTimeouts, setResetTimeouts] = useState([]);
  const [activeButtons, setActiveButtons] = useState({});
  const [defaultActivityIndex, setDefaultActivityIndex] = useState(0);
  const [defaultTime, setDefaultTime] = useState(300); // time in seconds
  const [innerCircleColor, setInnerCircleColor] = useState(white);
  const [circleColor, setCircleColor] = useState(skyBlue);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

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
    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);
    setStartClicks(prevClicks => prevClicks + 1);

    console.log(startClicks);

    const startTimer = initialTime => {
      setCircleColor(skyBlue);
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = Math.max(
            0,
            initialTime - Math.floor((Date.now() - startTimeRef.current) / 1000)
          );

          if (newTime === 0 && !running) {
            fetchTimeRecords();
            setResetButtonLabel("RESET");
            setSaveTimeButtonLabel("SAVING");

            clearInterval(intervalRef.current);
            setRunning(false);
            setInnerCircleColor(green);
            setStartClicks(true);
            setResetClicks(0);

            setTimeout(() => {
              setInnerCircleColor(white);
              setCurrentTime(0);
              setInitialTime(0);
              setElapsedTime(0);
              setSaveTimeButtonLabel("SAVE-TIME");
              setStartClicks(0);
              setInfoText(
                "Time saved successfully! Your activity has been recorded."
              );
            }, 3000);

            // This helps to ensure no lingering messages or timeouts
            clearInfoTextAfter(
              3000,
              setInfoText,
              setResetTimeouts,
              resetTimeouts
            );
          }

          return newTime;
        });

        setElapsedTime(prevElapsedTime => {
          if (currentTime === 0) {
            return 0;
          }
          return prevElapsedTime + 1;
        });
      }, 1000);
    };

    const setDefaultsAndStartTimer = (activityIdx, time, infoText) => {
      setActivityIndex(defaultActivityIndex);
      handleTimeSelection(time);
      setInfoText(infoText);
      clearInfoTextAfter(5000, setInfoText, setResetTimeouts, resetTimeouts);
    };

    if (startClicks === 0) {
      // Case 1: No activity and no time set
      if (activityIndex === null && currentTime === 0) {
        setDefaultsAndStartTimer(
          defaultActivityIndex,
          defaultTime,
          "Default time and activity selected."
        );
        return;
      }

      // Case 2: Activity set but no time set
      if (activityIndex !== null && currentTime === 0) {
        setDefaultsAndStartTimer(
          activityIndex,
          defaultTime,
          "Default time selected."
        );

        return;
      }

      // Case 3: No activity but time set
      if (activityIndex === null && currentTime > 0) {
        setDefaultsAndStartTimer(
          defaultActivityIndex,
          currentTime,
          "Default activity selected."
        );

        return;
      }

      // Case 4: Activity and time set
      if (activityIndex !== null && currentTime > 0) {
        startTimer(currentTime);
        setInfoText("Timer start with the selected activity.");
        clearInfoTextAfter(5000);
        setRunning(true);
        return;
      }
    }

    if (startClicks !== 0) {
      // Case 5: Activity and time set but paused
      if (activityIndex !== null && currentTime > 0) {
        startTimer(currentTime);
        setRunning(true);
        setInfoText("Timer resume.");
        clearInfoTextAfter(5000);
        return;
      }
    }
  };

  // Pause button
  const pauseStopwatch = () => {
    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);

    clearInterval(intervalRef.current);
    setRunning(false);
  };

  // Reset Button

  const resetStopwatch = () => {
    setResetClicks(prevClicks => prevClicks + 1);
    setStartClicks(0);
    setCircleColor(skyBlue);

    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);

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

    if (resetClicks === 0) {
      if (currentTime === 0) {
        updateButtonAndInfoText(
          "RESET",
          "The timer is already at zero. Do you want to reset it?",
          10000
        );
        clearInfoTextAfter(12000, setInfoText, setResetTimeouts, resetTimeouts);
        return;
      } else {
        updateButtonAndInfoText(
          "CONFIRM RESET",
          "Are you sure you want to reset the stopwatch?",
          10000
        );
        clearInfoTextAfter(12000, setInfoText, setResetTimeouts, resetTimeouts);
        return;
      }
    }

    if (resetClicks === 1) {
      // Confirm the reset and perform the reset
      if (currentTime !== 0) {
        clearInterval(intervalRef.current);
        setCurrentTime(0);
        setInitialTime(0);
        setElapsedTime(0);
        setActivityIndex(null);
        setRunning(false);
        setResetClicks(0);
        updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
        clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
        return;
      }
    }

    if (resetClicks >= 2) {
      if (currentTime === 0) {
        setResetClicks(0);
        updateButtonAndInfoText("RESET", "Stopwatch is already reset.", 10000);
        clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
        return;
      } else {
        clearInterval(intervalRef.current);
        setCurrentTime(0);
        setInitialTime(0);
        setElapsedTime(0);
        setActivityIndex(null);
        setRunning(false);
        setResetClicks(0);
        updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
        clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
        return;
      }
    }
  };

  // Save Time Button
  const fetchTimeRecords = () => {
    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);

    setRunning(false);
    setButtonsDisabled(true);

    // The timer is stopped or paused.
    if (!running && currentTime === 0) {
      setInfoText("Please set a time before saving.");
      clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
      console.log("Saved records");
      setTimeout(() => setButtonsDisabled(false), 2000);
      return;
    }
    s;
    if (currentTime !== 0) {
      setCircleColor(green);
      setSaveTimeButtonLabel("SAVING");
      setResetButtonLabel("RESET");
      setResetClicks(0);
      setRunning(false);

      setTimeout(() => {
        setCircleColor(skyBlue);
        setSaveTimeButtonLabel("SAVE TIME");
        setCurrentTime(0);
        setInitialTime(0);
        setElapsedTime(0);

        setTimeout(() => setButtonsDisabled(false), 2000);
      }, 2000);

      clearInterval(intervalRef.current);
      setStartClicks(0);
      setInfoText("Time saved successfully! Your activity has been recorded.");
      clearInfoTextAfter(10000, setInfoText, setResetTimeouts, resetTimeouts);
      console.log("Saved records");
      return;
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
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      return "00:00:00";
    }

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
          disabled={buttonsDisabled}
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
          disabled={buttonsDisabled}
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
          disabled={buttonsDisabled}
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
          disabled={buttonsDisabled}
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
          disabled={buttonsDisabled}
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
          disabled={buttonsDisabled}
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
          disabled={buttonsDisabled}
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
            stroke={circleColor}
            strokeWidth="20"
            fill="none"
          />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke={innerCircleColor}
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={isFinite(strokeDashoffset) ? strokeDashoffset : 0}
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
            if (!buttonsDisabled) {
              handleActivityChange();
              handleButtonPress(10);
            }
          }}
          style={{
            boxShadow: activeButtons[10] ? 1.2 : 0.8,
            opacity: buttonsDisabled ? 0.5 : 1,
            cursor: buttonsDisabled ? "not-allowed" : "pointer"
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
          disabled={buttonsDisabled}
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
            disabled={buttonsDisabled}
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
            disabled={buttonsDisabled}
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
            fetchTimeRecords();
            handleButtonPress(9);
          }}
          style={{
            backgroundColor: activeButtons[9] ? darkGrey : darkGrey
          }}
          disabled={buttonsDisabled}
        >
          <Feather
            name="save"
            size={34}
            color={activeButtons[9] ? Colors.skyBlue : Colors.black}
          />
          <ButtonText>{saveTimeButtonLabel}</ButtonText>
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
