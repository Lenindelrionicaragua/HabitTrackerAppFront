import React from "react";
import PropTypes from "prop-types";
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
            testID="resend-button"
            disabled={!activeResend}
            onPress={activeResend ? resendEmail : null}>
            <TextLinkContent
              style={{
                opacity: activeResend ? 1 : 0.5,
                textDecorationLine: "underline",
                color: textColor
              }}>
              {resendStatus}
            </TextLinkContent>
          </TextLink>
        )}

        {isLoading && (
          <TextLink disabled testID="resend-button">
            <TextLinkContent
              style={{ textDecorationLine: "underline", color: darkGrey }}>
              <ActivityIndicator color={darkGrey} testID="activity-indicator" />
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

ResendTimer.propTypes = {
  activeResend: PropTypes.bool.isRequired,
  resendEmail: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  resendStatus: PropTypes.string.isRequired,
  timeLeft: PropTypes.number,
  targetTime: PropTypes.number
};

export default ResendTimer;
