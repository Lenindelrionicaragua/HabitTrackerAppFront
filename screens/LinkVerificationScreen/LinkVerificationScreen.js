import React, { useState, useEffect, useContext, useRef } from "react";
import { Linking } from "react-native";
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
  ButtonText
} from "./LinkVerificationStyles";
import PropTypes from "prop-types";
import { Octicons, Ionicons } from "@expo/vector-icons";
import ResendTimer from "../../component/ResendTimer/ResendTimer";
import { useDispatch } from "react-redux";
import { setActiveScreen } from "../../actions/counterActions";
import { CredentialsContext } from "../../context/credentialsContext";
import useFetch from "../../hooks/api/useFetch";
import { logError } from "../../util/logging";

const { white, black, red, green } = Colors;

const LinkVerificationScreen = ({ navigation }) => {
  const [token, setToken] = useState(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const defaultText = "We will send you an email to verify your account.";
  const [message, setMessage] = useState(defaultText);
  const [errorMessage, setErrorMessage] = useState(null);
  const [resendStatus, setResendStatus] = useState("Please wait");

  // Resend timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [targetTime, setTargetTime] = useState(null);
  const [activeResend, setActiveResend] = useState(false);
  const resendTimerRef = useRef(null);

  // Redux-store
  const dispatch = useDispatch();

  // Credentials context
  const { storedCredentials } = useContext(CredentialsContext);

  const email = storedCredentials?.email || "example@email.com";

  useEffect(() => {
    const handleDeepLink = event => {
      // Only parse if there is a query-string
      const parts = event.url.split("?");
      const queryString = parts.length > 1 ? parts[1] : null;
      if (!queryString) {
        return;
      }

      const params = queryString
        .split("&")
        .map(pair => pair.split("="))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      const token = params.token;
      if (token) {
        setToken(token);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });
    return () => subscription.remove();
  }, []);

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

  const handleVerifyResponse = response => {
    const { success, msg, error: serverError } = response;

    if (success) {
      setMessage("Account verified successfully!");
      dispatch(setActiveScreen("LoginScreen"));
      navigation.navigate("LoginScreen", { email });
    } else {
      setErrorMessage(`Verification failed: ${serverError || msg}`);
    }
  };

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
    } else {
      setResendStatus("Failed");
      setActiveResend(false);
      setErrorMessage(`Resending email failed! ${serverError || msg}`);
    }

    handleTimerReset();
  };

  const { performFetch: verifyPerformFetch, isLoading } = useFetch(
    `/auth/sign-up`,
    handleVerifyResponse
  );

  const { performFetch: resendPerformFetch } = useFetch(
    `/auth/resend-verification-email`,
    handleResendResponse
  );

  const resendEmail = () => {
    setResendStatus("Sending...");
    setResendingEmail(true);

    resendPerformFetch({
      method: "POST",
      data: { token }
    }).finally(() => {
      setResendingEmail(false);
      if (resendStatus !== "Sent!") {
        setResendStatus("Failed");
      }
    });
  };

  const verifyToken = token => {
    verifyPerformFetch({
      method: "POST",
      data: { token }
    });
  };

  const handleProceed = () => {
    if (token) {
      verifyToken(token);
    } else {
      logError("No token found in deep link.");
      setErrorMessage("No token found. Please try again.");
    }
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

        <StyledButton onPress={handleProceed} style={{ flexDirection: "row" }}>
          <ButtonText>Proceed</ButtonText>
          <Ionicons name="arrow-forward-circle" size={25} color={white} />
        </StyledButton>
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

LinkVerificationScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default LinkVerificationScreen;
