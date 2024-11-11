import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../../reducers/rootReducer";
import useHabitCategories from "../../../hooks/api/useHabitCategories";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setHabitCategories } from "../../../actions/counterActions";

// Mockear las dependencias
jest.mock("axios");
jest.mock("@react-native-async-storage/async-storage");

describe("useHabitCategories Hook", () => {
  let store;
  let dispatchMock;

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

  const categoriesWithIdAndName = dataResponseWithCategories.categories;

  const dataResponseWithoutCategories = {
    success: true,
    categories: []
  };

  beforeEach(() => {
    dispatchMock = jest.fn();
    store = createStore(rootReducer, {
      habitCategoryIndex: { habitCategoryIndex: 0 }
    });

    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(dispatchMock);

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
        JSON.stringify(categoriesWithIdAndName)
      );
    });

    expect(dispatchMock).toHaveBeenCalledWith(
      setHabitCategories(categoriesWithIdAndName)
    );
  });
});
