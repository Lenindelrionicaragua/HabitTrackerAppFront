import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer"; // Ajusta la ruta según tu estructura de carpetas
import useResetStopwatch from "../../hooks/useResetStopwatch";
import { usePerformReset } from "../../hooks/usePerformReset";
import useInfoText from "../../hooks/useInfoText";

// Mock de hooks
jest.mock("../../hooks/usePerformReset", () => ({
  usePerformReset: jest.fn()
}));

jest.mock("../../hooks/useInfoText", () => ({
  useInfoText: jest.fn()
}));

describe("useResetStopwatch", () => {
  it("should call performReset when handleResetClicksTwoOrMore is called and remainingTime is not 0", () => {
    const dispatch = jest.fn();
    const performReset = jest.fn();
    const setInfoTextWithTimeout = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    // Configuración del estado inicial para la tienda
    const initialState = {
      resetButtonLabel: { resetButtonLabel: "RESET" },
      resetClicks: { resetClicks: 2 },
      remainingTime: 10
    };

    // Crear la tienda con el estado inicial
    const store = createStore(rootReducer, initialState);

    // Configurar los mocks
    usePerformReset.mockReturnValue(performReset);
    useInfoText.mockReturnValue({
      setInfoTextWithTimeout,
      clearTimeoutsAndMessage
    });

    // Renderizar el hook con la tienda
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useResetStopwatch(), { wrapper });

    // Ejecutar la acción que debería disparar performReset
    act(() => {
      result.current.handleResetClicksTwoOrMore();
    });

    // Asegurarse de que las funciones fueron llamadas
    expect(performReset).toHaveBeenCalled();
    expect(setInfoTextWithTimeout).toHaveBeenCalled();
  });
});
