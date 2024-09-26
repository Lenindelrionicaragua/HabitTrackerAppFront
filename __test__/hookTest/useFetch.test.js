import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import useFetch from "../../hooks/useFetch";

// Mock of axios
jest.mock("axios");

describe("useFetch Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return the correct error message when no user credentials are provided", async () => {
    const mockResponse = {
      success: false,
      error: "BAD REQUEST: Email and password are required."
    };

    axios.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch({
        data: {}
      });
    });

    await waitForNextUpdate();

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
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch({
        data: credentials
      });
    });

    await waitForNextUpdate();

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
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/login", onReceived)
    );

    act(() => {
      result.current.performFetch({
        data: credentials
      });
    });

    await waitForNextUpdate();

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(onReceived).toHaveBeenCalledWith(mockResponse);
  });

  it("should handle null request parameters", async () => {
    const { result } = renderHook(() => useFetch(null, jest.fn()));

    expect(() => result.current.performFetch()).toThrow(
      "Invalid route provided"
    );
  });

  it("should handle failed GET request", async () => {
    axios.mockRejectedValueOnce(new Error("Network Error"));

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
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
});
