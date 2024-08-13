// utils/formatTime.js
export const formatTime = totalSeconds => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00:00";
  }

  const roundedSeconds = Math.round(totalSeconds);

  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const seconds = roundedSeconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
