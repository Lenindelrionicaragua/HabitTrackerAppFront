import React, { useRef } from "react";
import { Animated, Easing, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyledSyncButtonContainer } from "../../screens/WelcomeScreen/WelcomeScreenStyles";

const SyncButton = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  const startSyncAnimation = () => {
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
    <StyledSyncButtonContainer>
      <Pressable onPress={startSyncAnimation}>
        <Animated.View style={animatedStyle}>
          <Ionicons name="sync" size={24} color="black" />
        </Animated.View>
      </Pressable>
    </StyledSyncButtonContainer>
  );
};

export default SyncButton;
