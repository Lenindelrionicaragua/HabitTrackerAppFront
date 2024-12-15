import React, { useState } from "react";
import { FlatList, Pressable } from "react-native";
import {
  ListContainer,
  ListCard,
  CardTitle,
  Title,
  CardGoal
} from "../../component/HabitCategoryList/HabitCategoryListStyles";
import { useSelector } from "react-redux";
import EditGoalsModal from "../EditGoalsModal/EditGoalsModal";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseApiUrl } from "../../component/Shared/SharedUrl";
import { logInfo, logError } from "../../util/logging";

const HabitCategoryList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );

  const handleSaveGoals = async updatedGoals => {
    if (selectedItem) {
      const url = `${baseApiUrl}/habit-categories/${selectedItem.id}/update-daily-goal`;

      try {
        const token = await AsyncStorage.getItem("zenTimerToken");
        if (!token) {
          throw new Error("No token found for authentication.");
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        };

        const response = await axios.patch(
          url,
          { dailyGoal: updatedGoals.dailyGoal },
          { headers }
        );

        logInfo(`Goal updated successfully: ${JSON.stringify(response.data)}`);
        // Update the UI locally
        setSelectedItem(prevItem => ({
          ...prevItem,
          dailyGoal: updatedGoals.dailyGoal
        }));

        setModalVisible(false);
        setSelectedItem(null);
      } catch (error) {
        logError("Failed to update daily goal:", error);
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
