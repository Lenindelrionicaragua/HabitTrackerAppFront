import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import HabitCategoryList from "../../component/HabitCategoryList/HabitCategoryList";

describe("HabitCategoryList Component", () => {
  let store;

  beforeEach(() => {
    const initialState = {
      habitCategories: {
        habitCategories: [
          {
            id: "674dbad93b1c8db22d452d55",
            name: "Work",
            dailyGoal: 55
          },
          {
            id: "674dbad93b1c8db22d452d58",
            name: "Family time",
            dailyGoal: 45
          },
          {
            id: "674dbad93b1c8db22d452d5b",
            name: "Exercise",
            dailyGoal: 35
          },
          {
            id: "674dbad93b1c8db22d452d5e",
            name: "Screen-free",
            dailyGoal: 25
          },
          {
            id: "674dbad93b1c8db22d452d61",
            name: "Rest",
            dailyGoal: 15
          },
          {
            id: "674dbad93b1c8db22d452d64",
            name: "Study",
            dailyGoal: 5
          }
        ]
      }
    };
    store = createStore(rootReducer, initialState);
  });

  it("renders correctly with categories from the Redux store", () => {
    const { getByText } = render(
      <Provider store={store}>
        <HabitCategoryList />
      </Provider>
    );

    expect(getByText("Work")).toBeTruthy();
    expect(getByText("Daily Goal: 55")).toBeTruthy();
    expect(getByText("Family time")).toBeTruthy();
    expect(getByText("Daily Goal: 45")).toBeTruthy();
    expect(getByText("Exercise")).toBeTruthy();
    expect(getByText("Daily Goal: 35")).toBeTruthy();
    expect(getByText("Screen-free")).toBeTruthy();
    expect(getByText("Daily Goal: 25")).toBeTruthy();
    expect(getByText("Rest")).toBeTruthy();
    expect(getByText("Daily Goal: 15")).toBeTruthy();
    expect(getByText("Study")).toBeTruthy();
    expect(getByText("Daily Goal: 5")).toBeTruthy();
  });

  it("renders 'Not Set' for categories without a goal", () => {
    const initialState = {
      habitCategories: {
        habitCategories: [{ id: 1, name: "Fitness" }]
      }
    };
    store = createStore(rootReducer, initialState);

    const { getByText } = render(
      <Provider store={store}>
        <HabitCategoryList />
      </Provider>
    );

    expect(getByText("Fitness")).toBeTruthy();
    expect(getByText("Daily Goal: Not Set")).toBeTruthy();
  });

  it("renders an empty list when there are no categories", () => {
    const initialState = {
      habitCategories: {
        habitCategories: []
      }
    };
    store = createStore(rootReducer, initialState);

    const { queryByText } = render(
      <Provider store={store}>
        <HabitCategoryList />
      </Provider>
    );

    expect(queryByText("Daily Goal")).toBeNull();
  });
});
