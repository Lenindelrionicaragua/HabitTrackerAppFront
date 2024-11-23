/**
 * Rounds a number to the specified number of decimals.
 * @param {number} value - The number to be rounded.
 * @param {number} decimals - Number of decimals (default is 2).
 * @returns {number} - Rounded number.
 */

const roundTo = (value, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Rounds all numeric values in an object to the specified precision.
 * @param {object} data - Object containing numeric values.
 * @param {number} decimals - Number of decimals (default is 2).
 * @returns {object} - New object with rounded values.
 */

const roundAllValues = (data, decimals = 2) => {
  if (typeof data === "number") {
    return roundTo(data, decimals);
  } else if (Array.isArray(data)) {
    return data.map(item => roundAllValues(item, decimals));
  } else if (typeof data === "object" && data !== null) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = roundAllValues(value, decimals);
      return acc;
    }, {});
  }
  return data; // Do not modify values that are not numbers or objects.
};

export { roundTo, roundAllValues };
