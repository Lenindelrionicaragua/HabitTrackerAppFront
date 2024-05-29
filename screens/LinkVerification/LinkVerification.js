import React from "react";
import { StatusBar } from "expo-status-bar";
import { Colors } from "./../../styles/AppStyles";
import {
  StyledContainer,
  TopContainer,
  BottomContainer,
  IconBackGround,
  PageTitle,
  InfoText,
  EmphasizeText,
  StyledButton,
  ButtonText,
  InlineGroup,
  TextLink,
  TextLinkContent
} from "./LinkVerificationStyles";
// icon
import { Octicons, Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
// Colors
const { white, orange, grey, yellow, lightGrey, black } = Colors;

const LinkVerification = () => {
  return (
    <StyledContainer style={{ alignItems: "center" }}>
      <TopContainer>
        <IconBackGround>
          <StatusBar style="dark" />
          <Octicons name="mail" size={125} color={orange} />
        </IconBackGround>
      </TopContainer>
      <BottomContainer>
        <PageTitle style={{ fontSize: 25 }}>Account Verification</PageTitle>
        <InfoText>
          We will sent you an email to verify your account.
          <EmphasizeText>{`test.riodeluzcreativos@gmail.com`}</EmphasizeText>
        </InfoText>
        <StyledButton onPress={() => {}} style={{ flexDirection: "row" }}>
          <ButtonText>Send it</ButtonText>
          <Ionicons name="arrow-forward-circle" size={25} color={white} />
        </StyledButton>
        <View>
          <InlineGroup>
            <InfoText>Didn't receive the email?</InfoText>
            <TextLink onPress={() => {}}>
              <TextLinkContent style={{ textDecorationLine: "underline" }}>
                Resend
              </TextLinkContent>
            </TextLink>
          </InlineGroup>
          <InfoText>
            in <EmphasizeText>{`20`}</EmphasizeText> second(s)
          </InfoText>
        </View>
      </BottomContainer>
    </StyledContainer>
  );
};

export default LinkVerification;
