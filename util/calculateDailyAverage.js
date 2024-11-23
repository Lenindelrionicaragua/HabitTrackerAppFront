export function calculateDailyAverage(totalDailyMinutes) {
  const dates = Object.keys(totalDailyMinutes);

  const totalMinutes = dates.reduce(
    (sum, date) => sum + totalDailyMinutes[date],
    0
  );

  const averageMinutes = totalMinutes / dates.length;

  return {
    averageMinutes
  };
}
