import React, { useState, useContext, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Platform, StatusBar, ActivityIndicator } from "react-native";
import KeyboardAvoider from "../../component/KeyboardAvoider/KeyboardAvoider";
import { Formik } from "formik";
import { Fontisto } from "@expo/vector-icons";
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  FooterView,
  FooterText,
  SignupLink,
  SignupLinkContent
} from "./LoginScreenStyles";
import { Colors } from "../../styles/AppStyles";
import { logError, logInfo } from "../../util/logging";
import TextInputLoginScreen from "../../component/TextInputLoginScreen/TextInputLoginScreen";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../context/credentialsContext";

// Hooks
import useFetch from "../../hooks/useFetch";
import useGoogleFetch from "../../hooks/useGoogleFetch";

// Credentials and Url
import {
  baseApiUrl,
  expoClientId,
  iosClientId,
  androidClientId,
  webClientId
} from "../../component/Shared/SharedUrl";

// redux-store
import { useSelector, useDispatch } from "react-redux";
import { setActiveScreen } from "../../actions/counterActions";

WebBrowser.maybeCompleteAuthSession();

const { seaGreen, infoGrey, darkGrey } = Colors;

const LoginScreen = ({ navigation, route }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [msg, setMsg] = useState("");
  const [success, setSuccessStatus] = useState("");
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Redux-store
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.activeScreen.activeScreen);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: expoClientId,
    iosClientId: iosClientId,
    androidClientId: androidClientId,
    webClientId: webClientId,
    scopes: ["profile", "email", "openid"]
  });

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const onReceived = response => {
    const { success, msg, user } = response;
    if (success) {
      saveLoginCredentials(
        user,
        handleMessage({ successStatus: true, msg: msg })
      );
      navigation.navigate("WelcomeScreen");
      dispatch(setActiveScreen("WelcomeScreen"));
    } else {
      logInfo(msg);
      handleMessage({ successStatus: false, msg: msg });
    }
  };

  // Fetch Api
  const { performFetch, isLoading, error } = useFetch(
    `/auth/log-in`,
    onReceived
  );

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || "An unexpected error occurred.";
      // logError(errorMessage);
      handleMessage({
        successStatus: false,
        msg: errorMessage
      });
    }
  }, [error]);

  // Fetch Google
  const onReceivedGoogleResponse = response => {
    const { success, msg, user } = response;
    if (success) {
      saveLoginCredentials(
        { email: user.email, name: user.name, photoUrl: user.photoUrl },
        { successStatus: true, msg: msg }
      );
      navigation.navigate("WelcomeScreen");
      dispatch(setActiveScreen("WelcomeScreen"));
    } else {
      handleMessage({ successStatus: false, msg: msg });
    }
  };

  const {
    performGoogleFetch,
    isLoading: googleLoading,
    error: googleError
  } = useGoogleFetch(onReceivedGoogleResponse);
  useGoogleFetch(onReceivedGoogleResponse);

  useEffect(() => {
    if (googleError) {
      handleMessage({
        successStatus: false,
        msg: googleError.message || "Google login failed."
      });
      setGoogleSubmitting(false);
    }
  }, [googleError]);

  // Ensure to handle Google sign-in click properly
  const handleGoogleSignIn = () => {
    setGoogleSubmitting(true);
    promptAsync();
  };

  const handleGoogleResponse = authentication => {
    performGoogleFetch(authentication);
  };

  useEffect(() => {}, []);
  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen is focused
      setMsg("");
      setSuccessStatus("");
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen is focused
      const checkStoredCredentials = async () => {
        try {
          const credentials = await AsyncStorage.getItem("zenTimerCredentials");
          if (credentials) {
            await AsyncStorage.removeItem("zenTimerCredentials");
            setStoredCredentials(null);
            dispatch(setActiveScreen("LoginScreen"));
          }
        } catch (error) {
          logError("Error checking stored credentials:", error);
        }
      };
      checkStoredCredentials();
    }, [dispatch, setStoredCredentials])
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleResponse(authentication);
    } else if (response?.type === "error" || response?.type === "dismiss") {
      handleMessage({ msg: "Google sign in was cancelled or failed" });
      setGoogleSubmitting(false);
    }
  }, [response]);

  const getPlatform = () => {
    if (Platform.OS === "ios") {
      return "iOS";
    } else if (Platform.OS === "android") {
      return "Android";
    } else {
      return "Web";
    }
  };

  const handleLogin = (values, setSubmitting) => {
    setMsg("");
    setSuccessStatus("");

    const credentials = {
      email: values.email,
      password: values.password
    };

    // Call performFetch to trigger the request
    performFetch({
      method: "POST",
      data: { user: credentials }
    });
  };

  const handleMessage = ({ successStatus, msg }) => {
    setSuccessStatus(successStatus);
    setMsg(msg);
  };

  const saveLoginCredentials = (credentials, msg, successStatus) => {
    AsyncStorage.setItem("zenTimerCredentials", JSON.stringify(credentials))
      .then(() => {
        handleMessage({
          successStatus: true,
          msg: "Login credentials saved successfully"
        });
        setStoredCredentials(credentials);
      })
      .catch(error => {
        logError(error);
        handleMessage({
          successStatus: false,
          msg: "Failed to save login credentials"
        });
      });
  };

  return (
    <KeyboardAvoider>
      <StyledContainer testID="login-styled-container">
        <StatusBar style="light" />
        <InnerContainer testID="inner-container">
          <PageLogo
            resizeMode="cover"
            source={require("./../../assets/logoZenTimer.png")}
            testID="page-logo"
          />
          <PageTitle testID="page-title">Habit Tracker</PageTitle>
          <SubTitle testID="sub-title">Account Login</SubTitle>

          <Formik
            initialValues={{ email: route?.params?.email ?? "", password: "" }}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting }) => {
              if (values.email == "" || values.password == "") {
                handleMessage({ msg: "Please fill all the fields" });
              } else {
                handleLogin({ email: values.email, password: values.password });
              }
            }}
            testID="login-form-formik"
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                <TextInputLoginScreen
                  label="Email Address"
                  icon="mail"
                  placeholder="serenity@gmail.com"
                  placeholderTextColor={darkGrey}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  testID="email-input"
                />
                <TextInputLoginScreen
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * *"
                  placeholderTextColor={darkGrey}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  testID="password-input"
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={success ? "SUCCESS" : "ERROR"} testID="msg-box">
                  {msg}
                </MsgBox>
                {!isLoading && (
                  <StyledButton
                    onPress={handleSubmit}
                    testID="login-styled-button"
                  >
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}

                {isLoading && (
                  <StyledButton disabled={true} testID="login-styled-button">
                    <ActivityIndicator size="large" color={seaGreen} />
                  </StyledButton>
                )}

                <Line testID="line" />

                {!googleSubmitting && (
                  <StyledButton
                    google={true}
                    disabled={!request}
                    onPress={handleGoogleSignIn}
                    testID="google-styled-button"
                  >
                    <Fontisto
                      name="google"
                      color={infoGrey}
                      size={20}
                      testID="google-icon"
                    />
                    <ButtonText google={true} testID="google-button-text">
                      Sign in with Google
                    </ButtonText>
                  </StyledButton>
                )}

                {googleSubmitting && (
                  <StyledButton
                    google={true}
                    disabled={true}
                    testID="google-styled-button"
                  >
                    <ActivityIndicator size="large" color={seaGreen} />
                  </StyledButton>
                )}
                <FooterView testID="footer-view">
                  <FooterText testID="footer-text">
                    Don't you have an account already?
                  </FooterText>
                  <SignupLink
                    onPress={() => navigation.navigate("SignupScreen")}
                    testID="signup-link"
                  >
                    <SignupLinkContent testID="signup-link-content">
                      Signup
                    </SignupLinkContent>
                  </SignupLink>
                </FooterView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoider>
  );
};

export default LoginScreen;
