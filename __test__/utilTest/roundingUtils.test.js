import { roundTo, roundAllValues } from "../../util/roundingUtils";

describe("roundTo", () => {
  it("should round numbers to the default of 2 decimals", () => {
    expect(roundTo(1.235)).toBe(1.24);
    expect(roundTo(1.234)).toBe(1.23);
  });

  it("should round numbers to the specified number of decimals", () => {
    expect(roundTo(1.235, 1)).toBe(1.2);
    expect(roundTo(1.235, 3)).toBe(1.235);
    expect(roundTo(1.234567, 5)).toBe(1.23457);
  });

  it("should handle negative numbers correctly", () => {
    expect(roundTo(-1.235)).toBe(-1.24);
    expect(roundTo(-1.234)).toBe(-1.23);
  });

  it("should return integers unchanged when decimals is 0", () => {
    expect(roundTo(5.7, 0)).toBe(6);
    expect(roundTo(5.4, 0)).toBe(5);
  });
});

describe("roundAllValues", () => {
  it("should round numeric values in a simple object", () => {
    const data = { a: 1.234, b: 2.345 };
    const expected = { a: 1.23, b: 2.35 };
    expect(roundAllValues(data)).toEqual(expected);
  });

  it("should round numeric values in an array", () => {
    const data = [1.234, 2.345, 3.456];
    const expected = [1.23, 2.35, 3.46];
    expect(roundAllValues(data)).toEqual(expected);
  });

  it("should round nested objects and arrays", () => {
    const data = {
      a: 1.234,
      b: [2.345, 3.456],
      c: {
        d: 4.567,
        e: [5.678, { f: 6.789 }]
      }
    };
    const expected = {
      a: 1.23,
      b: [2.35, 3.46],
      c: {
        d: 4.57,
        e: [5.68, { f: 6.79 }]
      }
    };
    expect(roundAllValues(data)).toEqual(expected);
  });

  it("should not modify non-numeric or non-object values", () => {
    const data = {
      a: "hello",
      b: true,
      c: null,
      d: undefined,
      e: { f: 1.234 }
    };
    const expected = {
      a: "hello",
      b: true,
      c: null,
      d: undefined,
      e: { f: 1.23 }
    };
    expect(roundAllValues(data)).toEqual(expected);
  });

  it("should handle an empty object or array", () => {
    expect(roundAllValues({})).toEqual({});
    expect(roundAllValues([])).toEqual([]);
  });

  it("should return the original value if not an object, array, or number", () => {
    expect(roundAllValues("hello")).toBe("hello");
    expect(roundAllValues(null)).toBe(null);
    expect(roundAllValues(undefined)).toBe(undefined);
  });
});
