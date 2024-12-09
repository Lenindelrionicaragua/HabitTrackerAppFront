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
        categories: [
          { id: 1, name: "Fitness", goal: "30 minutes" },
          { id: 2, name: "Reading", goal: "10 pages" },
          { id: 3, name: "Meditation", goal: "10 minutes" }
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

    expect(getByText("Fitness")).toBeTruthy();
    expect(getByText("Daily Goal: 30 minutes")).toBeTruthy();
    expect(getByText("Reading")).toBeTruthy();
    expect(getByText("Daily Goal: 10 pages")).toBeTruthy();
    expect(getByText("Meditation")).toBeTruthy();
    expect(getByText("Daily Goal: 10 minutes")).toBeTruthy();
  });

  it("renders 'Not Set' for categories without a goal", () => {
    const initialState = {
      habitCategories: {
        categories: [{ id: 1, name: "Fitness" }]
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
        categories: []
      }
    };
    store = createStore(rootReducer, initialState);

    const { queryByText } = render(
      <Provider store={store}>
        <HabitCategoryList />
      </Provider>
    );

    // Asegura que no haya categorías en la lista
    expect(queryByText("Daily Goal")).toBeNull();
  });
});
