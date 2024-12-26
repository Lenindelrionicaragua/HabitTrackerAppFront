import React, { useState, useEffect } from "react";
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
import useHabitCategories from "../../hooks/api/useHabitCategories";

const HabitCategoryList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );

  const {
    updateCategoryName,
    isLoading: isUpdatingName,
    error: nameError,
    successMessage: nameSuccess
  } = useUpdateCategoryName();

  const {
    updateCategoryDailyGoal,
    isLoading: isUpdatingDailyGoal,
    error: dailyGoalError,
    successMessage: dailyGoalSuccess
  } = useUpdateCategoryDailyGoal();

  const {
    fetchHabitCategories,
    isLoading: isUpdatingHabitCategory,
    error: habitCategoryError,
    message: habitCategoriesSuccess
  } = useHabitCategories();

  // Synchronize messages with hook states
  useEffect(() => {
    if (nameError || dailyGoalError) {
      setErrorMessage(nameError || dailyGoalError);
    }
    if (nameSuccess || dailyGoalSuccess) {
      setSuccessMessage(nameSuccess || dailyGoalSuccess);
    }
  }, [nameError, dailyGoalError, nameSuccess, dailyGoalSuccess]);

  // Clear messages after 2 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer); // Cleanup
    }
  }, [successMessage, errorMessage]);

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
        }

        // Update dailyGoal if changed
        if (newDailyGoal !== undefined && newDailyGoal !== currentDailyGoal) {
          await updateCategoryDailyGoal(id, newDailyGoal);
        }

        // Update local UI
        setSelectedItem(prev => ({
          ...prev,
          name: newName || currentName,
          dailyGoal:
            newDailyGoal !== undefined ? newDailyGoal : currentDailyGoal
        }));
        // Fetch updated categories from the server
        fetchHabitCategories();
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

      {/* Loading and Messages */}
      {(isUpdatingName || isUpdatingDailyGoal) && (
        <CardGoal>Updating...</CardGoal>
      )}
      {(successMessage || errorMessage) && (
        <MessageWrapper>
          <MessageContainer isError={!!errorMessage}>
            {errorMessage || successMessage}
          </MessageContainer>
        </MessageWrapper>
      )}
    </ListContainer>
  );
};

export default HabitCategoryList;
