import React from "react";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  BannerContainer,
  ButtonContainer,
  Button,
  ButtonText
} from "./BannerStyles";

const Banner = ({ storedCredentials }) => {
  const navigation = useNavigation();

  return (
    <BannerContainer>
      <ButtonContainer>
        <Button onPress={() => navigation.navigate("MetricsScreen")}>
          <Ionicons name="stats-chart" size={24} color="white" />
          <ButtonText>Metrics</ButtonText>
        </Button>
        <Button onPress={() => navigation.navigate("StopwatchScreen")}>
          <MaterialIcons name="timer" size={24} color="white" />
          <ButtonText>Timer</ButtonText>
        </Button>
        <Button
          onPress={() =>
            navigation.navigate(
              storedCredentials ? "WelcomeScreen" : "LoginScreen"
            )
          }
        >
          <FontAwesome name="home" size={24} color="white" />
          <ButtonText>Home</ButtonText>
        </Button>
      </ButtonContainer>
    </BannerContainer>
  );
};

export default Banner;
