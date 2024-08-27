import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { setSaveTimeButtonLabel } from "../../actions/counterActions";

//hooks
import useCircleParams from "../../hooks/useCircleParams";
import { usePerformReset } from "../../hooks/usePerformReset";
import { usePlayAlarm } from "../../hooks/usePlayAlarm";
import useStopwatch from "../../hooks/useStopwatch";
import useResetStopwatch from "../../hooks/useResetStopwatch";
import { useButtonHandler } from "../../util/handleButtonPress";
import useUpdateCircleColors from "../../hooks/useUpdateCircleColors";
import useInfoText from "../../hooks/useInfoText";
//utils
import { formatTime } from "../../util/formatTime";
import { logInfo, logError } from "../../util/logging";
// store
import {
  setInitialTime,
  setRemainingTime,
  setElapsedTime,
  setIsRunning,
  setActivityIndex,
  setTimeCompleted,
  setHasStarted,
  setFirstRun
} from "../../actions/counterActions";
// Styles
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

const { black, white, skyBlue, green } = Colors;

const MAX_TIME_HOURS = 99;
const MAX_TIME_SECONDS = MAX_TIME_HOURS * 3600;
const MIN_TIME_MINUTES = 0;

const activities = [
  "Study",
  "Work",
  "Exercise",
  "Family time",
  "Screen-free time",
  "Rest"
];

const StopwatchScreen = () => {
  const [alarm, setAlarm] = useState();
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const saveTimeButtonLabel = useSelector(
    state => state.saveTimeButtonLabel.saveTimeButtonLabel
  );

  // Redux dispatch
  const dispatch = useDispatch();
  const initialTime = useSelector(state => state.initialTime.initialTime);
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const isRunning = useSelector(state => state.isRunning.isRunning);
  const hasStarted = useSelector(state => state.hasStarted.hasStarted);
  const activityIndex = useSelector(state => state.activityIndex.activityIndex);
  const firstRun = useSelector(state => state.firstRun.firstRun);

  // custom hooks
  const performReset = usePerformReset();
  const { circleColor, innerCircleColor, updateColors } =
    useUpdateCircleColors();
  const { infoText, setInfoTextWithTimeout, clearTimeoutsAndMessage } =
    useInfoText();
  const { activeButtons, handleButtonPress } = useButtonHandler();
  const {
    pauseStopwatch,
    resumeStopwatch,
    handleNoActivityNoTime,
    handleActivityNoTime,
    handleNoActivityTime,
    handleActivityTime
  } = useStopwatch();

  const {
    resetButtonLabel,
    handleResetClicksZero,
    handleResetClicksOne,
    handleResetClicksTwoOrMore
  } = useResetStopwatch();

  const { playAlarm } = usePlayAlarm(logInfo, logError);

  useEffect(() => {
    if (infoText) {
      const timer = setTimeout(() => {
        clearTimeoutsAndMessage();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [infoText, clearTimeoutsAndMessage]);

  useEffect(() => {
    if (timeCompleted) {
      playAlarm(require("../../assets/alarm_2.wav"));
      saveTimeRecords();
    }
  }, [timeCompleted]);

  // alarm
  useEffect(() => {
    return () => {
      clearTimeoutsAndMessage();
      if (alarm) {
        alarm.unloadAsync();
      }
    };
  }, [alarm]);

  // Start button// Start button handler
  const startStopwatch = () => {
    if (!hasStarted) {
      if (activityIndex === null && remainingTime === 0) {
        handleNoActivityNoTime();
        handleTimeSelection();
      } else if (activityIndex !== null && remainingTime === 0) {
        handleActivityNoTime();
        handleTimeSelection();
      } else if (activityIndex === null && remainingTime > 0) {
        handleNoActivityTime();
        handleTimeSelection();
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

  // Reset button handler
  const resetStopwatch = () => {
    dispatch(setResetClicks(prevClicks => prevClicks + 1));

    if (resetClicks === 0) {
      handleResetClicksZero();
    } else if (resetClicks === 1) {
      // circleColor / innerCircleColor
      updateColors(Colors.skyBlue, Colors.white);
      handleResetClicksOne();
    } else if (resetClicks >= 2) {
      // circleColor / innerCircleColor
      updateColors(Colors.skyBlue, Colors.white);
      handleResetClicksTwoOrMore();
    }
  };

  // Save time records handler
  const saveTimeRecords = () => {
    clearTimeoutsAndMessage();
    dispatch(setIsRunning(false));

    if (remainingTime === 0 && !firstRun) {
      setInfoTextWithTimeout(
        "No time recorded. Please start the timer before saving.",
        1000
      );

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
    dispatch(setSaveTimeButtonLabel("SAVING"));
    setInfoTextWithTimeout("Saving", 3000);
    // circleColor / innerCircleColor
    updateColors(Colors.green, Colors.green);
    setButtonsDisabled(true);

    setTimeout(() => {
      performReset();
      setInfoTextWithTimeout(
        "Time saved successfully! Your activity has been recorded."
      );
    }, 4000);
    clearTimeoutsAndMessage();
  };

  const handleActivityChange = () => {
    dispatch(setIsRunning(false));
    dispatch(setInfoTextWithTimeout("", 1000));
    const newIndex =
      activityIndex === activities.length - 1 ? 0 : activityIndex + 1;
    dispatch(setActivityIndex(newIndex));
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
