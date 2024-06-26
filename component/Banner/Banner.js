import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../styles/AppStyles";

const { black, orange, white } = Colors;

const Banner = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bannerContainer}>
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
    backgroundColor: "transparent"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: orange,
    paddingTop: 0,
    padding: 10
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: orange,
    borderRadius: 5
  },
  buttonText: {
    color: white,
    fontSize: 16
  }
});

export default Banner;
