//* This component will only show on first launch
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

// eslint-disable-next-line react/prop-types
export default function FirstTimeWelcomeScreen({ onGetStarted }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/iconZenTimerApp.png")} // replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to ZenTimer</Text>
      <Text style={styles.subtitle}>
        Your space for mindful habits and focused living.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ffffff"
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
