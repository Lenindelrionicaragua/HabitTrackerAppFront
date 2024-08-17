import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";
import { useDispatch } from "react-redux";
//hooks
import useCircleParams from "../../hooks/useCircleParams";
import { usePlayAlarm } from "../../hooks/usePlayAlarm";
import useStopwatch from "../../hooks/useStopwatch";
//utils
import { useButtonHandler } from "../../util/handleButtonPress";
import { formatTime } from "../../util/formatTime";
import { logInfo, logError } from "../../util/logging";
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

const { black, white, skyBlue, green } = Colors;

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
  const [firstRun, setFirstRun] = useState(false);
  const [alarm, setAlarm] = useState();
  const [hasStarted, setHasStarted] = useState(false);
  const [activityIndex, setActivityIndex] = useState(null);
  const [infoText, setInfoText] = useState(
    "Choose your task\nand adjust the time\n to start the tracker."
  );

  const [resetButtonLabel, setResetButtonLabel] = useState("RESET");
  const [saveTimeButtonLabel, setSaveTimeButtonLabel] = useState("SAVE TIME");
  const [resetClicks, setResetClicks] = useState(0);
  const [resetTimeouts, setResetTimeouts] = useState([]);
  const [defaultActivityIndex, setDefaultActivityIndex] = useState(0);
  const [defaultTime, setDefaultTime] = useState(300); // time in seconds
  const [innerCircleColor, setInnerCircleColor] = useState(white);
  const [circleColor, setCircleColor] = useState(skyBlue);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  // custom hooks
  const { activeButtons, handleButtonPress } = useButtonHandler();
  const {
    initialTime,
    setInitialTime,
    remainingTime,
    setRemainingTime,
    elapsedTime,
    setElapsedTime,
    timeCompleted,
    setTimeCompleted,
    running,
    setRunning,
    pauseStopwatch,
    resumeStopwatch,
    startTimer
  } = useStopwatch();

  const dispatch = useDispatch();
  // const startTimeRef = useRef(0);
  // const pauseTimeRef = useRef(0);
  // const totalPausedTimeRef = useRef(0);
  const intervalRef = useRef(null);

  const { playAlarm } = usePlayAlarm(logInfo, logError);

  useEffect(() => {
    if (infoText) {
      const timer = setTimeout(() => {
        setInfoText("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [infoText]);

  useEffect(() => {
    if (timeCompleted) {
      playAlarm(require("../../assets/alarm_2.wav"));
      saveTimeRecords();
    }
  }, [timeCompleted]);

  // alarm
  useEffect(() => {
    return () => {
      if (alarm) {
        alarm.unloadAsync();
      }
    };
  }, [alarm]);

  // Start button
  const startStopwatch = () => {
    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);

    const setDefaultsAndStartTimer = (activityIdx, time, infoText) => {
      setActivityIndex(defaultActivityIndex);
      handleTimeSelection(time);
      setInfoText(infoText);
      clearInfoTextAfter(5000, setInfoText, setResetTimeouts, resetTimeouts);
    };

    const handleNoActivityNoTime = () => {
      setDefaultsAndStartTimer(
        defaultActivityIndex,
        defaultTime,
        "Default time and activity selected."
      );
      setHasStarted(true);
    };

    const handleActivityNoTime = () => {
      setDefaultsAndStartTimer(
        activityIndex,
        defaultTime,
        "Default time selected."
      );
      setHasStarted(true);
    };

    const handleNoActivityTime = () => {
      setDefaultsAndStartTimer(
        defaultActivityIndex,
        remainingTime,
        "Default activity selected."
      );
      setHasStarted(true);
    };

    const handleActivityTime = () => {
      startTimer(remainingTime);
      setInfoText("Timer start with the selected activity.");
      clearInfoTextAfter(5000);
      dispatch(setRunning(true));
      setFirstRun(true);
      setHasStarted(true);
    };

    // Main logic
    if (!hasStarted) {
      if (activityIndex === null && remainingTime === 0) {
        handleNoActivityNoTime();
      } else if (activityIndex !== null && remainingTime === 0) {
        handleActivityNoTime();
      } else if (activityIndex === null && remainingTime > 0) {
        handleNoActivityTime();
      } else if (activityIndex !== null && remainingTime > 0) {
        handleActivityTime();
      }
    } else {
      if (activityIndex !== null && remainingTime > 0) {
        if (!firstRun) {
          handleActivityTime();
        } else {
          resumeStopwatch();
        }
      }
    }
  };

  // Reset Button

  const resetStopwatch = () => {
    setResetClicks(prevClicks => prevClicks + 1);
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

    const handleResetClicksZero = () => {
      if (remainingTime === 0) {
        updateButtonAndInfoText(
          "RESET",
          "The timer is already at zero. Do you want to reset it?",
          10000
        );
      } else {
        updateButtonAndInfoText(
          "CONFIRM RESET",
          "Are you sure you want to reset the stopwatch?",
          10000
        );
        clearInterval(intervalRef.current);
      }
      clearInfoTextAfter(12000, setInfoText, setResetTimeouts, resetTimeouts);
    };

    const handleResetClicksOne = () => {
      if (remainingTime !== 0) {
        performReset();
        updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
        clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
      }
    };

    const handleResetClicksTwoOrMore = () => {
      if (remainingTime === 0) {
        setResetClicks(0);
        setHasStarted(false);
        updateButtonAndInfoText("RESET", "Stopwatch is already reset.", 10000);
      } else {
        performReset();
        updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
      }
      clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
    };

    // Main logic
    if (resetClicks === 0) {
      handleResetClicksZero();
    } else if (resetClicks === 1) {
      handleResetClicksOne();
    } else if (resetClicks >= 2) {
      handleResetClicksTwoOrMore();
    }
  };

  // Save Time Button
  const saveTimeRecords = () => {
    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);
    dispatch(setRunning(false));

    if (remainingTime === 0 && !firstRun) {
      setInfoText("No time recorded. Please start the timer before saving.");
      clearInfoTextAfter(1000, setInfoText, setResetTimeouts, resetTimeouts);

      return;
    }

    if ((remainingTime !== 0 && firstRun) || timeCompleted) {
      logInfo(`Remaining time saved: ${formatTime(remainingTime)}`);
      logInfo(`ElapsedTime time saved: ${formatTime(elapsedTime)}`);
      processSaveAndUpdateUI();
      return;
    }
  };

  const processSaveAndUpdateUI = () => {
    clearInterval(intervalRef.current);
    setSaveTimeButtonLabel("SAVING");
    setInfoText("Saving");
    setButtonsDisabled(true);
    setCircleColor(green);
    setInnerCircleColor(green);

    setTimeout(() => {
      performReset();
      setInfoText("Time saved successfully! Your activity has been recorded.");
    }, 4000);

    clearInfoTextAfter(5000, setInfoText, setResetTimeouts, resetTimeouts);
  };

  // Function to perform reset
  const performReset = () => {
    dispatch(setInitialTime(0));
    dispatch(setRemainingTime(0));
    dispatch(setElapsedTime(0));
    setActivityIndex(null);
    setHasStarted(false);
    dispatch(setRunning(false));
    setFirstRun(false);
    setResetClicks(0);
    setButtonsDisabled(false);
    setResetButtonLabel("RESET");
    setSaveTimeButtonLabel("SAVE-TIME");
    setCircleColor(skyBlue);
    setInnerCircleColor(white);
    setButtonsDisabled(false);
    dispatch(setTimeCompleted(true));

    logInfo(`Timer was reset.`);
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
    const newInitialTime = Math.max(selectedTime, MIN_TIME_MINUTES);

    if (newInitialTime <= MAX_TIME_SECONDS) {
      // setInitialTime(newInitialTime);
      dispatch(setInitialTime(newInitialTime));
      dispatch(setRemainingTime(newInitialTime));
      dispatch(setElapsedTime(0));
      dispatch(setRunning(false));
    } else {
      dispatch(setInitialTime(MAX_TIME_SECONDS));
      dispatch(setRemainingTime(MAX_TIME_SECONDS));
    }
  };

  // Calculates circle parameters for a graphical time indicator based on elapsedTime and initialTime.
  const { circumference, strokeDashoffset } = useCircleParams(
    elapsedTime,
    initialTime
  );

  const handleTimeButtonPress = (timeChange, buttonId) => {
    handleTimeSelection(timeChange);
    handleButtonPress(buttonId);
  };

  // Define styles for time increment buttons
  const getButtonStyles = buttonId => ({
    borderColor: activeButtons[buttonId] ? Colors.seaGreen : Colors.white,
    borderWidth: 2,
    borderStyle: "solid",
    opacity: running || firstRun ? 0 : 1,
    cursor: running || firstRun ? "not-allowed" : "pointer"
  });

  return (
    <StyledContainer testID="stopwatch-screen-container">
      <ScreenTitle testID="stopwatch-title">Habit Tracker</ScreenTitle>
      <TimeButtonsContainer
        style={getButtonStyles(13)}
        testID="stopwatch-time-buttons"
      >
        <TimeButton
          onPress={() => handleTimeButtonPress(remainingTime - 60, 12)}
          style={getButtonStyles(12)}
          disabled={running || firstRun}
        >
          <ButtonTimeText>-</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(5 * 60, 1)}
          style={getButtonStyles(1)}
          disabled={running || firstRun}
        >
          <ButtonTimeText>05</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(15 * 60, 2)}
          style={getButtonStyles(2)}
          disabled={running || firstRun}
        >
          <ButtonTimeText>15</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(30 * 60, 3)}
          style={getButtonStyles(3)}
          disabled={running || firstRun}
        >
          <ButtonTimeText>30</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(45 * 60, 4)}
          style={getButtonStyles(4)}
          disabled={running || firstRun}
        >
          <ButtonTimeText>45</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(55 * 60, 5)}
          style={getButtonStyles(5)}
          disabled={running || firstRun}
        >
          <ButtonTimeText>55</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(remainingTime + 60, 11)}
          style={getButtonStyles(11)}
          disabled={running || firstRun}
        >
          <ButtonTimeText>+</ButtonTimeText>
        </TimeButton>
      </TimeButtonsContainer>

      {/* <Line /> */}
      <View style={styles.svgContainer} testID="svg-container">
        <Svg height="360" width="360" viewBox="0 0 360 360">
          <Rect x="0" y="0" width="360" height="360" fill="transparent" />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke={circleColor}
            strokeWidth="20"
            fill="none"
            testID="circle"
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
            transform="rotate(-90 180 180)"
            testID="inner-circle"
          />

          <SvgText
            x="180"
            y="180"
            textAnchor="middle"
            dy=".3em"
            fontSize="48"
            fontWeight="bold"
            fill={black}
            testID="svg-time-text"
          >
            {formatTime(remainingTime)}
          </SvgText>
          <SvgText
            x="180"
            y="230"
            textAnchor="middle"
            fontSize="10"
            fill={black}
            testID="svg-info-text"
          >
            {infoText}
          </SvgText>
        </Svg>
      </View>
      <InfoText testID="info-text-stopwatch-screen">I'm focusing on</InfoText>
      <FocusTitleContainer testID="focus-activity-button">
        <FocusTitleText
          onPress={() => {
            if (!buttonsDisabled && !firstRun) {
              handleActivityChange();
              handleButtonPress(10);
            }
          }}
          style={{
            boxShadow: activeButtons[10] ? 1.2 : 0.8,
            opacity: buttonsDisabled || firstRun ? 0.5 : 1,
            cursor: buttonsDisabled || firstRun ? "not-allowed" : "pointer"
          }}
          disabled={buttonsDisabled}
        >
          {activityIndex === null ? "Click here" : activities[activityIndex]}
        </FocusTitleText>
      </FocusTitleContainer>

      <RowContainer>
        <StyledButtonLeft
          onPress={() => {
            if (!buttonsDisabled) {
              resetStopwatch();
              handleButtonPress(6);
            }
          }}
          disabled={buttonsDisabled}
          testID="reset-button"
        >
          <MaterialCommunityIcons
            name="restart"
            size={34}
            color={activeButtons[6] ? Colors.skyBlue : Colors.black}
            style={{ opacity: buttonsDisabled ? 0.5 : 1 }}
          />

          <ButtonText>{resetButtonLabel}</ButtonText>
        </StyledButtonLeft>
        {running ? (
          <StyledStartButton
            onPress={() => {
              pauseStopwatch();
              handleButtonPress(7);
            }}
            disabled={buttonsDisabled}
            testID="pause-button"
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
              if (!buttonsDisabled) {
                startStopwatch();
                handleButtonPress(8);
              }
            }}
            disabled={buttonsDisabled}
            testID="start-button"
          >
            <MaterialIcons
              name="play-arrow"
              size={44}
              color={activeButtons[8] ? Colors.skyBlue : Colors.black}
              style={{ opacity: buttonsDisabled ? 0.5 : 1 }}
            />
          </StyledStartButton>
        )}
        <StyledButtonRight
          onPress={() => {
            if (!buttonsDisabled) {
              saveTimeRecords();
              handleButtonPress(9);
            }
          }}
          disabled={buttonsDisabled}
          testID="save-button"
        >
          <Feather
            name="save"
            size={34}
            color={activeButtons[9] ? Colors.skyBlue : Colors.black}
            style={{ opacity: buttonsDisabled ? 0.5 : 1 }}
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
