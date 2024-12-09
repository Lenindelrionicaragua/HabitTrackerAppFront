import React from "react";
import { FlatList } from "react-native";
import {
  ListContainer,
  ListCard,
  CardTitle,
  CardGoal
} from "../../component/HabitCategoryList/HabitCategoryListStyles";
import { useSelector } from "react-redux";

const HabitCategoryList = () => {
  const habitCategories = useSelector(
    state => state.habitCategories.categories
  );

  return (
    <ListContainer>
      <FlatList
        data={habitCategories}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ListCard>
            <CardTitle>{item.name}</CardTitle>
            <CardGoal>Daily Goal: {item.goal || "Not Set"}</CardGoal>
          </ListCard>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ListContainer>
  );
};

export default HabitCategoryList;
