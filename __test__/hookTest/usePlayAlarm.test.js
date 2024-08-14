import { renderHook, act } from "@testing-library/react-hooks";
import { usePlayAlarm } from "../../hooks/usePlayaAlarm";
import { Audio } from "expo-av";

// Mock the Audio module from expo-av
jest.mock("expo-av", () => {
  return {
    Audio: {
      Sound: {
        createAsync: jest.fn(() =>
          Promise.resolve({
            sound: {
              playAsync: jest.fn(),
              unloadAsync: jest.fn(),
              setOnPlaybackStatusUpdate: jest.fn()
            }
          })
        )
      }
    }
  };
});

describe("usePlayAlarm", () => {
  const logInfo = jest.fn();
  const logError = jest.fn();
  const soundPath = "ZenTimerAppFront/assets/alarm_1.wav";

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
      await result.current.playAlarm(soundPath);
    });

    expect(result.current.alarm.unloadAsync).toHaveBeenCalledTimes(1);
    expect(logInfo).toHaveBeenCalledWith("Loading Sound");
  });

  it("should log an error if something goes wrong", async () => {
    Audio.Sound.createAsync.mockImplementationOnce(() =>
      Promise.reject("Error loading sound")
    );

    const { result } = renderHook(() => usePlayAlarm(logInfo, logError));

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(logError).toHaveBeenCalledWith(
      "Error playing the notification sound:",
      "Error loading sound"
    );
  });

  it("should clean up the sound instance on completion", async () => {
    const { result } = renderHook(() => usePlayAlarm(logInfo, logError));

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    const mockSetOnPlaybackStatusUpdate =
      Audio.Sound.createAsync.mock.results[0].value.sound
        .setOnPlaybackStatusUpdate;

    // Simulate the sound finishing
    const mockStatus = { didJustFinish: true };
    mockSetOnPlaybackStatusUpdate.mock.calls[0][0](mockStatus);

    expect(
      Audio.Sound.createAsync.mock.results[0].value.sound.unloadAsync
    ).toHaveBeenCalled();
    expect(logInfo).toHaveBeenCalledWith("Sound has finished playing");
  });
});
