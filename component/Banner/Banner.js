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

const Banner = ({ storedCredentials }) => {
  const navigation = useNavigation();

  const activeScreen = useSelector(state => state.activeScreen.activeScreen);

  return (
    <BannerContainer>
      <ButtonContainer>
        <Button onPress={() => navigation.navigate("activeScreen")}>
          <Ionicons name="stats-chart" size={24} color="white" />
          <ButtonText>Metrics</ButtonText>
        </Button>
        <Button onPress={() => navigation.navigate(" activeScreen")}>
          <MaterialIcons name="timer" size={24} color="white" />
          <ButtonText>Timer</ButtonText>
        </Button>
        <Button onPress={() => navigation.navigate(activeScreen)}>
          <FontAwesome name="home" size={24} color="white" />
          <ButtonText>Home</ButtonText>
        </Button>
      </ButtonContainer>
    </BannerContainer>
  );
};

export default Banner;
