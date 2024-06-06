import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../styles/AppStyles";

// Screens
import LoginScreen from "./../screens/LoginScreen/LoginScreen";
import SignupScreen from "./../screens/SignupScreen/SignupScreen";
import WelcomeScreen from "./../screens/WelcomeScreen/WelcomeScreen";
import LinkVerification from "./../screens/LinkVerification/LinkVerification";

// credentials context
import { CredentialsContext } from "../context/credentialsContext";
import Verification from "./../screens/LinkVerification/LinkVerification";

const { white, orange, grey, yellow, lightGrey, black } = Colors;
const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyled: {
                backgroundColor: "transparent"
              },
              headerTintColor: lightGrey,
              headerTransparent: true,
              headerTitle: "",
              headerLeftContainerStyle: {
                paddingLeft: 20
              }
            }}
            initialRouteName="LoginScreen"
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
                  name="LinkVerification"
                  component={LinkVerification}
                  testID="link-verification"
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </CredentialsContext.Consumer>
  );
};

export default RootStack;
