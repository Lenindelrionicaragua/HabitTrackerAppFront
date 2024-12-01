/**
 * Prepares data for chart components by replacing problematic values (e.g., 0s) with valid defaults.
 *
 * @param {Object} data - The input object to process (e.g., Redux state).
 * @returns {Object} A new object with adjustments suitable for charts.
 */

export const prepareChartData = data => {
  // Utility function to replace 0 with 1
  const replaceZero = value => (value === 0 ? 1 : value);

  // Deep copy to avoid mutation
  const processedData = JSON.parse(JSON.stringify(data));

  // Process categoryData if available
  if (Array.isArray(processedData.categoryData)) {
    processedData.categoryData = processedData.categoryData.map(category => ({
      ...category,
      dailyGoal: replaceZero(category.dailyGoal),
      totalMinutes: replaceZero(category.totalMinutes),
      percentage: replaceZero(category.percentage),
      monthlyGoal: replaceZero(category.monthlyGoal)
    }));
  }

  // Handle nested fields like totalDailyMinutes if it's an object
  if (typeof processedData.totalDailyMinutes === "object") {
    processedData.totalDailyMinutes = Object.fromEntries(
      Object.entries(processedData.totalDailyMinutes).map(([key, value]) => [
        key,
        replaceZero(value)
      ])
    );
  }

  // Process top-level fields
  processedData.totalMinutes = replaceZero(processedData.totalMinutes);
  processedData.categoryCount = replaceZero(processedData.categoryCount);
  processedData.daysWithRecords = replaceZero(processedData.daysWithRecords);

  return processedData;
};
