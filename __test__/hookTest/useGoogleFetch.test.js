import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import useGoogleFetch from "../../hooks/useGoogleFetch";

// Mock of axios
jest.mock("axios");

describe("useGoogleFetch Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw an error if onReceived is not a function", () => {
    const { result } = renderHook(() => useGoogleFetch(null));
    expect(result.error.message).toBe(
      "useGoogleFetch: onReceived must be a function"
    );
  });

  it("should return an error when user info fetch fails", async () => {
    const mockErrorResponse = {
      response: {
        data: {
          msg: "Invalid access token."
        }
      }
    };

    axios.get.mockImplementationOnce(() => Promise.reject(mockErrorResponse));

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useGoogleFetch(onReceived)
    );

    await act(async () => {
      await result.current.performGoogleFetch({ accessToken: "invalid" });
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Invalid access token.");
    expect(result.current.isLoading).toBe(false);
    expect(onReceived).not.toHaveBeenCalled();
  });

  it("should return an error when server authentication fails", async () => {
    const mockUserInfo = {
      email: "testuser@gmail.com",
      name: "Test User"
    };

    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockUserInfo })
    );
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { success: false, msg: "User not found." } })
    );

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useGoogleFetch(onReceived)
    );

    await act(async () => {
      await result.current.performGoogleFetch({ accessToken: "valid" });
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("User not found.");
    expect(result.current.isLoading).toBe(false);
    expect(onReceived).not.toHaveBeenCalled();
  });

  it("should return correct data for successful authentication", async () => {
    const mockUserInfo = {
      email: "testuser@gmail.com",
      name: "Test User"
    };

    const mockResponse = {
      success: true,
      msg: "Login successful",
      user: { id: "user-id", ...mockUserInfo }
    };

    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockUserInfo })
    );
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: mockResponse })
    );

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useGoogleFetch(onReceived)
    );

    await act(async () => {
      await result.current.performGoogleFetch({ accessToken: "valid" });
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockResponse);
    expect(onReceived).toHaveBeenCalledWith(mockResponse);
    expect(result.current.isLoading).toBe(false);
  });

  it("should set isLoading to true while fetching", async () => {
    const mockUserInfo = {
      email: "testuser@gmail.com",
      name: "Test User"
    };

    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockUserInfo })
    );

    const onReceived = jest.fn();
    const { result } = renderHook(() => useGoogleFetch(onReceived));

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.performGoogleFetch({ accessToken: "valid" });
    });

    expect(result.current.isLoading).toBe(false);
  });
});
