import React, { useState, useEffect, useContext } from "react";
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

// Icon
import { Octicons, Ionicons } from "@expo/vector-icons";

// Resend timer
import ResendTimer from "../../component/ResendTimer/ResendTimer";

// Redux-store
import { useSelector, useDispatch } from "react-redux";
import { setActiveScreen } from "../../actions/counterActions";

// Credentials context
import { CredentialsContext } from "../../context/credentialsContext";

// useFetch hook
import useFetch from "../../hooks/useFetch";

// Colors
const { white } = Colors;

const LinkVerificationScreen = ({ navigation, route }) => {
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState("Please wait");
  // Resend timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [targetTime, setTargetTime] = useState(null);
  const [activeResend, setActiveResend] = useState(false);

  // Redux-store
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.activeScreen.activeScreen);

  // Credentials context
  const { storedCredentials } = useContext(CredentialsContext);

  const email = storedCredentials?.email;
  const userId = storedCredentials?._id;

  const calculateTimeLeft = finalTime => {
    const seconds = finalTime - +new Date();
    if (seconds >= 0) {
      setTimeLeft(Math.round(seconds / 1000));
    } else {
      setTimeLeft(null);
      clearInterval(resendTimerInterval);
      setActiveResend(true);
      setResendStatus("Resend");
    }
  };

  const triggerTimer = (targetTimeInSeconds = 30) => {
    setTargetTime(targetTimeInSeconds);
    setActiveResend(false);
    const finalTime = +new Date() + targetTimeInSeconds * 1000;
    resendTimerInterval = setInterval(() => calculateTimeLeft(finalTime), 1000);
  };

  useEffect(() => {
    triggerTimer();

    return () => {
      clearInterval(resendTimerInterval);
    };
  }, []);

  // Handler for receiving API responses
  const onReceived = response => {
    const { success, msg, error: serverError } = response;

    if (success) {
      setResendStatus("Sent!");
      setActiveResend(false);
      alert(msg);
    } else {
      setResendStatus("Failed");
      setActiveResend(false);
      alert(`Resending email failed! ${serverError || msg}`);
    }

    // Reset the resend button state after 5 seconds
    setTimeout(() => {
      setResendStatus("Please wait");
      triggerTimer();
    }, 5000);
  };

  // Fetch API for server-side resend email request
  const { performFetch, isLoading, msg, error, data } = useFetch(
    `/auth/resend-verification-link`,
    onReceived
  );

  const resendEmail = () => {
    setResendStatus("Sending...");
    setResendingEmail(true);

    // Perform the fetch request with email and userId
    performFetch({
      method: "POST",
      data: { email, userId }
    });
  };

  const handleProceed = () => {
    dispatch(setActiveScreen("LoginScreen"));
    navigation.navigate("LoginScreen", { email });
  };

  // Update resend status based on loading state
  useEffect(() => {
    const handleTimerReset = () => {
      setTimeout(() => {
        setResendStatus("Please wait");
        triggerTimer();
      }, 5000);
    };

    if (isLoading) {
      setResendStatus("Sending...");
    } else if (data) {
      if (data.success) {
        setResendStatus("Sent!");
        setActiveResend(false);
        alert(data.msg);
        handleTimerReset();
      } else {
        setResendStatus("Failed");
        setActiveResend(false);
        alert(`Error: ${data.error || "An unknown error occurred."}`);
        handleTimerReset();
      }
    } else if (error) {
      setResendStatus("Failed to send!");
      setActiveResend(false);

      const errorMessage = error.response?.data?.error || error.message;
      alert(`Network error: ${errorMessage}`);
      handleTimerReset();
    }
  }, [isLoading, data, error]);

  return (
    <StyledContainer
      style={{ alignItems: "center" }}
      testID="link-verification-container"
    >
      <TopContainer>
        <IconBackGround>
          <StatusBar style="dark" />
          <Octicons name="mail" size={125} color={white} />
        </IconBackGround>
      </TopContainer>
      <BottomContainer>
        <PageTitle style={{ fontSize: 25 }}>Account Verification</PageTitle>
        <InfoText>
          We will sent you an email to verify your account.
          <EmphasizeText>{`${email}`}</EmphasizeText>
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

export default LinkVerificationScreen;
