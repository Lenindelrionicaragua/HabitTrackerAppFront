import React, { useState, useEffect, useContext, useRef } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "./../../styles/AppStyles";
import {
  StyledContainer,
  TopContainer,
  BottomContainer,
  IconBackGround,
  PageTitle,
  InfoText,
  EmphasizeText
} from "./LinkVerificationStyles";
import { Octicons } from "@expo/vector-icons";
import ResendTimer from "../../component/ResendTimer/ResendTimer";
import { CredentialsContext } from "../../context/credentialsContext";
import useFetch from "../../hooks/api/useFetch";

const { white, black, red, green } = Colors;

const LinkVerificationScreen = () => {
  const [resendingEmail, setResendingEmail] = useState(false);
  const defaultText = "We've sent a verification email to:";
  const [message, setMessage] = useState(defaultText);
  const [errorMessage, setErrorMessage] = useState(null);
  const [resendStatus, setResendStatus] = useState("Please wait");

  // Resend timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [targetTime, setTargetTime] = useState(null);
  const [activeResend, setActiveResend] = useState(false);
  const resendTimerRef = useRef(null);

  // Credentials context
  const { storedCredentials } = useContext(CredentialsContext);
  const email = storedCredentials?.email || "example@email.com";
  const userId = storedCredentials?._id;

  const calculateTimeLeft = finalTime => {
    const seconds = finalTime - +new Date();
    if (seconds >= 0) {
      setTimeLeft(Math.round(seconds / 1000));
    } else {
      setTimeLeft(null);
      clearInterval(resendTimerRef.current);
      setActiveResend(true);
      setResendStatus("Resend");
    }
  };

  const triggerTimer = (targetTimeInSeconds = 30) => {
    setTargetTime(targetTimeInSeconds);
    setActiveResend(false);
    const finalTime = +new Date() + targetTimeInSeconds * 1000;
    resendTimerRef.current = setInterval(
      () => calculateTimeLeft(finalTime),
      1000
    );
  };

  useEffect(() => {
    triggerTimer();

    return () => {
      clearInterval(resendTimerRef.current);
    };
  }, []);

  const handleResendResponse = response => {
    const { success, msg, error: serverError } = response;

    const handleTimerReset = () => {
      setTimeout(() => {
        setResendStatus("Please wait");
        triggerTimer();
      }, 5000);
    };

    if (success) {
      setResendStatus("Sent!");
      setActiveResend(false);
      setMessage("We send a new email to verify your account to: ");
    } else {
      setResendStatus("Failed");
      setActiveResend(false);
      setErrorMessage(`Resending email failed! ${serverError || msg}`);
    }

    handleTimerReset();
  };

  const { performFetch: resendPerformFetch, isLoading } = useFetch(
    `/auth/resend-verification-email`,
    handleResendResponse
  );

  const resendEmail = () => {
    setResendStatus("Sending...");
    setResendingEmail(true);

    resendPerformFetch({
      method: "POST",
      data: { token, platform: Platform.OS }
    }).finally(() => {
      setResendingEmail(false);
      if (resendStatus !== "Sent!") {
        setResendStatus("Failed");
      }
    });
  };

  return (
    <StyledContainer
      style={{ alignItems: "center" }}
      testID="link-verification-container">
      <TopContainer>
        <IconBackGround>
          <StatusBar style="dark" />
          <Octicons name="mail" size={125} color={white} />
        </IconBackGround>
      </TopContainer>
      <BottomContainer>
        <PageTitle style={{ fontSize: 25 }}>Account Verification</PageTitle>
        <InfoText
          style={{
            color: errorMessage ? red : message !== defaultText ? green : black
          }}>
          {!errorMessage && message === defaultText && (
            <>
              <EmphasizeText>{message}</EmphasizeText>
              <EmphasizeText>{email}</EmphasizeText>
            </>
          )}

          {errorMessage && (
            <EmphasizeText style={{ color: red }}>{errorMessage}</EmphasizeText>
          )}

          {!errorMessage && message !== defaultText && (
            <EmphasizeText style={{ color: green }}>{message}</EmphasizeText>
          )}
        </InfoText>

        <ResendTimer
          activeResend={activeResend}
          isLoading={isLoading}
          resendStatus={resendStatus}
          timeLeft={timeLeft}
          targetTime={targetTime}
          resendEmail={resendEmail}
          resendingEmail={resendingEmail}
        />
      </BottomContainer>
    </StyledContainer>
  );
};

export default LinkVerificationScreen;
