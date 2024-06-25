import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../styles/AppStyles";

const { black, orange, white } = Colors;

const Banner = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Svg height="60%" width="100%" viewBox="0 0 1440 320" style={styles.wave}>
        <Path
          fill={"red"}
          d="M0,96L30,90.7C60,85,120,75,180,85.3C240,96,300,128,360,160C420,192,480,224,540,213.3C600,203,660,149,720,122.7C780,96,840,96,900,112C960,128,1020,160,1080,160C1140,160,1200,128,1260,101.3C1320,75,1380,53,1410,42.7L1440,32L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        />
      </Svg>
      <View style={styles.bannerContent}>
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
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center"
  },
  wave: {
    position: "absolute",
    top: 0,
    width: "100%"
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent", // Make background transparent to show the wave
    padding: 20,
    width: "100%",
    paddingTop: 60 // To account for the wave height
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
