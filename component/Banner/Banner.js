import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../styles/AppStyles";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

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
          <Ionicons name="stats-chart" size={24} color="white" />
          <Text style={styles.buttonText}>Metrics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("StopwatchScreen")}
        >
          <MaterialIcons name="timer" size={24} color="white" />
          <Text style={styles.buttonText}>Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignupScreen")}
        >
          <FontAwesome name="home" size={24} color="white" />
          <Text style={styles.buttonText}>Home</Text>
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
    alignItems: "center",
    borderRadius: 5
  },
  buttonText: {
    color: white,

    fontSize: 12
  }
});

export default Banner;
