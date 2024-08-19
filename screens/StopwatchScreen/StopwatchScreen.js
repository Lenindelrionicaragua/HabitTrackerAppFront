import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";
import { useDispatch, useSelector } from "react-redux";
// store
import { setCircleColor, hasStarted } from "../../actions/counterActions";
//hooks
import useCircleParams from "../../hooks/useCircleParams";
import { usePlayAlarm } from "../../hooks/usePlayAlarm";
import useStopwatch from "../../hooks/useStopwatch";
import useResetStopwatch from "../../hooks/useResetStopwatch";
//utils
import { useButtonHandler } from "../../util/handleButtonPress";
import { formatTime } from "../../util/formatTime";
import { logInfo, logError } from "../../util/logging";
import {
  clearMessagesAndTimeouts,
  clearInfoTextAfter
} from "../../util/messageAndTimeoutHandlers";

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
  const [activityIndex, setActivityIndex] = useState(null);
  const [saveTimeButtonLabel, setSaveTimeButtonLabel] = useState("SAVE TIME");
  const [defaultActivityIndex, setDefaultActivityIndex] = useState(0);
  const [defaultTime, setDefaultTime] = useState(300); // time in seconds
  const [innerCircleColor, setInnerCircleColor] = useState(white);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const circleColor = useSelector(state => state.circleColor.circleColor);
  // const [infoText, setInfoText] = useState(
  //   "Choose your task\nand adjust the time\n to start the tracker."
  // );
  // const [hasStarted, setHasStarted] = useState(false);
  // const [resetButtonLabel, setResetButtonLabel] = useState("RESET");
  // const [resetClicks, setResetClicks] = useState(0);
  // const [resetTimeouts, setResetTimeouts] = useState([]);
  // const [circleColor, setCircleColor] = useState(skyBlue);

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
    isRunning,
    setIsRunning,
    pauseStopwatch,
    resumeStopwatch,
    startTimer
  } = useStopwatch();

  const {
    resetButtonLabel,
    setResetButtonLabel,
    infoText,
    setInfoText,
    resetClicks,
    setResetClicks,
    hasStarted,
    setHasStarted,
    resetTimeouts,
    setResetTimeouts,
    handleResetClicksZero,
    handleResetClicksOne,
    handleResetClicksTwoOrMore
  } = useResetStopwatch();

  const dispatch = useDispatch();

  const { playAlarm } = usePlayAlarm(logInfo, logError);

  useEffect(() => {
    if (infoText) {
      const timer = setTimeout(() => {
        dispatch(setInfoText(""));
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
      dispatch(setInfoText(infoText));
      clearInfoTextAfter(5000, setInfoText, setResetTimeouts, resetTimeouts);
    };

    const handleNoActivityNoTime = () => {
      setDefaultsAndStartTimer(
        defaultActivityIndex,
        defaultTime,
        "Default time and activity selected."
      );
      dispatch(setHasStarted(true));
    };

    const handleActivityNoTime = () => {
      setDefaultsAndStartTimer(
        activityIndex,
        defaultTime,
        "Default time selected."
      );
      dispatch(setHasStarted(true));
    };

    const handleNoActivityTime = () => {
      setDefaultsAndStartTimer(
        defaultActivityIndex,
        remainingTime,
        "Default activity selected."
      );
      dispatch(setHasStarted(true));
    };

    const handleActivityTime = () => {
      dispatch(startTimer(remainingTime));
      dispatch(setInfoText("Timer start with the selected activity."));
      clearInfoTextAfter(5000);
      dispatch(setIsRunning(true));
      setFirstRun(true);
      dispatch(setHasStarted(true));
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
    dispatch(setResetClicks(prevClicks => prevClicks + 1));
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
    dispatch(setIsRunning(false));

    if (remainingTime === 0 && !firstRun) {
      dispatch(
        setInfoText("No time recorded. Please start the timer before saving.")
      );
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
    dispatch(setIsRunning(false));
    setSaveTimeButtonLabel("SAVING");
    dispatch(setInfoText("Saving"));
    setButtonsDisabled(true);
    dispatch(setCircleColor(green));
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
    dispatch(setIsRunning(false));
    setActivityIndex(null);
    dispatch(setHasStarted(false));
    setFirstRun(false);
    dispatch(setResetClicks(0));
    setButtonsDisabled(false);
    dispatch(setResetButtonLabel("RESET"));
    setSaveTimeButtonLabel("SAVE-TIME");
    dispatch(setCircleColor(skyBlue));
    setInnerCircleColor(white);
    setButtonsDisabled(false);
    dispatch(setTimeCompleted(true));

    logInfo(`Timer was reset.`);
  };

  const handleActivityChange = () => {
    dispatch(setIsRunning(false));
    dispatch(setInfoText(null));
    setActivityIndex(prevIndex =>
      prevIndex === activities.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTimeSelection = selectedTime => {
    const newInitialTime = Math.max(selectedTime, MIN_TIME_MINUTES);

    if (newInitialTime <= MAX_TIME_SECONDS) {
      dispatch(setInitialTime(newInitialTime));
      dispatch(setRemainingTime(newInitialTime));
      dispatch(setElapsedTime(0));
      dispatch(setIsRunning(false));
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
    opacity: isRunning || firstRun ? 0 : 1,
    cursor: isRunning || firstRun ? "not-allowed" : "pointer"
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
          disabled={isRunning || firstRun}
        >
          <ButtonTimeText>-</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(5 * 60, 1)}
          style={getButtonStyles(1)}
          disabled={isRunning || firstRun}
        >
          <ButtonTimeText>05</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(15 * 60, 2)}
          style={getButtonStyles(2)}
          disabled={isRunning || firstRun}
        >
          <ButtonTimeText>15</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(30 * 60, 3)}
          style={getButtonStyles(3)}
          disabled={isRunning || firstRun}
        >
          <ButtonTimeText>30</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(45 * 60, 4)}
          style={getButtonStyles(4)}
          disabled={isRunning || firstRun}
        >
          <ButtonTimeText>45</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(55 * 60, 5)}
          style={getButtonStyles(5)}
          disabled={isRunning || firstRun}
        >
          <ButtonTimeText>55</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(remainingTime + 60, 11)}
          style={getButtonStyles(11)}
          disabled={isRunning || firstRun}
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
        {isRunning ? (
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
