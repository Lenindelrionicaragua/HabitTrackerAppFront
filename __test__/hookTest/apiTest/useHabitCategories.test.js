import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react"; // Cambiar importación aquí
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useHabitCategories from "../../../hooks/api/useHabitCategories";
import useCreateDefaultCategories from "../../../hooks/api/useCreateDefaultCategories";
import { setHabitCategories } from "../../../actions/counterActions";
import { logInfo } from "../../../util/logging";
import useFetch from "../../../hooks/api/useFetch";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// Mock de Axios
jest.mock("axios");

// Mock de AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue() // Simula una resolución exitosa
}));

// Mock de useDispatch
const dispatchMock = jest.fn();
jest.spyOn(require("react-redux"), "useDispatch").mockReturnValue(dispatchMock);

// Mock de useFetch
jest.mock("../../../hooks/api/useFetch");

jest.mock("../../../hooks/api/useCreateDefaultCategories");
jest.mock("../../../util/logging");

const mockStore = configureStore(); // Crear el store mockeado

describe("useHabitCategories Hook", () => {
  let dispatchMock;
  let performFetchMock;
  let cancelFetchMock;
  let createCategoriesMock;
  let store;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    createCategoriesMock = jest.fn().mockResolvedValue();
    useCreateDefaultCategories.mockReturnValue(createCategoriesMock);

    // Simulamos el comportamiento de useFetch
    performFetchMock = jest.fn().mockResolvedValue(); // Simulamos la promesa resuelta
    cancelFetchMock = jest.fn();
    useFetch.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      performFetch: performFetchMock,
      cancelFetch: cancelFetchMock
    });

    // Inicializamos el store mockeado
    store = mockStore({
      habitCategoryIndex: {
        habitCategoryIndex: 0
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and store categories when the hook is initialized", async () => {
    const mockData = {
      success: true,
      categories: [
        { id: "1", name: "Fitness" },
        { id: "2", name: "Wellness" }
      ]
    };

    // Mock de useFetch para simular la respuesta del servidor
    useFetch.mockReturnValueOnce({
      data: mockData,
      error: null,
      isLoading: false,
      performFetch: jest.fn(),
      cancelFetch: jest.fn()
    });

    // Renderizar el hook con credenciales dentro del Provider
    const credentials = { name: "John Doe", email: "johndoe@example.com" };

    const { result } = renderHook(() => useHabitCategories(credentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider> // Envolvemos el hook con el Provider
    });

    // Actuar para llamar a performFetch
    await act(async () => {
      await result.current.fetchHabitCategories();
    });

    // Verificar que AsyncStorage.setItem haya sido llamado correctamente
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "habitCategories",
        JSON.stringify(mockData.categories)
      );
    });

    // Verificar que se haya llamado a dispatch con las categorías
    expect(dispatchMock).toHaveBeenCalledWith(
      setHabitCategories(mockData.categories)
    );
  });
});
