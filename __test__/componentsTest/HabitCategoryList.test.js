import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import HabitCategoryList from "../../component/HabitCategoryList/HabitCategoryList";

describe("HabitCategoryList Component", () => {
  let store;

  // Helper function to render the component with a specific state
  const renderComponentWithState = state => {
    store = createStore(rootReducer, state);
    return render(
      <Provider store={store}>
        <HabitCategoryList />
      </Provider>
    );
  };

  it("renders correctly with categories from the Redux store", () => {
    const initialState = {
      habitCategories: {
        habitCategories: [
          { id: "674dbad93b1c8db22d452d55", name: "Work", dailyGoal: 55 },
          {
            id: "674dbad93b1c8db22d452d58",
            name: "Family time",
            dailyGoal: 45
          },
          { id: "674dbad93b1c8db22d452d5b", name: "Exercise", dailyGoal: 35 },
          {
            id: "674dbad93b1c8db22d452d5e",
            name: "Screen-free",
            dailyGoal: 25
          },
          { id: "674dbad93b1c8db22d452d61", name: "Rest", dailyGoal: 15 },
          { id: "674dbad93b1c8db22d452d64", name: "Study", dailyGoal: 5 }
        ]
      }
    };

    const { getByText } = renderComponentWithState(initialState);

    // Check for each category name and corresponding daily goal
    ["Work", "Family time", "Exercise", "Screen-free", "Rest", "Study"].forEach(
      categoryName => {
        expect(getByText(categoryName)).toBeTruthy();
        expect(
          getByText(`Daily Goal: ${categoryName === "Study" ? 5 : 15}`)
        ).toBeTruthy();
      }
    );
  });

  it("renders 'Not Set' for categories without a goal", () => {
    const initialState = {
      habitCategories: {
        habitCategories: [{ id: 1, name: "Fitness", dailyGoal: undefined }]
      }
    };
    const { getByText } = renderComponentWithState(initialState);

    expect(getByText("Fitness")).toBeTruthy();
    expect(getByText("Daily Goal: Not Set")).toBeTruthy();
  });

  it("renders an empty list when there are no categories", () => {
    const initialState = {
      habitCategories: {
        habitCategories: []
      }
    };
    const { queryByText } = renderComponentWithState(initialState);

    // Ensure there are no category names rendered
    expect(queryByText("Daily Goal")).toBeNull();
  });
});
