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

const { black, darkGrey, green, red } = Colors;

const ResendTimer = ({
  activeResend,
  resendEmail,
  isLoading,
  resendStatus,
  timeLeft,
  targetTime
}) => {
  const textColor =
    resendStatus === "Failed" || resendStatus === "Failed to send!"
      ? red
      : resendStatus === "Sent!"
        ? green
        : black;

  return (
    <View>
      <InlineGroup>
        <InfoText>Didn't receive the email?</InfoText>

        {!isLoading && (
          <TextLink
            disable={!activeResend}
            onPress={activeResend ? resendEmail : null}
          >
            <TextLinkContent
              style={{
                opacity: activeResend ? 1 : 0.5,
                textDecorationLine: "underline",
                color: textColor
              }}
            >
              {resendStatus}
            </TextLinkContent>
          </TextLink>
        )}

        {isLoading && (
          <TextLink disable>
            <TextLinkContent
              style={{ textDecorationLine: "underline", color: darkGrey }}
            >
              <ActivityIndicator color={darkGrey} />
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
