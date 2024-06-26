import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";

const { black, orange, white } = Colors;

const Banner = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const { height } = Dimensions.get("window");
  // Define a condition for mobile devices
  const isMobile =
    Platform.OS === "ios" || Platform.OS === "android" || width < 768;

  const svgHeight = isMobile ? "90" : { width };
  const svgWidth = isMobile ? "100%" : { height };
  const viewBox = isMobile ? "0 0 1440 120" : "0 0 1440 240";

  return (
    <View style={styles.bannerContainer}>
      <Svg
        height={svgHeight}
        width={svgWidth}
        viewBox={viewBox}
        style={styles.wave}
      >
        <Path
          style={styles.wavePath}
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
    backgroundColor: "transparent"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: orange,
    paddingTop: 0,
    padding: 10
  },
  wave: {
    marginTop: 0,
    width: "100%"
    // backgroundColor: "blue"
  },
  wavePath: {
    backgroundColor: "red"
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
