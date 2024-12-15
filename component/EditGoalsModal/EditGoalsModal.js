import React, { useState, useEffect, useRef } from "react";
import { Modal, Animated, Text } from "react-native";
import {
  ModalBackground,
  ModalContent,
  Title,
  Input,
  ButtonRow,
  TriggerButton,
  TriggerButtonText,
  ErrorText
} from "./EditGoalsModalStyles";

const EditGoalsModal = ({
  isVisible,
  onClose,
  currentName,
  currentGoal,
  onSave
}) => {
  const [name, setName] = useState(currentName || "");
  const [dailyGoal, setDailyGoal] = useState(currentGoal || "");
  const [errors, setErrors] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fully visible
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fully hidden
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [isVisible]);

  const handleSave = () => {
    const newErrors = [];

    // Name validation
    if (!name || typeof name !== "string") {
      newErrors.push("Category name is required.");
    } else if (!/^[a-zA-Z0-9\s\-\!]{1,15}$/.test(name)) {
      newErrors.push(
        "Category name must contain only letters, numbers, spaces, hyphens, or exclamation marks, and have a maximum length of 15 characters."
      );
    }

    // Daily Goal validation
    if (dailyGoal !== undefined) {
      if (typeof dailyGoal !== "number" || !Number.isInteger(dailyGoal)) {
        newErrors.push("Daily goal must be an integer.");
      } else if (dailyGoal < 15) {
        newErrors.push("Daily goal must be at least 15 minutes.");
      } else if (dailyGoal > 1440) {
        newErrors.push("Daily goal cannot exceed 1440 minutes (24 hours).");
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      // Proceed to save data
      onSave({ name, dailyGoal });
      onClose();
    }
  };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      {/* Animated Background */}
      <Animated.View
        style={{
          ...ModalBackground,
          opacity: fadeAnim // Use animated opacity
        }}
      >
        <ModalContent>
          <Title>Edit Habits</Title>

          {/* Input for Name */}
          <Input placeholder="Name" value={name} onChangeText={setName} />

          {/* Input for Daily Goal */}
          <Input
            placeholder="Daily Goal (mins)"
            keyboardType="numeric"
            value={dailyGoal}
            onChangeText={setDailyGoal}
          />

          {/* Error Messages */}
          {errors.length > 0 && <ErrorText>{errors.join("\n")}</ErrorText>}

          {/* Action Buttons */}
          <ButtonRow>
            <TriggerButton onPress={onClose}>
              <TriggerButtonText>Cancel</TriggerButtonText>
            </TriggerButton>
            <TriggerButton onPress={handleSave}>
              <TriggerButtonText>Save</TriggerButtonText>
            </TriggerButton>
          </ButtonRow>
        </ModalContent>
      </Animated.View>
    </Modal>
  );
};

export default EditGoalsModal;
