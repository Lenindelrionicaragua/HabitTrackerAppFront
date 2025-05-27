import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../../reducers/rootReducer";
import useHabitCategories from "../../../hooks/api/useHabitCategories";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setHabitCategories } from "../../../actions/counterActions";
import useCreateDefaultCategories from "../../../hooks/api/useCreateDefaultCategories";

// Mocks globales
jest.mock("axios");
jest.mock("@react-native-async-storage/async-storage");
jest.mock("../../../hooks/api/useCreateDefaultCategories");

describe("useHabitCategories Hook", () => {
  let store;
  let dispatchMock;
  let createCategoriesMock;

  const storedCredentials = {
    name: "John Doe",
    email: "johndoe@example.com"
  };

  const dataResponseWithCategories = {
    success: true,
    categories: [
      { id: "1", name: "Fitness", dailyGoal: 55 },
      { id: "2", name: "Wellness", dailyGoal: 55 }
    ]
  };

  const categoriesWithIdAndName = dataResponseWithCategories.categories;

  const dataResponseWithoutCategories = {
    success: true,
    categories: []
  };

  beforeEach(() => {
    // Limpiar mocks y estados compartidos
    jest.resetAllMocks();

    dispatchMock = jest.fn();
    createCategoriesMock = jest.fn().mockResolvedValue();

    store = createStore(rootReducer, {
      habitCategoryIndex: { habitCategoryIndex: 0 }
    });

    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(dispatchMock);

    useCreateDefaultCategories.mockReturnValue({
      createCategories: createCategoriesMock
    });

    AsyncStorage.setItem.mockResolvedValue(undefined);
  });

  it("should store categories in AsyncStorage when categories are found", async () => {
    axios.mockResolvedValueOnce({
      data: dataResponseWithCategories
    });

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

  it("should call createCategories when categories are not found", async () => {
    axios.mockResolvedValueOnce({
      data: dataResponseWithoutCategories
    });

    const { result } = renderHook(() => useHabitCategories(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchHabitCategories();
    });

    expect(createCategoriesMock).toHaveBeenCalled();
  });

  it("should log an error when storing categories in AsyncStorage fails", async () => {
    axios.mockResolvedValueOnce({
      data: dataResponseWithCategories
    });

    AsyncStorage.setItem.mockImplementationOnce(() => {
      throw new Error("Failed to save");
    });

    const logSpy = jest.spyOn(require("../../../util/logging"), "logInfo");

    const { result } = renderHook(() => useHabitCategories(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchHabitCategories();
    });

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith(
        "Error saving categories to AsyncStorage:",
        expect.any(Error)
      );
    });

    logSpy.mockRestore();
  });
});
