import { prepareChartData } from "../../util/prepareChartData";

describe("prepareChartData", () => {
  it("should replace 0 with 1 in top-level fields", () => {
    const input = {
      totalMinutes: 0,
      categoryCount: 0,
      daysWithRecords: 0,
      totalDailyMinutes: { day1: 0, day2: 15 },
      categoryData: [
        {
          name: "Work",
          dailyGoal: 0,
          totalMinutes: 0,
          percentage: 0,
          monthlyGoal: 0
        },
        {
          name: "Exercise",
          dailyGoal: 30,
          totalMinutes: 0,
          percentage: 90,
          monthlyGoal: 300
        }
      ]
    };

    const expectedOutput = {
      totalMinutes: 1,
      categoryCount: 1,
      daysWithRecords: 1,
      totalDailyMinutes: { day1: 1, day2: 15 },
      categoryData: [
        {
          name: "Work",
          dailyGoal: 1,
          totalMinutes: 1,
          percentage: 1,
          monthlyGoal: 1
        },
        {
          name: "Exercise",
          dailyGoal: 30,
          totalMinutes: 1,
          percentage: 90,
          monthlyGoal: 300
        }
      ]
    };

    expect(prepareChartData(input)).toEqual(expectedOutput);
  });

  it("should not change non-zero values", () => {
    const input = {
      totalMinutes: 100,
      categoryCount: 10,
      daysWithRecords: 5,
      totalDailyMinutes: { day1: 100, day2: 15 },
      categoryData: [
        {
          name: "Work",
          dailyGoal: 20,
          totalMinutes: 120,
          percentage: 80,
          monthlyGoal: 600
        }
      ]
    };

    expect(prepareChartData(input)).toEqual(input); // Should remain the same
  });

  it("should handle missing categoryData gracefully", () => {
    const input = {
      totalMinutes: 0,
      categoryCount: 0,
      daysWithRecords: 0,
      totalDailyMinutes: { day1: 0, day2: 0 }
    };

    const expectedOutput = {
      totalMinutes: 1,
      categoryCount: 1,
      daysWithRecords: 1,
      totalDailyMinutes: { day1: 1, day2: 1 }
    };

    expect(prepareChartData(input)).toEqual(expectedOutput);
  });

  it("should replace 0 with 1 in nested totalDailyMinutes", () => {
    const input = {
      totalDailyMinutes: { day1: 0, day2: 0, day3: 10 }
    };

    const expectedOutput = {
      totalDailyMinutes: { day1: 1, day2: 1, day3: 10 }
    };

    expect(prepareChartData(input)).toEqual(expectedOutput);
  });

  it("should not mutate the original input object", () => {
    const input = {
      totalMinutes: 0,
      categoryCount: 0,
      daysWithRecords: 0,
      totalDailyMinutes: { day1: 0, day2: 15 },
      categoryData: [
        {
          name: "Work",
          dailyGoal: 0,
          totalMinutes: 0,
          percentage: 0,
          monthlyGoal: 0
        }
      ]
    };

    const inputCopy = JSON.parse(JSON.stringify(input));

    prepareChartData(input);

    expect(input).toEqual(inputCopy); // Input should remain unchanged
  });
});
