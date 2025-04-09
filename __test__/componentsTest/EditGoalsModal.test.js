import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import EditGoalsModal from "../../component/EditGoalsModal/EditGoalsModal";

describe("EditGoalsModal Component", () => {
  let mockOnSave;
  let mockOnClose;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  beforeEach(() => {
    mockOnSave = jest.fn();
    mockOnClose = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render and animate correctly", async () => {
    const { getByText } = render(
      <EditGoalsModal
        isVisible={true}
        onClose={mockOnClose}
        currentName="Exercise"
        currentGoal={30}
        onSave={mockOnSave}
      />
    );

    await act(async () => {
      fireEvent.press(getByText("Save"));
    });

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it("should not render the modal when isVisible is false", () => {
    const { queryByText } = render(
      <EditGoalsModal
        isVisible={false}
        onClose={mockOnClose}
        currentName="Exercise"
        currentGoal={30}
        onSave={mockOnSave}
      />
    );

    expect(queryByText("Edit Habits")).toBeNull();
  });

  it("should call onSave when valid data is provided and Save is pressed", async () => {
    const { getByText, getByPlaceholderText } = render(
      <EditGoalsModal
        isVisible={true}
        onClose={mockOnClose}
        currentName="Exercise"
        currentGoal={30}
        onSave={mockOnSave}
      />
    );

    const nameInput = getByPlaceholderText("Name");
    const goalInput = getByPlaceholderText("Daily Goal (mins)");

    await act(async () => {
      fireEvent.changeText(nameInput, "Running");
      fireEvent.changeText(goalInput, "45");
    });

    await act(async () => {
      fireEvent.press(getByText("Save"));
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: "Running",
        dailyGoal: 45
      });
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should show error when invalid name is provided", async () => {
    const { getByText, getByPlaceholderText } = render(
      <EditGoalsModal
        isVisible={true}
        onClose={mockOnClose}
        currentName="Exercise"
        currentGoal={30}
        onSave={mockOnSave}
      />
    );

    const nameInput = getByPlaceholderText("Name");

    await act(async () => {
      fireEvent.changeText(nameInput, "");
    });

    await act(async () => {
      fireEvent.press(getByText("Save"));
    });

    expect(getByText("Category name is required.")).toBeTruthy();
  });

  it("should show error when invalid goal is provided", async () => {
    const { getByText, getByPlaceholderText } = render(
      <EditGoalsModal
        isVisible={true}
        onClose={mockOnClose}
        currentName="Exercise"
        currentGoal={30}
        onSave={mockOnSave}
      />
    );

    const goalInput = getByPlaceholderText("Daily Goal (mins)");

    await act(async () => {
      fireEvent.changeText(goalInput, "10");
    });

    await act(async () => {
      fireEvent.press(getByText("Save"));
    });

    expect(getByText("Daily goal must be at least 15 minutes.")).toBeTruthy();
  });

  it("should call onClose when Cancel is pressed", async () => {
    const { getByText } = render(
      <EditGoalsModal
        isVisible={true}
        onClose={mockOnClose}
        currentName="Exercise"
        currentGoal={30}
        onSave={mockOnSave}
      />
    );

    await act(async () => {
      fireEvent.press(getByText("Cancel"));
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
