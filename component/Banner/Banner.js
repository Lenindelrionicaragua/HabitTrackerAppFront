import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

const Banner = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bannerContainer}>
      <Svg height="100" width="100%" viewBox="0 0 1440 120" style={styles.wave}>
        <Path
          fill={"green"}
          d="M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z"
        />
      </Svg>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.buttonText}>STATS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("StopwatchScreen")}
        >
          <Text style={styles.buttonText}>TIMER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignupScreen")}
        >
          <Text style={styles.buttonText}>SETTINGS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "yellow"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "red",
    paddingTop: 0,
    padding: 10
  },
  wave: {
    // position: "absolute",
    // top: 0
    paddingTop: 0,
    width: "100%",
    backgroundColor: "red"
    // position: "absolute",
    // bottom: -100
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "orange",
    borderRadius: 5
  },
  buttonText: {
    color: "white",
    fontSize: 16
  }
});

export default Banner;
