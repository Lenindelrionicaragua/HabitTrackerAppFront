import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../styles/AppStyles";
import { Platform } from "react-native";

// Screens
import LoginScreen from "./../screens/LoginScreen/LoginScreen";
import SignupScreen from "./../screens/SignupScreen/SignupScreen";
import WelcomeScreen from "./../screens/WelcomeScreen/WelcomeScreen";
import LinkVerificationScreen from "../screens/LinkVerificationScreen/LinkVerificationScreen";

// android version is not using expo-av (alarm)
import StopwatchScreen from "../screens/StopwatchScreen/StopwatchScreen";
import StopwatchScreenAndroid from "../screens/StopwatchScreen/StopwatchScreenAndroid";

import Banner from "../component/Banner/Banner";

// credentials context
import { CredentialsContext } from "../context/credentialsContext";

const { grey, lightGrey, black } = Colors;
const Stack = createNativeStackNavigator();

const RootStack = () => {
  const StopwatchScreenComponent =
    Platform.OS === "web" ? StopwatchScreenIOS : StopwatchScreenAndroid;

  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "transparent"
              },
              headerTintColor: lightGrey,
              headerTransparent: true,
              headerTitle: "",
              headerLeftContainerStyle: {
                paddingLeft: 20
              }
            }}
            initialRouteName="StopwatchScreen"
          >
            {storedCredentials ? (
              <Stack.Screen
                name="WelcomeScreen"
                component={WelcomeScreen}
                testID="welcome-screen"
              />
            ) : (
              <>
                <Stack.Screen
                  name="StopwatchScreen"
                  component={StopwatchScreenComponent}
                  testID="stopwatch-screen"
                />
                <Stack.Screen
                  name="LoginScreen"
                  component={LoginScreen}
                  testID="login-screen"
                />
                <Stack.Screen
                  options={{ headerTintColor: grey }}
                  name="SignupScreen"
                  component={SignupScreen}
                  testID="signup-screen"
                />
                <Stack.Screen
                  name="LinkVerificationScreen"
                  component={LinkVerificationScreen}
                  testID="link-verification"
                />
              </>
            )}
          </Stack.Navigator>
          <Banner />
        </NavigationContainer>
      )}
    </CredentialsContext.Consumer>
  );
};

export default RootStack;
