import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ResendTimer from "../../component/ResendTimer/ResendTimer";

describe("ResendTimer component", () => {
  it("calls resendEmail when activeResend is true", () => {
    const mockResendEmail = jest.fn();

    const { getByTestId } = render(
      <ResendTimer
        activeResend={true}
        resendEmail={mockResendEmail}
        isLoading={false}
        resendStatus="Resend"
        timeLeft={10}
        targetTime={30}
      />
    );

    fireEvent.press(getByTestId("resend-button"));
    expect(mockResendEmail).toHaveBeenCalled();
  });

  it("does not call resendEmail when activeResend is false", () => {
    const mockResendEmail = jest.fn();

    const { getByTestId } = render(
      <ResendTimer
        activeResend={false}
        resendEmail={mockResendEmail}
        isLoading={false}
        resendStatus="Please wait"
        timeLeft={20}
        targetTime={30}
      />
    );

    fireEvent.press(getByTestId("resend-button"));
    expect(mockResendEmail).not.toHaveBeenCalled();
  });

  it("shows loading indicator when isLoading is true", () => {
    const mockResendEmail = jest.fn();

    const { getByTestId } = render(
      <ResendTimer
        activeResend={false}
        resendEmail={mockResendEmail}
        isLoading={true}
        resendStatus="Sending..."
        timeLeft={20}
        targetTime={30}
      />
    );

    expect(getByTestId("activity-indicator")).toBeTruthy();
  });
});
