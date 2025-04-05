import { renderHook, act } from "@testing-library/react-native"; // Importa de react-native, no de react
import { Audio } from "expo-av";
import { usePlayAlarm } from "../../hooks/usePlayAlarm";

jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn()
    }
  }
}));

describe("usePlayAlarm hook", () => {
  let mockUnloadAsync;
  let mockPlayAsync;
  let mockSetOnPlaybackStatusUpdate;

  const soundPath = require("../../assets/alarm_2.wav");
  const logInfo = jest.fn();
  const logError = jest.fn();

  beforeEach(() => {
    mockUnloadAsync = jest.fn();
    mockPlayAsync = jest.fn();
    mockSetOnPlaybackStatusUpdate = jest.fn();

    Audio.Sound.createAsync.mockResolvedValue({
      sound: {
        unloadAsync: mockUnloadAsync,
        playAsync: mockPlayAsync,
        setOnPlaybackStatusUpdate: mockSetOnPlaybackStatusUpdate
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should load and play the sound correctly", async () => {
    const { result } = renderHook(() => usePlayAlarm(logInfo, logError));

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(soundPath);
    expect(result.current.soundRef.current.playAsync).toHaveBeenCalled();
    expect(logInfo).toHaveBeenCalledWith("Loading Sound");
    expect(logInfo).toHaveBeenCalledWith("Playing notification Sound");
  });

  it("should unload the previous sound before loading a new one", async () => {
    const { result } = renderHook(() => usePlayAlarm(logInfo, logError));

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(mockPlayAsync).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(mockUnloadAsync).toHaveBeenCalledTimes(1);
  });

  it("should clean up the sound instance on completion", async () => {
    const { result } = renderHook(() => usePlayAlarm(logInfo, logError));

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(mockSetOnPlaybackStatusUpdate).toHaveBeenCalled();

    const mockStatus = { didJustFinish: true };

    await act(async () => {
      mockSetOnPlaybackStatusUpdate.mock.calls[0][0](mockStatus);
    });

    expect(mockUnloadAsync).toHaveBeenCalled();
    expect(logInfo).toHaveBeenCalledWith("Sound has finished playing");
    expect(result.current.soundRef.current).toBeNull();
  });

  it("should log error if something goes wrong", async () => {
    Audio.Sound.createAsync.mockRejectedValueOnce(new Error("Error"));

    const { result } = renderHook(() => usePlayAlarm(logInfo, logError));

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(logError).toHaveBeenCalledWith(
      "Error playing the notification sound:",
      expect.any(Error)
    );
  });
});
