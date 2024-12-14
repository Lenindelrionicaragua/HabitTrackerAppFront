import React, { useState } from "react";
import { FlatList, Pressable } from "react-native";
import {
  ListContainer,
  ListCard,
  CardTitle,
  CardGoal
} from "../../component/HabitCategoryList/HabitCategoryListStyles";
import { useSelector, useDispatch } from "react-redux";
import EditGoalsModal from "../EditGoalsModal/EditGoalsModal";
import useFetch from "../../hooks/api/useFetch";
import { logInfo, logError } from "../../util/logging";

const HabitCategoryList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );

  const { performFetch, isLoading, error } = useFetch(
    "",
    async responseData => {
      if (responseData.success) {
        setModalVisible(false);
        setSelectedItem(null);
      } else {
        logError(responseData.message || "Failed to update daily goal");
      }
    }
  );

  const handleSaveGoals = async updatedGoals => {
    if (selectedItem) {
      try {
        await performFetch(
          {
            method: "PATCH",
            data: { dailyGoal: updatedGoals.dailyGoal }
          },
          `/habit-categories/${selectedItem.id}/update-daily-goal`
        );
        setSelectedItem(prevItem => ({
          ...prevItem,
          dailyGoal: updatedGoals.dailyGoal
        }));
      } catch (err) {
        logError("Error updating goal:", err);
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
          isLoading={isLoading}
        />
      )}

      {error && logError("API Error:", error.message)}
    </ListContainer>
  );
};

export default HabitCategoryList;
