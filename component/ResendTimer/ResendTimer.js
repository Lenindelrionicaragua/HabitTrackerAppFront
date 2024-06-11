import React from "react";
import { ActivityIndicator, View } from "react-native";
import {
  InfoText,
  EmphasizeText,
  InlineGroup,
  TextLink,
  TextLinkContent
} from "./ResendTimerStyles";
import { Colors } from "./../../styles/AppStyles";

const { lightGrey } = Colors;

const ResendTimer = ({
  activeResend,
  resendEmail,
  resendingEmail,
  resendStatus,
  timeLeft,
  targetTime
}) => {
  return (
    <View>
      <InlineGroup>
        <InfoText>Didn't receive the email?</InfoText>

        {!resendingEmail && (
          <TextLink
            disable={!activeResend}
            onPress={activeResend ? resendEmail : null}
          >
            <TextLinkContent
              style={{
                opacity: activeResend ? 1 : 0.5,
                textDecorationLine: "underline"
              }}
              resendStatus={resendStatus}
            >
              {resendStatus}
            </TextLinkContent>
          </TextLink>
        )}

        {resendingEmail && (
          <TextLink disable>
            <TextLinkContent
              resendStatus={resendStatus}
              style={{ textDecorationLine: "underline" }}
            >
              <ActivityIndicator color={lightGrey} />
            </TextLinkContent>
          </TextLink>
        )}
      </InlineGroup>
      {!activeResend && (
        <InfoText>
          in <EmphasizeText>{timeLeft || targetTime}</EmphasizeText> second(s)
        </InfoText>
      )}
    </View>
  );
};

export default ResendTimer;
