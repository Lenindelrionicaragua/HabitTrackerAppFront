import { renderHook, act } from "@testing-library/react-hooks";
import { useDispatch, useSelector } from "react-redux";
import useResetStopwatch from "../../hooks/useResetStopwatch";
import usePerformReset from "../../hooks/usePerformReset";
import useInfoText from "../../hooks/useInfoText";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock("../../hooks/usePerformReset", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../hooks/useInfoText", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setInfoTextWithTimeout: jest.fn(),
    clearTimeoutsAndMessage: jest.fn()
  }))
}));

describe("useResetStopwatch", () => {
  it("should call performReset when handleResetClicksTwoOrMore is called and remainingTime is not 0", () => {
    const dispatch = jest.fn();
    const performReset = jest.fn();
    const setInfoTextWithTimeout = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    useDispatch.mockReturnValue(dispatch);

    useSelector.mockImplementation(selector => {
      if (selector({ remainingTime: 10 }) === 10) {
        return 10; // Simula que remainingTime no es 0
      }
      if (selector({ resetClicks: 2 }) === 2) {
        return 2; // Establece el valor inicial de resetClicks
      }
      return null;
    });

    usePerformReset.mockReturnValue(performReset);

    const { result } = renderHook(() => useResetStopwatch());

    act(() => {
      result.current.handleResetClicksTwoOrMore();
    });

    expect(performReset).toHaveBeenCalled();
    expect(setInfoTextWithTimeout).toHaveBeenCalled();
  });
});
