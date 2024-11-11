import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../../reducers/rootReducer";
import useHabitCategories from "../../../hooks/api/useHabitCategories";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mockear las dependencias
jest.mock("axios");
jest.mock("@react-native-async-storage/async-storage");

describe("useHabitCategories Hook", () => {
  let store;

  const storedCredentials = {
    name: "John Doe",
    email: "johndoe@example.com"
  };

  const dataResponseWithCategories = {
    success: true,
    categories: [
      { id: "1", name: "Fitness" },
      { id: "2", name: "Wellness" }
    ]
  };

  const dataResponseWithoutCategories = {
    success: true,
    categories: []
  };

  beforeEach(() => {
    store = createStore(rootReducer, {
      habitCategoryIndex: { habitCategoryIndex: 0 }
    });

    // Mock de la implementación de axios para las respuestas por defecto
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseWithCategories
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should store categories in AsyncStorage when categories are found", async () => {
    const { result } = renderHook(() => useHabitCategories(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchHabitCategories();
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "habitCategories",
        JSON.stringify(dataResponseWithCategories.categories)
      );
    });
  });
});
