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

const HabitCategoryList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );

  const handleSaveGoals = updatedGoals => {
    // Update the specific item in the habitCategories list (assuming state is handled globally)
    // You can also implement this update logic in Redux if the data is stored in a global store.
    if (selectedItem) {
      selectedItem.name = updatedGoals.name;
      selectedItem.dailyGoal = updatedGoals.dailyGoal;
    }
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null); // Clear the selected item when closing
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

      {/* EditGoalsModal */}
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
