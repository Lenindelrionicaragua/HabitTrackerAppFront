import React, { useState } from "react";
import { FlatList, Pressable } from "react-native";
import {
  ListContainer,
  ListCard,
  CardTitle,
  CardGoal,
  MessageWrapper,
  MessageContainer
} from "../../component/HabitCategoryList/HabitCategoryListStyles";
import { useSelector } from "react-redux";
import EditGoalsModal from "../EditGoalsModal/EditGoalsModal";
import useUpdateCategoryName from "../../hooks/api/useUpdateCategoryName";
import useUpdateCategoryDailyGoal from "../../hooks/api/useUpdateCategoryDailyGoal";
import { logInfo, logError } from "../../util/logging";

const HabitCategoryList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );

  const {
    updateCategoryName,
    isLoading: isUpdatingName,
    error: nameError
  } = useUpdateCategoryName();

  const {
    updateCategoryDailyGoal,
    isLoading: isUpdatingDailyGoal,
    error: dailyGoalError
  } = useUpdateCategoryDailyGoal();

  const handleSaveGoals = async updatedGoals => {
    if (selectedItem) {
      const {
        id,
        name: currentName,
        dailyGoal: currentDailyGoal
      } = selectedItem;
      const { name: newName, dailyGoal: newDailyGoal } = updatedGoals;

      try {
        // Update name if changed
        if (newName && newName !== currentName) {
          await updateCategoryName(id, newName);
          logInfo(`Category name updated to: ${newName}`);
        }

        // Update dailyGoal if changed
        if (newDailyGoal !== undefined && newDailyGoal !== currentDailyGoal) {
          await updateCategoryDailyGoal(id, newDailyGoal);
          logInfo(`Category daily goal updated to: ${newDailyGoal}`);
        }

        // Update local UI
        setSelectedItem(prev => ({
          ...prev,
          name: newName || currentName,
          dailyGoal:
            newDailyGoal !== undefined ? newDailyGoal : currentDailyGoal
        }));
      } catch (err) {
        logError("Error while saving category updates", err);
      } finally {
        setModalVisible(false);
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <ListContainer>
      <FlatList
        data={habitCategories}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
          >
            <ListCard>
              <CardTitle>{item.name}</CardTitle>
              <CardGoal>Daily Goal: {item.dailyGoal || "Not Set"}</CardGoal>
            </ListCard>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {selectedItem && (
        <EditGoalsModal
          isVisible={modalVisible}
          onClose={handleCloseModal}
          currentName={selectedItem.name}
          currentGoal={selectedItem.dailyGoal}
          onSave={handleSaveGoals}
        />
      )}

      {/* Loading and Error States */}
      {(isUpdatingName || isUpdatingDailyGoal) && (
        <CardGoal>Updating...</CardGoal>
      )}
      {(nameError || dailyGoalError) && (
        <MessageWrapper>
          <MessageContainer isError={!!nameError}>
            {nameError || dailyGoalError}
          </MessageContainer>
        </MessageWrapper>
      )}
    </ListContainer>
  );
};

export default HabitCategoryList;
