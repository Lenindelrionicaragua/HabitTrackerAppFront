import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar, ActivityIndicator } from "react-native";
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
import useFetch from "../../hooks/api/useFetch";
import useGoogleFetch from "../../hooks/api/useGoogleFetch";

// Credentials
import {
  expoClientId,
  iosClientId,
  androidClientId,
  webClientId
} from "../../component/Shared/SharedUrl";

// Redux store
import { useDispatch } from "react-redux";
import { setActiveScreen } from "../../actions/counterActions";

WebBrowser.maybeCompleteAuthSession();

const { seaGreen, infoGrey, lightGreen } = Colors;

const LoginScreen = ({ navigation, route }) => {
  // Local state for handling form interactions
  const [hidePassword, setHidePassword] = useState(true);
  const [msg, setMsg] = useState("");
  const [success, setSuccessStatus] = useState("");
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Redux state and actions
  const dispatch = useDispatch();

  // Google authentication request setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: expoClientId,
    iosClientId: iosClientId,
    androidClientId: androidClientId,
    webClientId: webClientId,
    scopes: ["profile", "email", "openid"]
  });

  // Retrieve stored credentials from context
  const { setStoredCredentials } = useContext(CredentialsContext);

  // Handler for receiving API responses
  const onReceived = response => {
    const { success, msg, user, token } = response;
    if (success) {
      saveLoginCredentials(user, token, success, msg);
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
    const { success, msg, user, token } = response;
    if (success) {
      saveLoginCredentials(
        {
          email: user.email,
          name: user.name,
          photoUrl: user.picture
        },
        token,
        success,
        msg
      );
      // document.cookie = response.headers["set-cookie"];
      navigation.navigate("WelcomeScreen");
      dispatch(setActiveScreen("WelcomeScreen"));
    } else {
      handleMessage({ successStatus: false, msg: msg });
    }
  };

  const { performGoogleFetch, error: googleError } = useGoogleFetch(
    onReceivedGoogleResponse
  );

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
          const userToken = await AsyncStorage.getItem("zenTimerToken");
          const storedUser = await AsyncStorage.getItem("zenTimerUser");

          if (userToken && storedUser) {
            setStoredCredentials(JSON.parse(storedUser));
            dispatch(setActiveScreen("WelcomeScreen"));
            navigation.navigate("WelcomeScreen");
          } else {
            dispatch(setActiveScreen("LoginScreen"));
          }
        } catch (error) {
          logError("Error checking stored credentials:", error);
        }
      };

      checkStoredCredentials();
    }, [dispatch, setStoredCredentials, navigation])
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
  const handleLogin = values => {
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
  const saveLoginCredentials = async (
    user,
    token = null,
    msg = "",
    successStatus = true
  ) => {
    try {
      await AsyncStorage.setItem("zenTimerUser", JSON.stringify(user));
      if (token) {
        await AsyncStorage.setItem("zenTimerToken", token);
      }
      handleMessage({
        successStatus: successStatus,
        msg: msg || "User credentials saved successfully"
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
            onSubmit={values => {
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
                  placeholderTextColor={lightGreen}
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
                  placeholderTextColor={lightGreen}
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

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      email: PropTypes.string
    })
  }).isRequired
};

export default LoginScreen;
