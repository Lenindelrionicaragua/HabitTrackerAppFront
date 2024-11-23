import { calculateDailyAverage } from "../../util/calculateDailyAverage";

describe("calculateDailyAverage", () => {
  it("should calculate the correct total and average for valid input", () => {
    const totalDailyMinutes = {
      "2024-02-05": 135,
      "2024-02-15": 120,
      "2024-02-20": 90
    };

    const result = calculateDailyAverage(totalDailyMinutes);

    expect(result).toEqual({
      averageMinutes: (135 + 120 + 90) / 3
    });
  });

  it("should handle a single day correctly", () => {
    const totalDailyMinutes = {
      "2024-02-05": 150
    };

    const result = calculateDailyAverage(totalDailyMinutes);

    expect(result).toEqual({
      averageMinutes: 150
    });
  });

  it("should handle an empty object gracefully", () => {
    const totalDailyMinutes = {};

    const result = calculateDailyAverage(totalDailyMinutes);

    expect(result).toEqual({
      averageMinutes: NaN // División por 0
    });
  });

  it("should handle non-numeric values gracefully", () => {
    const totalDailyMinutes = {
      "2024-02-05": "abc",
      "2024-02-15": 120
    };

    expect(() => calculateDailyAverage(totalDailyMinutes)).toThrow(
      "Invalid input: totalDailyMinutes must contain numeric values."
    );
  });

  it("should throw an error if input is not an object", () => {
    const totalDailyMinutes = null;

    expect(() => calculateDailyAverage(totalDailyMinutes)).toThrow(
      "Invalid input: totalDailyMinutes must be an object."
    );
  });
});
