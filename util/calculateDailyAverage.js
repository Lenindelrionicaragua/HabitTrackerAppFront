export function calculateDailyAverage(totalDailyMinutes) {
  if (typeof totalDailyMinutes !== "object" || totalDailyMinutes === null) {
    throw new Error("Invalid input: totalDailyMinutes must be an object.");
  }

  const dates = Object.keys(totalDailyMinutes);

  const totalMinutes = dates.reduce((sum, date) => {
    const value = totalDailyMinutes[date];
    if (typeof value !== "number") {
      throw new Error(
        "Invalid input: totalDailyMinutes must contain numeric values."
      );
    }
    return sum + value;
  }, 0);

  const averageMinutes = totalMinutes / dates.length;

  const roundedAverage = Math.round(averageMinutes * 100) / 100;

  return {
    averageMinutes: roundedAverage
  };
}
