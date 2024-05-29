import React from "react";
import { View } from "react-native";
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
} from "./ResendTimerStyles";

const ResendTimer = () => {
  return (
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
  );
};

export default ResendTimer;
