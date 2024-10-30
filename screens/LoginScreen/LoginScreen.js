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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../context/credentialsContext";

// Hooks for data fetching
import useFetch from "../../hooks/useFetch";
import useGoogleFetch from "../../hooks/useGoogleFetch";

// Credentials
import {
  expoClientId,
  iosClientId,
  androidClientId,
  webClientId
} from "../../component/Shared/SharedUrl";

// Redux store
import { useSelector, useDispatch } from "react-redux";
import { setActiveScreen } from "../../actions/counterActions";

WebBrowser.maybeCompleteAuthSession();

const { seaGreen, infoGrey, darkGrey } = Colors;

const LoginScreen = ({ navigation, route }) => {
  // Local state for handling form interactions
  const [hidePassword, setHidePassword] = useState(true);
  const [msg, setMsg] = useState("");
  const [success, setSuccessStatus] = useState("");
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Redux state and actions
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.activeScreen.activeScreen);

  // Google authentication request setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: expoClientId,
    iosClientId: iosClientId,
    androidClientId: androidClientId,
    webClientId: webClientId,
    scopes: ["profile", "email", "openid"]
  });

  // Retrieve stored credentials from context
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  // Handler for receiving API responses
  const onReceived = response => {
    const { success, msg, user } = response;
    if (success) {
      saveLoginCredentials(user, { successStatus: true, msg });
      navigation.navigate("WelcomeScreen");
      dispatch(setActiveScreen("WelcomeScreen"));
    } else {
      logInfo(msg);
      handleMessage({ successStatus: false, msg });
    }
  };

  // Fetch API for login request
  const { performFetch, isLoading, error } = useFetch(
    `/auth/log-in`,
    onReceived
  );

  // Handle errors from API calls
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || "An unexpected error occurred.";
      handleMessage({
        successStatus: false,
        msg: errorMessage
      });
    }
  }, [error]);

  // Fetch handler for Google authentication response
  const onReceivedGoogleResponse = response => {
    const { success, message, token } = response;
    if (success) {
      saveLoginCredentials(
        {
          email: response.email,
          name: response.name,
          photoUrl: response.picture
        },
        { successStatus: true, message }
      );
      navigation.navigate("WelcomeScreen");
      dispatch(setActiveScreen("WelcomeScreen"));
    } else {
      handleMessage({ successStatus: false, message });
    }
  };

  const {
    performGoogleFetch,
    isLoading: googleLoading,
    error: googleError
  } = useGoogleFetch(onReceivedGoogleResponse);

  // Handle errors from Google API
  useEffect(() => {
    if (googleError) {
      handleMessage({
        successStatus: false,
        msg: googleError.message || "Google login failed."
      });
      setGoogleSubmitting(false);
    }
  }, [googleError]);

  // Trigger Google sign-in
  const handleGoogleSignIn = () => {
    setGoogleSubmitting(true);
    promptAsync();
  };

  // Process Google sign-in response
  const handleGoogleResponse = authentication => {
    performGoogleFetch(authentication);
  };

  // Reset message and status when screen focuses
  useFocusEffect(
    useCallback(() => {
      setMsg("");
      setSuccessStatus("");
    }, [])
  );

  // Check for stored user credentials upon screen focus
  useFocusEffect(
    useCallback(() => {
      const checkStoredCredentials = async () => {
        try {
          const user = await AsyncStorage.getItem("zenTimerUser");
          if (user) {
            await AsyncStorage.removeItem("zenTimerUser");
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

  // Handle Google response based on the result type
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleResponse(authentication);
    } else if (response?.type === "error" || response?.type === "dismiss") {
      handleMessage({ msg: "Google sign in was cancelled or failed" });
      setGoogleSubmitting(false);
    }
  }, [response]);

  // Handle form submission for login
  const handleLogin = (values, setSubmitting) => {
    setMsg("");
    setSuccessStatus("");

    const credentials = {
      email: values.email,
      password: values.password
    };

    // Perform login API request
    performFetch({
      method: "POST",
      data: { user: credentials }
    });
  };

  // Update message box based on success or error
  const handleMessage = ({ successStatus, msg }) => {
    setSuccessStatus(successStatus);
    setMsg(msg);
  };

  // Save user-related credentials in AsyncStorage
  const saveLoginCredentials = async (user, msg, successStatus) => {
    try {
      await AsyncStorage.setItem("zenTimerUser", JSON.stringify(user));
      handleMessage({
        successStatus: true,
        msg: "User credentials saved successfully"
      });
      setStoredCredentials(user);
    } catch (error) {
      logError(error);
      handleMessage({
        successStatus: false,
        msg: "Failed to save user credentials"
      });
    } finally {
      setGoogleSubmitting(false);
    }
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
