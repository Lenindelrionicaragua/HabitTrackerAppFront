import React, { useState, useEffect, useRef } from "react";
import { Modal, Animated } from "react-native";
import {
  ModalBackground,
  ModalContent,
  Title,
  Input,
  ButtonRow,
  TriggerButton,
  TriggerButtonText
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

  // Animated value for background opacity
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
    onSave({ name, dailyGoal });
    onClose();
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
