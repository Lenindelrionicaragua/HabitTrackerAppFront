import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { useFocusEffect } from "@react-navigation/native";
// Hooks
import useCircleParams from "../../hooks/useCircleParams";
import { usePlayAlarm } from "../../hooks/usePlayAlarm";
import useStopwatch from "../../hooks/useStopwatch";
import useResetStopwatch from "../../hooks/useResetStopwatch";
import { useButtonHandler } from "../../hooks/useButtonHandler";
import useUpdateCircleColors from "../../hooks/useUpdateCircleColors";
import useInfoText from "../../hooks/useInfoText";
import useSaveTimeRecords from "../../hooks/useSaveTimeRecords";
// Utils
import { formatTime } from "../../util/formatTime";
// Store
import {
  setResetClicks,
  saveTimeButtonLabel,
  loadHabitCategories
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

const { black } = Colors;

const StopwatchScreen = () => {
  const dispatch = useDispatch();

  // Time-related store states
  const initialTime = useSelector(state => state.initialTime.initialTime);
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const isRunning = useSelector(state => state.isRunning.isRunning);
  const hasStarted = useSelector(state => state.hasStarted.hasStarted);

  // Habit category-related store states
  const habitCategoryIndex = useSelector(
    state => state.habitCategoryIndex.habitCategoryIndex
  );
  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );
  const selectedCategory = habitCategories?.[habitCategoryIndex] ?? null;

  // Variables derived from store states
  // const categoryId = selectedCategory ? selectedCategory.id : null;
  const categoryName = selectedCategory
    ? selectedCategory.name
    : "Please log in to access your habit categories.";

  // Other store states
  const firstRun = useSelector(state => state.firstRun.firstRun);
  const resetClicks = useSelector(state => state.resetClicks.resetClicks);
  const buttonsDisabled = useSelector(
    state => state.buttonsDisabled.buttonsDisabled
  );

  // custom hooks
  const { circleColor, innerCircleColor, updateColors } =
    useUpdateCircleColors();
  const { infoText, clearTimeoutsAndMessage } = useInfoText();
  const buttonIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const { activeButtons, handleButtonPress } = useButtonHandler(buttonIds);
  const { saveTimeRecords } = useSaveTimeRecords();

  const {
    pauseStopwatch,
    resumeStopwatch,
    handleNoHabitCategoryNoTime,
    handleHabitCategoryNoTime,
    handleNoHabitCategoryTime,
    handleHabitCategoryTime,
    handleTimeSelection,
    handleHabitCategoryChange
  } = useStopwatch();

  const {
    resetButtonLabel,
    handleResetClicksZero,
    handleResetClicksOne,
    handleResetClicksTwoOrMore
  } = useResetStopwatch();

  const { playAlarm } = usePlayAlarm();

  useEffect(() => {
    if (infoText) {
      const duration = timeCompleted ? 5000 : 3000;

      const timer = setTimeout(() => {
        clearTimeoutsAndMessage();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [infoText, timeCompleted, clearTimeoutsAndMessage]);

  useEffect(() => {
    if (timeCompleted) {
      playAlarm(require("../../assets/alarm_2.wav"));
      saveTimeRecords();
    }
  }, [timeCompleted]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(loadHabitCategories());
    }, [dispatch])
  );

  // Start button// Start button handler
  const startStopwatch = () => {
    if (!hasStarted) {
      if (habitCategoryIndex === null && remainingTime === 0) {
        handleNoHabitCategoryNoTime();
      } else if (habitCategoryIndex !== null && remainingTime === 0) {
        handleHabitCategoryNoTime();
      } else if (habitCategoryIndex === null && remainingTime > 0) {
        handleNoHabitCategoryTime();
      } else if (habitCategoryIndex !== null && remainingTime > 0) {
        handleHabitCategoryTime();
      }
    } else {
      if (habitCategoryIndex !== null && remainingTime > 0) {
        if (!firstRun) {
          handleHabitCategoryTime();
        } else {
          resumeStopwatch();
        }
      }
    }
  };

  // Reset button handler
  const resetStopwatch = () => {
    const newResetClicks = resetClicks + 1;
    dispatch(setResetClicks(newResetClicks));

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

  // Debounced versions of the button handlers
  const debouncedResetStopwatch = debounce(
    () => {
      if (!buttonsDisabled) {
        pauseStopwatch();
        resetStopwatch();
        handleButtonPress(6);
      }
    },
    500,
    { leading: true, trailing: false }
  );

  const debouncedStartStopwatch = debounce(
    () => {
      if (!buttonsDisabled) {
        startStopwatch();
        handleButtonPress(8);
      }
    },
    500,
    { leading: true, trailing: false }
  );

  const debouncedPauseStopwatch = debounce(
    () => {
      if (!buttonsDisabled) {
        pauseStopwatch();
        handleButtonPress(7);
      }
    },
    500,
    { leading: true, trailing: false }
  );

  const debouncedSaveTimeRecords = debounce(
    () => {
      if (!buttonsDisabled) {
        pauseStopwatch();
        saveTimeRecords();
        handleButtonPress(9);
      }
    },
    500,
    { leading: true, trailing: false }
  );

  return (
    <StyledContainer testID="stopwatch-screen-container">
      <ScreenTitle testID="stopwatch-title">Habit Tracker</ScreenTitle>
      <TimeButtonsContainer
        style={getButtonStyles(13)}
        testID="stopwatch-time-buttons">
        <TimeButton
          onPress={() => handleTimeButtonPress(remainingTime - 60, 12)}
          style={getButtonStyles(12)}
          disabled={isRunning || firstRun}>
          <ButtonTimeText>-</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(5 * 60, 1)}
          style={getButtonStyles(1)}
          disabled={isRunning || firstRun}>
          <ButtonTimeText>05</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(15 * 60, 2)}
          style={getButtonStyles(2)}
          disabled={isRunning || firstRun}>
          <ButtonTimeText>15</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(30 * 60, 3)}
          style={getButtonStyles(3)}
          disabled={isRunning || firstRun}>
          <ButtonTimeText>30</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(45 * 60, 4)}
          style={getButtonStyles(4)}
          disabled={isRunning || firstRun}>
          <ButtonTimeText>45</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(55 * 60, 5)}
          style={getButtonStyles(5)}
          disabled={isRunning || firstRun}>
          <ButtonTimeText>55</ButtonTimeText>
        </TimeButton>
        <TimeButton
          onPress={() => handleTimeButtonPress(remainingTime + 60, 11)}
          style={getButtonStyles(11)}
          disabled={isRunning || firstRun}>
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
            testID="svg-time-text">
            {formatTime(remainingTime)}
          </SvgText>
          <SvgText
            x="180"
            y="230"
            textAnchor="middle"
            fontSize="10"
            fill={black}
            testID="svg-info-text">
            {infoText}
          </SvgText>
        </Svg>
      </View>
      <InfoText testID="info-text-stopwatch-screen">I'm focusing on</InfoText>
      <FocusTitleContainer testID="focus-activity-button">
        <FocusTitleText
          onPress={() => {
            if (!buttonsDisabled && !firstRun) {
              handleHabitCategoryChange();
              handleButtonPress(10);
            }
          }}
          style={{
            boxShadow: activeButtons[10] ? 1.2 : 0.8,
            opacity: buttonsDisabled || firstRun ? 0.5 : 1,
            cursor: buttonsDisabled || firstRun ? "not-allowed" : "pointer"
          }}
          disabled={buttonsDisabled}>
          {habitCategoryIndex === null ? "Click here" : categoryName}{" "}
        </FocusTitleText>
      </FocusTitleContainer>

      <RowContainer>
        <StyledButtonLeft
          onPress={debouncedResetStopwatch}
          disabled={buttonsDisabled}
          testID="reset-button">
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
            onPress={debouncedPauseStopwatch}
            disabled={buttonsDisabled}
            testID="pause-button">
            <AntDesign
              name="pause"
              size={44}
              color={activeButtons[7] ? Colors.skyBlue : Colors.black}
            />
          </StyledStartButton>
        ) : (
          <StyledStartButton
            onPress={debouncedStartStopwatch}
            disabled={buttonsDisabled}
            testID="start-button">
            <MaterialIcons
              name="play-arrow"
              size={44}
              color={activeButtons[8] ? Colors.skyBlue : Colors.black}
              style={{ opacity: buttonsDisabled ? 0.5 : 1 }}
            />
          </StyledStartButton>
        )}
        <StyledButtonRight
          onPress={debouncedSaveTimeRecords}
          disabled={buttonsDisabled}
          testID="save-button">
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
