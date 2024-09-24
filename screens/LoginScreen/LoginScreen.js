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

// hooks
import useFetch from "../../hooks/useFetch";

WebBrowser.maybeCompleteAuthSession();

const { seaGreen, infoGrey, darkGrey } = Colors;

const LoginScreen = ({ navigation, route }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [msg, setMsg] = useState("");
  const [success, setSuccessStatus] = useState("");
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { isLoading, error, performFetch, cancelFetch, data } = useFetch(
    "/auth/log-in",
    response => {
      if (response) {
        const { success, msg, user } = response;
        if (success) {
          saveLoginCredentials(user);
          navigation.navigate("WelcomeScreen");
          dispatch(setActiveScreen("WelcomeScreen"));
        } else {
          logInfo(msg);
          handleMessage({ successStatus: false, msg });
        }
      }
    }
  );

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

  const handleGoogleResponse = async authentication => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${authentication.accessToken}`
      );
      const { email, name, picture } = res.data;
      const platform = getPlatform();
      await sendGoogleDataToServer({
        email,
        name,
        token: authentication.idToken,
        platform: platform
      });

      saveLoginCredentials(
        {
          email,
          name,
          photoUrl: picture
        },
        {
          successStatus: true,
          msg: "Google signin was successful"
        }
      );
      navigation.navigate("WelcomeScreen");
      dispatch(setActiveScreen("WelcomeScreen"));
    } catch (error) {
      handleMessage({
        msg: "An error occurred. Check your network and try again"
      });
    } finally {
      setGoogleSubmitting(false);
    }
  };

  // Ensure to handle Google sign-in click properly
  const handleGoogleSignIn = () => {
    setGoogleSubmitting(true);
    promptAsync();
  };

  const sendGoogleDataToServer = async userData => {
    try {
      console.log("Sending data to server:", userData);
      const response = await axios.post(
        `${baseApiUrl}/auth/sign-in-with-google`,
        userData
      );
      const { success, msg } = response.data;
      if (success) {
        logInfo(msg);
        handleMessage({ successStatus: true, msg: msg });
      }
    } catch (error) {
      LogError("Error sending Google data to server:", error);
    }
  };

  const getPlatform = () => {
    if (Platform.OS === "ios") {
      return "iOS";
    } else if (Platform.OS === "android") {
      return "Android";
    } else {
      return "Web";
    }
  };

  useEffect(() => {
    // Check if the fetch operation has returned data and process it
    if (data) {
      const { success, msg } = data;
      if (success) {
        handleMessage({ successStatus: true, msg });
      } else {
        handleMessage({ successStatus: false, msg });
      }
    }
  }, [data]);

  const handleLogin = async (values, setSubmitting) => {
    setMsg("");
    setSuccessStatus("");

    cancelFetch();

    const credentials = {
      email: values.email,
      password: values.password
    };

    try {
      await performFetch({
        method: "POST",
        body: JSON.stringify({ user: credentials }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      handleMessage({
        successStatus: false,
        msg: error.message || "Error occurred"
      });
    } finally {
      setSubmitting(false);
    }
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
                setSubmitting(false);
              } else {
                setSubmitting(true);
                handleLogin(
                  { email: values.email, password: values.password },
                  setSubmitting
                );
              }
            }}
            testID="login-form-formik"
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting
            }) => (
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
                {!isSubmitting && (
                  <StyledButton
                    testID="login-styled-button"
                    onPress={handleSubmit}
                  >
                    <ButtonText testID="login-button-text">Login</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
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
