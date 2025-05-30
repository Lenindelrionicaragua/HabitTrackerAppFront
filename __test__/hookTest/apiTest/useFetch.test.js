import { renderHook, act, waitFor } from "@testing-library/react-native";
import axios from "axios";
import useFetch from "../../../hooks/api/useFetch";

// Mock of axios
jest.mock("axios");

describe("useFetch Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should handle incorrect credentials", async () => {
    // Mock to simulate an API error response
    const mockErrorResponse = {
      response: {
        data: {
          msg: "No user was found associated with the provided email address."
        }
      }
    };

    // Simulate an Axios error
    axios.mockImplementationOnce(() => Promise.reject(mockErrorResponse));

    const { result } = renderHook(() => useFetch("/login", () => {}));

    // Perform the fetch action
    await act(async () => {
      await result.current.performFetch();
    });

    // Wait until error is set (or isLoading becomes false)
    await waitFor(
      () => result.current.error !== null && result.current.isLoading === false
    );

    expect(result.current.error).toBeDefined();
    expect(result.current.error.message).toBe(
      mockErrorResponse.response.data.msg
    );
  });

  it("should return the correct error message when no user credentials are provided", async () => {
    const mockResponse = {
      success: false,
      error: "BAD REQUEST: Email and password are required."
    };

    axios.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));

    const onReceived = jest.fn();

    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    act(() => {
      result.current.performFetch({ data: {} });
    });

    // Wait until error appears in state and fetching is complete
    await waitFor(
      () => result.current.error !== null && result.current.isLoading === false
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toMatch(
      "BAD REQUEST: Email and password are required."
    );
    expect(onReceived).not.toHaveBeenCalled();
  });

  it("should return the correct error message when no user is found", async () => {
    const credentials = {
      email: "invalidUser",
      password: "invalidPassword"
    };

    const mockResponse = {
      success: false,
      msg: "No user was found associated with the provided email address. Please verify your email and try again or register if you are a new user."
    };

    axios.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));

    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    act(() => {
      result.current.performFetch({ data: credentials });
    });

    // Wait until error appears and fetching has completed
    await waitFor(
      () => result.current.error !== null && result.current.isLoading === false
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toMatch(
      "No user was found associated with the provided email address. Please verify your email and try again or register if you are a new user."
    );
    expect(onReceived).not.toHaveBeenCalled();
  });

  it("should return the correct response for valid credentials", async () => {
    const credentials = {
      user: {
        email: "testuser@gmail.com",
        password: "Password1234!"
      }
    };

    const mockResponse = {
      success: true,
      msg: "Login successful",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmYzZjFjYzM4MWY0MWJiNWVlMzhmMjYiLCJpYXQiOjE3MjczNDkzNDV9.B--8cnPu-Dho0rylhID65yQ9vVIJryUgFIEbzt0R1t0",
      user: {
        id: "66f3f1cc381f41bb5ee38f26",
        email: "testuser@gmail.com",
        name: "Len Del Rio"
      }
    };

    axios.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));

    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/login", onReceived));

    act(() => {
      result.current.performFetch({ data: credentials });
    });

    // Wait until isLoading is false
    await waitFor(() => result.current.isLoading === false);

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockResponse);
    expect(onReceived).toHaveBeenCalledWith(mockResponse);
  });

  it("should handle null request parameters", async () => {
    // If initialRoute is null, the hook should throw during initialization.
    // We can assert that by wrapping renderHook() in a function.
    expect(() => renderHook(() => useFetch(null, jest.fn()))).toThrow(
      "Invalid route provided"
    );
  });

  it("should handle failed GET request", async () => {
    axios.mockRejectedValueOnce(new Error("Network Error"));

    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    act(() => {
      result.current.performFetch();
    });

    // Wait until error is set and fetching is complete
    await waitFor(
      () => result.current.error !== null && result.current.isLoading === false
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Network Error");
  });

  it("should handle invalid URL", async () => {
    const { result } = renderHook(() => useFetch("invalid-url", jest.fn()));

    await act(async () => {
      await result.current.performFetch();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Invalid URL");
  });

  it("should call cancelFetch", () => {
    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));
    const spyCancelFetch = jest.spyOn(result.current, "cancelFetch");

    act(() => {
      result.current.cancelFetch();
    });

    expect(spyCancelFetch).toHaveBeenCalled();

    spyCancelFetch.mockRestore();
  });

  it("should return cancelFetch function", () => {
    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    expect(typeof result.current.cancelFetch).toBe("function");
  });

  it("should handle empty response", async () => {
    // Mocking an API response that is an empty object
    axios.mockImplementationOnce(() => Promise.resolve({ data: {} }));

    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    await act(async () => {
      await result.current.performFetch();
    });

    // Wait until error is set
    await waitFor(
      () => result.current.error !== null && result.current.isLoading === false
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Empty response from server");
  });

  it("should handle generic server error", async () => {
    const mockErrorResponse = {
      response: {
        data: {
          msg: "Internal server error."
        }
      }
    };

    axios.mockImplementationOnce(() => Promise.reject(mockErrorResponse));

    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    await act(async () => {
      await result.current.performFetch();
    });

    // Wait until error is set
    await waitFor(
      () => result.current.error !== null && result.current.isLoading === false
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Internal server error.");
  });

  it("should set isLoading to true while fetching", async () => {
    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.performFetch();
    });

    // Wait until fetching has completed
    await waitFor(() => result.current.isLoading === false);

    expect(result.current.isLoading).toBe(false);
  });
});
