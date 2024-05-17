import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Keyboard,
  Platform,
} from "react-native";

const KeyboardAvoider = ({ children }) => {
  const shouldRenderKeyboardAvoider = Platform.OS !== "web";

  return shouldRenderKeyboardAvoider ? (
    <KeyboardAvoidingView
      style={styles.keyboardAvoider}
      behavior={Platform.OS === "ios" ? "padding" : null}
      enabled={Platform.OS !== "android"}
      testID="keyboard-avoiding-view"
    >
      <ScrollView testID="scroll-view">
        <Pressable onPress={Keyboard.dismiss} testID="pressable">
          {children}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <>{children}</>
  );
};

const styles = {
  keyboardAvoider: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
};

export default KeyboardAvoider;
