import React, { useState } from "react";
import { FlatList, Pressable } from "react-native";
import {
  ListContainer,
  ListCard,
  CardTitle,
  CardGoal
} from "../../component/HabitCategoryList/HabitCategoryListStyles";
import { useSelector } from "react-redux";
import EditGoalsModal from "../EditGoalsModal/EditGoalsModal";
import useSaveCategoryUpdates from "../../hooks/api/useSaveCategoryUpdates";
import { logInfo, logError } from "../../util/logging";

const HabitCategoryList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );

  const { saveCategoryUpdates } = useSaveCategoryUpdates();

  const handleSaveGoals = async updatedGoals => {
    if (selectedItem) {
      const {
        id,
        name: currentName,
        dailyGoal: currentDailyGoal
      } = selectedItem;
      const { name: newName, dailyGoal: newDailyGoal } = updatedGoals;

      try {
        const encodedName = encodeURIComponent(newName || currentName);
        const url = `${baseApiUrl}/habit-categories/${id}/name/${encodedName}`;

        await saveCategoryUpdates({
          id,
          newName: newName !== currentName ? newName : null,
          newDailyGoal:
            newDailyGoal !== currentDailyGoal ? newDailyGoal : undefined,
          url
        });

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
    </ListContainer>
  );
};

export default HabitCategoryList;
