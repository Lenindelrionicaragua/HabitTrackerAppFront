// BackgroundColorApp.js
import React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const BackgroundColorApp = ({ children }) => {
  return (
    <LinearGradient colors={["#5cbcfc", "#bbcbde"]} style={styles.gradient}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  }
});

export default BackgroundColorApp;
