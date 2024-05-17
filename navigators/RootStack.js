import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../styles/AppStyles";

// Screens
import LoginScreen from "./../screens/LoginScreen/LoginScreen";
import SignupScreen from "./../screens/SignupScreen/SignupScreen";
import WelcomeScreen from "./../screens/WelcomeScreen/WelcomeScreen";

const { white, orange, grey, yellow, lightGrey, black } = Colors;
const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyled: {
            backgroundColor: "transparent",
          },
          headerTintColor: lightGrey,
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
        }}
        initialRouteName="Login"
      >
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
          name="WelcomeScreen"
          component={WelcomeScreen}
          testID="welcome-screen"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
