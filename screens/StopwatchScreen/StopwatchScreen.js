import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";
import { clearMessagesAndTimeouts, clearInfoTextAfter } from "../../util/utils";
import { logInfo, logError } from "../../util/logging";
import Audio from "expo-av";

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
  const [hasStarted, setHasStarted] = useState(false);
  const [firstRun, setFirstRun] = useState(false);
  const [running, setRunning] = useState(false);
  const [timeCompleted, setTimeCompleted] = useState(false);
  const [alarm, setAlarm] = useState();

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
  const [defaultActivityIndex, setDefaultActivityIndex] = useState(0);
  const [defaultTime, setDefaultTime] = useState(300); // time in seconds
  const [innerCircleColor, setInnerCircleColor] = useState(white);
  const [circleColor, setCircleColor] = useState(skyBlue);

  const [activeButtons, setActiveButtons] = useState({});
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const pad = num => num.toString().padStart(2, "0");

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
      playAlarm();
      fetchTimeRecords();
    }
  }, [timeCompleted]);

  useEffect(() => {
    async function loadAudio() {
      try {
        const asset = Asset.fromModule(require("../../assets/alarm_1.mp3"));
        await asset.downloadAsync();
        setAlarm(asset);
      } catch (error) {
        logError("Error loading audio asset:", error);
      }
    }

    loadAudio();

    // Clean up sound when the component is unmounted
    return () => {
      if (alarm) {
        alarm.unloadAsync();
      }
    };
  }, []);

  async function playAlarm() {
    try {
      if (alarm) {
        const { sound } = await Audio.Sound.createAsync({
          uri: alarm.localUri
        });
        setAlarm(sound);

        logInfo("Playing notification Sound");
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            logInfo("Sound has finished playing");
            sound.unloadAsync();
          }
        });
      } else {
        logError("Audio asset is not loaded");
      }
    } catch (error) {
      logError("Error playing the notification sound:", error);
    }
  }

  // Start button
  const startStopwatch = () => {
    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);

    // Helper functions
    const startTimer = initialTime => {
      setCircleColor(skyBlue);
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = Math.max(
            0,
            initialTime - Math.floor((Date.now() - startTimeRef.current) / 1000)
          );

          if (newTime === 0) {
            clearInterval(intervalRef.current);
            setTimeCompleted(true);

            return newTime;
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
        currentTime,
        "Default activity selected."
      );
      setHasStarted(true);
    };

    const handleActivityTime = () => {
      startTimer(currentTime);
      setInfoText("Timer start with the selected activity.");
      clearInfoTextAfter(5000);
      setRunning(true);
      setFirstRun(true);
      setHasStarted(true);
    };

    const resumeTimer = () => {
      startTimer(currentTime);
      setRunning(true);
      setFirstRun(true);
      setInfoText("Timer resume.");
      clearInfoTextAfter(5000);
    };

    // Main logic
    if (!hasStarted) {
      if (activityIndex === null && currentTime === 0) {
        handleNoActivityNoTime();
      } else if (activityIndex !== null && currentTime === 0) {
        handleActivityNoTime();
      } else if (activityIndex === null && currentTime > 0) {
        handleNoActivityTime();
      } else if (activityIndex !== null && currentTime > 0) {
        handleActivityTime();
      }
    } else {
      if (activityIndex !== null && currentTime > 0) {
        if (!firstRun) {
          handleActivityTime();
        } else {
          resumeTimer();
        }
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
      if (currentTime === 0) {
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
      if (currentTime !== 0) {
        performReset();
        updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
        clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
      }
    };

    const handleResetClicksTwoOrMore = () => {
      if (currentTime === 0) {
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
  const fetchTimeRecords = () => {
    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);
    setRunning(false);

    if (currentTime === 0 && !firstRun) {
      setInfoText("No time recorded. Please start the timer before saving.");
      clearInfoTextAfter(1000, setInfoText, setResetTimeouts, resetTimeouts);

      return;
    }

    if ((currentTime !== 0 && firstRun) || timeCompleted) {
      handleSaveProcess();
      return;
    }
  };

  const handleSaveProcess = () => {
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
    logInfo("Saved records");
  };

  // Function to perform reset
  const performReset = () => {
    setCurrentTime(0);
    setInitialTime(0);
    setElapsedTime(0);
    setActivityIndex(null);
    setHasStarted(false);
    setRunning(false);
    setFirstRun(false);
    setResetClicks(0);
    setButtonsDisabled(false);
    setResetButtonLabel("RESET");
    setSaveTimeButtonLabel("SAVE-TIME");
    setCircleColor(skyBlue);
    setInnerCircleColor(white);
    setButtonsDisabled(false);
    setTimeCompleted(false);
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
      setInitialTime(newInitialTime);
      setCurrentTime(newInitialTime);
      setElapsedTime(0);
      setRunning(false);
    } else {
      setInitialTime(MAX_TIME_SECONDS);
      setCurrentTime(MAX_TIME_SECONDS);
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

    // Calculate the fraction of time elapsed safely only if initialTime > 0
    const timeFraction =
      effectiveInitialTime > 0
        ? Math.min(effectiveElapsedTime / effectiveInitialTime, 1)
        : 0;

    let strokeDashoffset = circumference * (1 - timeFraction);

    // Ensure strokeDashoffset is not negative and round to avoid floating-point issues
    strokeDashoffset = Math.max(0, Math.round(strokeDashoffset * 1000) / 1000);

    if (isNaN(strokeDashoffset) || initialTime <= 0) {
      strokeDashoffset = 0;
    }

    return { circumference, strokeDashoffset };
  };

  const { circumference, strokeDashoffset } = calculateCircleParams();

  const handleButtonPress = buttonId => {
    setActiveButtons(prevState => ({
      ...Object.fromEntries(Object.keys(prevState).map(key => [key, false])), // Reset all buttons to false
      [buttonId]: true
    }));

    setTimeout(() => {
      setActiveButtons(prevState => ({
        ...prevState,
        [buttonId]: false
      }));
    }, 500);
  };

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
          onPress={() => handleTimeButtonPress(currentTime - 60, 12)}
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
          onPress={() => handleTimeButtonPress(currentTime + 60, 11)}
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
            {formatTime(currentTime)}
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
              fetchTimeRecords();
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
