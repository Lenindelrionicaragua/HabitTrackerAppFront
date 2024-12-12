import React, { useState } from "react";
import { Modal, Button } from "react-native";
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
          <Title>Edit Goals</Title>

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
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={handleSave} />
          </ButtonRow>
        </ModalContent>
      </ModalBackground>
    </Modal>
  );
};

export default EditGoalsModal;
