import {
  render,
  fireEvent,
  screen,
  waitFor
} from "@testing-library/react-native";
import StopwatchScreen from "../../screens/StopwatchScreen/StopwatchScreen";

describe("StopwatchScreen", () => {
  test("Should start the timer by pressing the start button", () => {
    render(<StopwatchScreen />);

    expect(screen.getByTestId("svg-time-text")).toBeTruthy();

    fireEvent.press(screen.getByTestId("start-button"));

    setTimeout(() => {
      expect(screen.getByText("00:00:01")).toBeTruthy();
    }, 1000);
  });
});
