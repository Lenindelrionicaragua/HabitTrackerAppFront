import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";

const { white, black, orange, lightGrey } = Colors;

const App = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const MAX_TIME = 60;

  const startStopwatch = () => {
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
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

  const resumeStopwatch = () => {
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    setRunning(true);
  };

  const circumference = 2 * Math.PI * 50;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ZenTimer</Text>
      <Text style={styles.subHeader}>Stop Watch In Native</Text>
      <View style={styles.svgContainer}>
        <Svg height="360" width="360" viewBox="0 0 360 360">
          <rect width="100%" height="100%" fill="black" />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke="white"
            strokeWidth="10"
            fill="none"
          />
          <Circle
            cx="180"
            cy="180"
            r="150"
            stroke="orange"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * time) / MAX_TIME}
          />
        </Svg>
      </View>
      <Text style={styles.timeText}>{time}s</Text>
      <View style={styles.buttonContainer}>
        {running ? (
          <TouchableOpacity
            style={[styles.button, styles.pauseButton]}
            onPress={pauseStopwatch}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={startStopwatch}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetStopwatch}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
        {!running && time > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.resumeButton]}
            onPress={resumeStopwatch}
          >
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black"
  },
  header: {
    fontSize: 30,
    color: "white",
    marginBottom: 10
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: "orange"
  },
  svgContainer: {
    marginVertical: 20
  },
  timeText: {
    fontSize: 48,
    color: "white"
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5
  },
  startButton: {
    backgroundColor: "orange"
  },
  resetButton: {
    backgroundColor: "white"
  },
  pauseButton: {
    backgroundColor: "orange"
  },
  resumeButton: {
    backgroundColor: "white"
  },
  buttonText: {
    color: "black",
    fontSize: 16
  }
});

export default App;
