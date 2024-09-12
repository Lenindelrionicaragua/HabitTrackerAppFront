import React, { useState, useEffect } from "react";
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
import axios from "axios";

// Icon
import { Octicons, Ionicons } from "@expo/vector-icons";

// Resend timer
import ResendTimer from "../../component/ResendTimer/ResendTimer";

// Api url
import { baseApiUrl } from "../../component/Shared/SharedUrl";

// Redux-store
import { useSelector, useDispatch } from "react-redux";
import { setActiveScreen } from "../../actions/counterActions";

// Colors
const { white, orange } = Colors;

const LinkVerificationScreen = ({ navigation, route }) => {
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState("Please wait");

  // Redux-store
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.activeScreen.activeScreen);

  // Resend timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [targetTime, setTargetTime] = useState(null);
  const [activeResend, setActiveResend] = useState(false);

  const { email, userId } = route?.params;

  const calculateTimeLeft = finalTime => {
    const seconds = finalTime - +new Date();
    if (seconds >= 0) {
      setTimeLeft(Math.round(seconds / 1000));
    } else {
      setTimeLeft(null);
      clearInterval(resendTimerInterval);
      setActiveResend(true);
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

  const resendEmail = async () => {
    setResendingEmail(true);
    // make request
    const url = `${baseApiUrl}/auth/resend-verification-link`;
    try {
      await axios.post(url, { email, userId });
      setResendStatus("Sent!");
    } catch (error) {
      setResendStatus("Failed");
      alert(`Resending email failed! ${error.message}`);
    }
    setResendingEmail(false);
    // Hold on message
    setTimeout(() => {
      setResendStatus("Resend");
      setActiveResend(false);
      triggerTimer();
    }, 5000);
  };

  const handleProceed = () => {
    dispatch(setActiveScreen("LoginScreen"));
    navigation.navigate("LoginScreen", { email: email });
  };

  return (
    <StyledContainer
      style={{ alignItems: "center" }}
      testID="link-verification-container"
    >
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
