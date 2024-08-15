import { formatTime } from "../../util/formatTime";

describe("formatTime", () => {
  test('should return "00:00:00" for negative values', () => {
    expect(formatTime(-10)).toBe("00:00:00");
  });

  test('should return "00:00:00" for non-numeric values', () => {
    expect(formatTime("abc")).toBe("00:00:00");
    expect(formatTime(null)).toBe("00:00:00");
    expect(formatTime(undefined)).toBe("00:00:00");
  });

  test("should format correctly for values less than one hour", () => {
    expect(formatTime(0)).toBe("00:00:00");
    expect(formatTime(59)).toBe("00:00:59");
    expect(formatTime(60)).toBe("00:01:00");
    expect(formatTime(3599)).toBe("00:59:59");
  });

  test("should format correctly for values of one hour or more", () => {
    expect(formatTime(3600)).toBe("01:00:00");
    expect(formatTime(3661)).toBe("01:01:01");
    expect(formatTime(86399)).toBe("23:59:59");
  });

  test("should round seconds correctly", () => {
    expect(formatTime(0.5)).toBe("00:00:01");
    expect(formatTime(1.4)).toBe("00:00:01");
    expect(formatTime(3661.7)).toBe("01:01:02");
  });
});
