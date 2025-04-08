import React from "react";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  BannerContainer,
  ButtonContainer,
  Button,
  ButtonText
} from "./BannerStyles";
import { logInfo } from "../../util/logging";

const Banner = () => {
  const navigation = useNavigation();
  const activeScreen = useSelector(state => state.activeScreen.activeScreen);

  return (
    <BannerContainer>
      <ButtonContainer>
        <Button
          onPress={() => {
            logInfo("Metrics button pressed");
            navigation.navigate("MetricsScreen");
          }}
          testID="metrics-banner-button">
          <Ionicons name="stats-chart" size={24} color="white" />
          <ButtonText>Metrics</ButtonText>
        </Button>
        <Button
          onPress={() => navigation.navigate("StopwatchScreen")}
          testID="stopwatch-banner-button">
          <MaterialIcons name="timer" size={24} color="white" />
          <ButtonText>Timer</ButtonText>
        </Button>
        <Button
          onPress={() => navigation.navigate(activeScreen)}
          testID="home-banner-button">
          <FontAwesome name="home" size={24} color="white" />
          <ButtonText>Home</ButtonText>
        </Button>
      </ButtonContainer>
    </BannerContainer>
  );
};

export default Banner;
