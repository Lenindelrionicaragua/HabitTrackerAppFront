import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../styles/AppStyles";
import LoginScreen from "./../screens/LoginScreen/LoginScreen";
import SignupScreen from "./../screens/SignupScreen/SignupScreen";
import WelcomeScreen from "./../screens/WelcomeScreen/WelcomeScreen";
import LinkVerificationScreen from "../screens/LinkVerificationScreen/LinkVerificationScreen";
import StopwatchScreen from "../screens/StopwatchScreen/StopwatchScreen";
import MetricsScreen from "../screens/MetricsScreen/MetricsScreen";
import Banner from "../component/Banner/Banner";
import useHabitCategories from "../hooks/api/useHabitCategories";
import useMonthlyStats from "../hooks/api/useMonthlyStats";
import { CredentialsContext } from "../context/credentialsContext";

const { softGray, black } = Colors;
const Stack = createNativeStackNavigator();
const linking = {
  prefixes: [
    "https://habit-tracker-app-front.netlify.app",
    "http://localhost:8081",
    "zenTimer://"
  ],
  config: {
    screens: {
      LoginScreen: "login",
      SignupScreen: "signup",
      LinkVerificationScreen: "verify",
      MetricsScreen: "metrics",
      StopwatchScreen: "stopwatch",
      WelcomeScreen: "welcome"
    }
  }
};

const RootStack = () => {
  const { storedCredentials } = useContext(CredentialsContext);
  void useHabitCategories(storedCredentials);
  void useMonthlyStats(storedCredentials);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent"
          },
          headerTintColor: softGray,
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainerStyle: {
            paddingLeft: 20
          }
        }}
        initialRouteName="LinkVerificationScreen">
        <Stack.Screen
          name="StopwatchScreen"
          component={StopwatchScreen}
          testID="stopwatch-screen"
        />
        <Stack.Screen
          name="MetricsScreen"
          component={MetricsScreen}
          options={{ headerShown: false }}
          testID="metrics-screen"
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          testID="login-screen"
        />
        <Stack.Screen
          options={{ headerTintColor: black }}
          name="SignupScreen"
          component={SignupScreen}
          testID="signup-screen"
        />
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
          testID="welcome-screen"
        />
        <Stack.Screen
          name="LinkVerificationScreen"
          component={LinkVerificationScreen}
          testID="link-verification"
        />
      </Stack.Navigator>
      <Banner storedCredentials={storedCredentials} />
    </NavigationContainer>
  );
};

export default RootStack;
