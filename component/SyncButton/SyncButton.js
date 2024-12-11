import React, { useRef } from "react";
import { Animated, Easing, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyledSyncButtonContainer,
  StyledSyncRowContainer,
  ButtonSyncText
} from "../../screens/WelcomeScreen/WelcomeScreenStyles";
import { Colors } from "../../styles/AppStyles";
import { logInfo } from "../../util/logging";

const { darkGrey } = Colors;

const SyncButton = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  const syncApp = () => {
    logInfo("Sync button called");
  };

  const startSyncAnimation = () => {
    syncApp();

    Animated.sequence([
      Animated.timing(rotation, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.timing(rotation, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ]).start();
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"]
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }]
  };

  return (
    <Pressable onPress={startSyncAnimation} testID="sync-button-pressable">
      <StyledSyncRowContainer testID="sync-button-container">
        <StyledSyncButtonContainer>
          <Animated.View style={animatedStyle}>
            <Ionicons
              name="sync"
              size={28}
              color={darkGrey}
              testID="sync-icon"
            />
          </Animated.View>
        </StyledSyncButtonContainer>
        <ButtonSyncText>Synchronize</ButtonSyncText>
      </StyledSyncRowContainer>
    </Pressable>
  );
};

export default SyncButton;
