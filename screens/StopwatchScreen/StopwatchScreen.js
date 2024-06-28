import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  StyledContainer,
  PageTitle,
  Line,
  FocusTitle,
  StyledButton,
  ButtonText,
  RowContainer,
  SwapButton
} from "./StopwatchScreenStyles";

const { white, black, orange, grey } = Colors;
const MAX_TIME = 60;

const StopwatchScreen = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const [label, setLabel] = useState("FOCUS");

  const pad = num => {
    return num.toString().padStart(2, "0");
  };

  const startStopwatch = () => {
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
    clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
  };

  const formatTime = totalMilliseconds => {
    const minutes = Math.floor((totalMilliseconds / (100 * 60)) % 60);
    const seconds = Math.floor((totalMilliseconds / 100) % 60);
    const milliseconds = Math.floor((totalMilliseconds % 100) / 1);
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  };

  const resumeStopwatch = () => {
    startTimeRef.current = Date.now() - time * 10;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 10));
    }, 10);
    setRunning(true);
  };

  const handlePress = () => {
    setLabel(prevLabel => (prevLabel === "FOCUS" ? "REST" : "FOCUS"));
  };

  const circumference = 2 * Math.PI * 150;

  return (
    <StyledContainer>
      <PageTitle>ZenTimer</PageTitle>
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
        </Svg>
        <SwapButton onPress={handlePress}>
          <FocusTitle>{label}</FocusTitle>
          <Ionicons name="swap-horizontal" size={24} color="black" />
        </SwapButton>
      </View>
      <Line />
      <View>
        {running ? (
          <>
            <RowContainer>
              <StyledButton onPress={pauseStopwatch}>
                <AntDesign name="pause" size={24} color="white" />

                {/* <SimpleLineIcons name="control-pause" size={24} color="white" /> */}
                {/* <ButtonText>Pause</ButtonText> */}
              </StyledButton>
              <StyledButton onPress={resetStopwatch}>
                <Ionicons name="stop-outline" size={24} color="white" />
                {/* <ButtonText>Reset</ButtonText> */}
              </StyledButton>
            </RowContainer>
          </>
        ) : (
          <>
            {!running && time === 0 && (
              <RowContainer>
                <StyledButton onPress={startStopwatch}>
                  {/* <Ionicons name="play-outline" size={54} color="white" /> */}
                  <AntDesign name="playcircleo" size={24} color="white" />
                  {/* <ButtonText>Start</ButtonText> */}
                </StyledButton>
              </RowContainer>
            )}
          </>
        )}
        {!running && time > 0 && (
          <>
            <RowContainer>
              <StyledButton onPress={resumeStopwatch}>
                {/* <Ionicons name="play-outline" size={54} color="white" /> */}
                <MaterialCommunityIcons
                  name="restart"
                  size={24}
                  color="white"
                />
                {/* <AntDesign name="playcircleo" size={24} color="white" /> */}
                {/* <ButtonText>Resume</ButtonText> */}
              </StyledButton>
              <StyledButton onPress={resetStopwatch}>
                {/* <Ionicons name="stop-circle-outline" size={24} color="white" /> */}
                <Ionicons name="stop-outline" size={24} color="white" />
                {/* <ButtonText>Reset</ButtonText> */}
              </StyledButton>
            </RowContainer>
          </>
        )}
      </View>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    marginVertical: 0
  }
});

export default StopwatchScreen;
