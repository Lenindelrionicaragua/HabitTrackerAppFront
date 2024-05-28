import React from "react";
import { StatusBar } from "expo-status-bar";
import { Colors } from "./../../styles/AppStyles";
import {
  StyledContainer,
  TopContainer,
  BottomContainer,
  IconBackGround
} from "./LinkVerificationStyles";
// icon
import { Octicons } from "@expo/vector-icons";

// Colors
const { white, orange, grey, yellow, lightGrey, black, lightGreen } = Colors;

const LinkVerification = () => {
  return (
    <StyledContainer style={{ alignItems: "center" }}>
      <TopContainer>
        <IconBackGround>
          <StatusBar style="dark" />{" "}
          <Octicons name="mail" size={125} color={orange} />
        </IconBackGround>
      </TopContainer>
      <BottomContainer></BottomContainer>
    </StyledContainer>
  );
};

export default LinkVerification;
