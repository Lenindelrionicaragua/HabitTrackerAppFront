import { renderHook, act } from "@testing-library/react-hooks";
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
  let mockUnloadedAsync;
  let mockPlayAsync;
  let mockSetOnPlaybackStatusUpdate;

  const soundPath = require("../../assets/alarm_2.wav");
  const logInfo = jest.fn();
  const logError = jest.fn();

  beforeEach(() => {
    mockUnloadedAsync = jest.fn();
    mockPlayAsync = jest.fn();
    mockSetOnPlaybackStatusUpdate = jest.fn();

    Audio.Sound.createAsync.mockResolvedValue({
      sound: {
        unloadAsync: mockUnloadedAsync,
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
    expect(result.current.alarm.playAsync).toHaveBeenCalled();
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

    expect(mockUnloadedAsync).toHaveBeenCalledTimes(1);

    expect(logInfo).toHaveBeenCalledWith("Loading Sound");
  });

  it("should clean up the sound instance on completion", async () => {
    const { result } = renderHook(() => usePlayAlarm(logInfo, logError));

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(mockSetOnPlaybackStatusUpdate).toHaveBeenCalled();

    const mockStatus = { didJustFinish: true };
    mockSetOnPlaybackStatusUpdate.mock.calls[0][0](mockStatus);

    expect(mockUnloadedAsync).toHaveBeenCalled();
    expect(logInfo).toHaveBeenCalledWith("Sound has finished playing");
  });
});
