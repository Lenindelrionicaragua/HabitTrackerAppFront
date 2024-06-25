import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../styles/AppStyles";

// Screens
import LoginScreen from "./../screens/LoginScreen/LoginScreen";
import SignupScreen from "./../screens/SignupScreen/SignupScreen";
import WelcomeScreen from "./../screens/WelcomeScreen/WelcomeScreen";
import LinkVerificationScreen from "../screens/LinkVerificationScreen/LinkVerificationScreen";
import StopwatchScreen from "../screens/StopwatchScreen/StopwatchScreen";

// credentials context
import { CredentialsContext } from "../context/credentialsContext";

const { grey, lightGrey, black, orange, white } = Colors;
const Stack = createNativeStackNavigator();

const RootStack = () => {
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
                  component={StopwatchScreen}
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
                <Stack.Screen
                  name="WelcomeScreen"
                  component={WelcomeScreen}
                  testID="welcome-screen"
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

const Banner = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.banner}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={styles.buttonText}>STATS</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("StopwatchScreen")}
      >
        <Text style={styles.buttonText}>TIMER</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("WelcomeScreen")}
      >
        <Text style={styles.buttonText}>SETTINGS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  banner: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: black,
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: orange,
    borderRadius: 5
  },
  buttonText: {
    color: white,
    fontSize: 16
  }
});

export default RootStack;
