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
const {
  seaGreen,
  white,
  infoWhite,
  lightPink,
  lightGrey,
  black,
  skyBlue,
  lightGreen
} = Colors;

const LinkVerificationScreen = ({ navigation, route }) => {
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState("Please wait");

  // Redux-store
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.activeScreen.activeScreen);

  // Credentials context
  const { storedCredentials } = useContext(CredentialsContext);

  // Resend timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [targetTime, setTargetTime] = useState(null);
  const [activeResend, setActiveResend] = useState(false);

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
    const { success, msg } = response;
    setResendingEmail(false);

    if (success) {
      setResendStatus("Sent!");
    } else {
      setResendStatus("Failed");
      alert(`Resending email failed! ${msg}`);
    }

    // Reset the resend button state after 5 seconds
    setTimeout(() => {
      setResendStatus("Resend");
      setActiveResend(false);
      triggerTimer();
    }, 5000);
  };

  // Fetch API for server-side resend email request
  const { performFetch, isLoading, error } = useFetch(
    `/auth/resend-verification-link`,
    onReceived
  );

  const resendEmail = () => {
    setResendingEmail(true);

    // Set a timeout for the fetch operation
    const timeout = setTimeout(() => {
      setResendingEmail(false);
      setResendStatus("Resend");
      alert("Resend operation timed out. Please try again.");
    }, 10000);

    // Perform the fetch request with email and userId
    performFetch({
      method: "POST",
      data: { email, userId },
      onComplete: () => clearTimeout(timeout)
    });
  };

  const handleProceed = () => {
    dispatch(setActiveScreen("LoginScreen"));
    navigation.navigate("LoginScreen", { email });
  };

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
          resendingEmail={resendingEmail}
          resendStatus={resendStatus}
          timeLeft={timeLeft}
          targetTime={targetTime}
          resendEmail={resendEmail}
        />
      </BottomContainer>
    </StyledContainer>
  );
};

export default LinkVerificationScreen;
