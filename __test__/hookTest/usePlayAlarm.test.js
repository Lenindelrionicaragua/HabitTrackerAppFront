import { renderHook, act } from "@testing-library/react-native";
import { Audio } from "expo-av";
import { usePlayAlarm } from "../../hooks/usePlayAlarm";
import { logInfo, logError } from "../../util/logging";

jest.mock("../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

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

    jest.clearAllMocks();
  });

  it("should load and play the sound correctly", async () => {
    const { result } = renderHook(() => usePlayAlarm());

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    // Verificar que se haya llamado a logInfo con los mensajes correctos
    expect(logInfo).toHaveBeenCalledWith("Loading Sound");
    expect(logInfo).toHaveBeenCalledWith("Playing notification Sound");

    // Verificar que el sonido se haya creado y reproducido correctamente
    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(soundPath);
    expect(result.current.soundRef.current.playAsync).toHaveBeenCalled();
  });

  it("should unload the previous sound before loading a new one", async () => {
    const { result } = renderHook(() => usePlayAlarm());

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(mockPlayAsync).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(mockUnloadAsync).toHaveBeenCalledTimes(1); // Verificar que se haya descargado el sonido anterior
  });

  it("should clean up the sound instance on completion", async () => {
    const { result } = renderHook(() => usePlayAlarm());

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
    expect(result.current.soundRef.current).toBeNull(); // Asegurarse de que soundRef sea nulo
  });

  it("should log error if something goes wrong", async () => {
    Audio.Sound.createAsync.mockRejectedValueOnce(new Error("Error"));

    const { result } = renderHook(() => usePlayAlarm());

    await act(async () => {
      await result.current.playAlarm(soundPath);
    });

    expect(logError).toHaveBeenCalledWith(
      "Error playing the notification sound:",
      expect.any(Error)
    );
  });
});
