import React, { useState, useEffect, useRef } from "react";
import { Modal, Animated } from "react-native";
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
  onSaveName,
  onSaveDailyGoal
}) => {
  const [name, setName] = useState(currentName || "");
  const [dailyGoal, setDailyGoal] = useState(currentGoal || "");
  const [alerts, setAlerts] = useState({ name: "", dailyGoal: "" });

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

  const validateName = value => {
    if (!value || typeof value !== "string") {
      return "Category name is required.";
    }
    if (!/^[a-zA-Z0-9\s\-\!]{1,15}$/.test(value)) {
      return "Category name must contain only letters, numbers, spaces, hyphens, or exclamation marks, and have a maximum length of 15 characters.";
    }
    return "";
  };

  const validateDailyGoal = value => {
    if (value !== undefined) {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        return "Daily goal must be an integer.";
      }
      if (parsedValue < 15) {
        return "Daily goal must be at least 15 minutes.";
      }
      if (parsedValue > 1440) {
        return "Daily goal cannot exceed 1440 minutes (24 hours).";
      }
    }
    return "";
  };

  const handleNameChange = value => {
    setName(value);
    const nameAlert = validateName(value);
    setAlerts(prev => ({ ...prev, name: nameAlert }));
  };

  const handleDailyGoalChange = value => {
    setDailyGoal(value);
    const goalAlert = validateDailyGoal(value);
    setAlerts(prev => ({ ...prev, dailyGoal: goalAlert }));
  };

  const handleSave = () => {
    const nameAlert = validateName(name);
    const goalAlert = validateDailyGoal(dailyGoal);

    if (nameAlert || goalAlert) {
      setAlerts({ name: nameAlert, dailyGoal: goalAlert });
      return;
    }

    // Call the appropriate save functions based on changes
    if (name !== currentName) {
      onSaveName(name);
    }

    if (dailyGoal !== currentGoal) {
      onSaveDailyGoal(parseInt(dailyGoal, 10));
    }

    onClose();
  };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <ModalBackground style={{ opacity: fadeAnim }}>
        <ModalContent>
          <Title>Edit Habits</Title>

          {/* Input for Name */}
          <Input
            placeholder="Name"
            value={name}
            onChangeText={handleNameChange}
          />
          {alerts.name && <ErrorText>{alerts.name}</ErrorText>}

          {/* Input for Daily Goal */}
          <Input
            placeholder="Daily Goal (mins)"
            keyboardType="numeric"
            value={dailyGoal}
            onChangeText={handleDailyGoalChange}
          />
          {alerts.dailyGoal && <ErrorText>{alerts.dailyGoal}</ErrorText>}

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
      </ModalBackground>
    </Modal>
  );
};

export default EditGoalsModal;
