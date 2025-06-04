import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import useFetch from "../../hooks/api/useFetch";
import {
  StyledContainer,
  TopContainer,
  BottomContainer,
  IconBackGround,
  PageTitle,
  InfoText
} from "../EmailVerificationScreen/EmailVerificationScreenStyles";
import { Octicons } from "@expo/vector-icons";

const EmailVerificationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params;

  const handleResponse = data => {
    if (data.success) {
      navigation.replace("SuccessScreen");
    } else {
      navigation.replace("ErrorScreen", {
        msg: data.msg || "Verification failed."
      });
    }
  };

  const { performFetch, isLoading, error } = useFetch(
    "/auth/sign-up",
    handleResponse
  );

  useEffect(() => {
    if (token) {
      performFetch({
        method: "POST",
        data: { token }
      });
    } else {
      navigation.replace("ErrorScreen", { msg: "No token provided." });
    }
  }, [token]);

  return (
    <StyledContainer>
      <TopContainer>
        <IconBackGround>
          <Octicons name="mail" size={125} color="white" />
        </IconBackGround>
      </TopContainer>
      <BottomContainer>
        <PageTitle>Email Verification</PageTitle>
        {isLoading && (
          <>
            <ActivityIndicator size="large" color="#000" />
            <InfoText>Verifying your email, please wait...</InfoText>
          </>
        )}
        {error && <InfoText style={{ color: "red" }}>{error.message}</InfoText>}
      </BottomContainer>
    </StyledContainer>
  );
};

export default EmailVerificationScreen;
