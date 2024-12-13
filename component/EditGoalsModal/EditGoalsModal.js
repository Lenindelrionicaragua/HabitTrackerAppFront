import React, { useState } from "react";
import { Modal } from "react-native";
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

  const handleSave = () => {
    onSave({ name, dailyGoal });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ModalBackground>
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
            <TriggerButton>
              <TriggerButtonText onPress={onClose}>Cancel</TriggerButtonText>
            </TriggerButton>
            <TriggerButton>
              <TriggerButtonText onPress={handleSave}>Save</TriggerButtonText>
            </TriggerButton>
          </ButtonRow>
        </ModalContent>
      </ModalBackground>
    </Modal>
  );
};

export default EditGoalsModal;
