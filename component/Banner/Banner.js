import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../styles/AppStyles";

const { black, orange, white } = Colors;

const Banner = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.banner}>
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
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: white,
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: white,
    borderRadius: 5
  },
  buttonText: {
    color: orange,
    fontSize: 16
  }
});

export default Banner;
