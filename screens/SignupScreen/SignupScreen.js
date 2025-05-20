import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { StatusBar, ActivityIndicator } from "react-native";
import KeyboardAvoider from "../../component/KeyboardAvoider/KeyboardAvoider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  FooterView,
  FooterText,
  FooterLink,
  FooterLinkContent
} from "./SignupScreenStyles";
import { Colors } from "../../styles/AppStyles";
import { logError, logInfo } from "../../util/logging";
import TextInputSignupScreen from "../../component/TextInputSignupScreen/TextInputSignupScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../context/credentialsContext";
import useFetch from "../../hooks/api/useFetch";

const { white, lightGreen } = Colors;

const SignupScreen = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [userBirthDay, setUserBirthDay] = useState();

  const [msg, setMsg] = useState("");
  const [success, setSuccessStatus] = useState("");

  const { setStoredCredentials } = useContext(CredentialsContext);

  const onChange = (_, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setUserBirthDay(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const onReceived = response => {
    const { success, msg, user } = response;
    if (success) {
      saveLoginCredentials(user);
      handleMessage({ successStatus: true, msg });
    } else {
      logInfo(msg);
      handleMessage({ successStatus: false, msg });
    }
  };

  const { performFetch, isLoading, error } = useFetch(
    `/auth/pre-sign-up`,
    onReceived
  );

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || "An unexpected error occurred.";
      handleMessage({
        successStatus: false,
        msg: errorMessage
      });
    }
  }, [error]);

  const handleSignup = values => {
    setMsg("");
    setSuccessStatus("");

    const credentials = {
      name: values.name,
      email: values.email,
      password: values.password,
      dateOfBirth: values.dateOfBirth
    };

    performFetch({
      method: "POST",
      data: { user: credentials }
    });
  };

  const handleMessage = ({ successStatus, msg }) => {
    setSuccessStatus(successStatus);
    setMsg(msg);
  };

  const saveLoginCredentials = user => {
    if (!user) {
      logError("User data is missing in the response");
      return;
    }
    AsyncStorage.setItem("zenTimerUser", JSON.stringify(user))
      .then(() => {
        setStoredCredentials(user);
      })
      .catch(error => {
        logError(error);
      });
  };

  return (
    <KeyboardAvoider>
      <StyledContainer testID="signup-styled-container">
        <StatusBar style="dark" />
        <InnerContainer testID="inner-container">
          <PageTitle testID="signup-page-title">Habit Tracker</PageTitle>
          <SubTitle testID="signup-page-sub-title">Account Sign Up</SubTitle>

          {show && (
            <DateTimePicker
              testID="date-time-picker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <Formik
            initialValues={{
              name: "",
              email: "",
              dateOfBirth: "",
              password: "",
              confirmPassword: ""
            }}
            onSubmit={(values, { setSubmitting }) => {
              values = { ...values, dateOfBirth: userBirthDay };
              const dateOfBirthString = values.dateOfBirth
                ? values.dateOfBirth.toDateString()
                : "";

              if (
                values.name == "" ||
                values.email == "" ||
                values.dateOfBirth == "" ||
                values.password == "" ||
                values.confirmPassword == ""
              ) {
                handleMessage({ msg: "Please fill all the fields" });
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage({ msg: "Passwords do not match" });
                setSubmitting(false);
              } else {
                setSubmitting(true);
                handleSignup(
                  {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    dateOfBirth: dateOfBirthString
                  },
                  setSubmitting
                );
              }
            }}
            testID="signup-form-formik">
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                <TextInputSignupScreen
                  label="Name"
                  icon="person"
                  placeholder="Zen User"
                  placeholderTextColor={lightGreen}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  testID="name"
                />

                <TextInputSignupScreen
                  label="Email Address"
                  icon="mail"
                  placeholder="serenity@gmail.com"
                  placeholderTextColor={lightGreen}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  testID="signup-screen-email-input"
                />

                <TextInputSignupScreen
                  label="Date of Birth"
                  icon="calendar"
                  placeholder="Tue Feb 01 1984"
                  placeholderTextColor={lightGreen}
                  onChangeText={handleChange("dateOfBirth")}
                  onBlur={handleBlur("dateOfBirth")}
                  value={userBirthDay ? userBirthDay.toDateString() : ""}
                  testID="date-of-birth"
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
                />

                <TextInputSignupScreen
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * *"
                  placeholderTextColor={lightGreen}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  testID="signup-screen-password-input"
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />

                <TextInputSignupScreen
                  label="Confirm Password"
                  icon="lock"
                  placeholder="* * * * * * *"
                  placeholderTextColor={lightGreen}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  testID="confirm-password-input"
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={success ? "SUCCESS" : "ERROR"} testID="msg-box">
                  {msg}
                </MsgBox>

                {!isLoading && (
                  <StyledButton
                    testID="signup-styled-button"
                    onPress={handleSubmit}>
                    <ButtonText testID="signup-button-text">Sign Up</ButtonText>
                  </StyledButton>
                )}

                {isLoading && (
                  <StyledButton disabled={true} testID="signup-styled-button">
                    <ActivityIndicator size="large" color={white} />
                  </StyledButton>
                )}

                <Line testID="line" />
                <FooterView testID="footer-view">
                  <FooterText testID="signup-footer-text">
                    Already have an account?
                  </FooterText>
                  <FooterLink
                    onPress={() => navigation.navigate("LoginScreen")}
                    testID="footer-login-link">
                    <FooterLinkContent testID="footer-login-link-content">
                      Login
                    </FooterLinkContent>
                  </FooterLink>
                </FooterView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoider>
  );
};

SignupScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default SignupScreen;
