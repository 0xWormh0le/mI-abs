const unitsPerAda = BigInt(1000000);
const unitsPerPmx = BigInt(100000000);

const coinAmountFromUnits = (unitsPerCoin: bigint) => (price: bigint, decimalPlace: number) =>
  (Number(price) / Number(unitsPerCoin)).toFixed(decimalPlace);

const coinAmountToUnits = (unitsPerCoin: bigint) => (value: number | string): bigint =>
  BigInt(Math.round(Number(value) * Number(unitsPerCoin)));

/**
 * Takes an BigInt price and outputs it's ADA as human readable price.
 * @param {bigint} price - The price in BigInt.
 * @param {number} decimalPlace - comma position.
 * @returns {string} Returns the human readable price.
 *
 * @example
 * adaFromUnits(50000n, 3) returns "0.050"
 *
 */

export const adaFromUnits = coinAmountFromUnits(unitsPerAda);

/**
 * Takes an human readable price and outputs it's BigInt price.
 * @param {string} value - The human readable price.
 * @returns {bigint} Returns the bigint price.
 *
 * @example
 * adaToUnits("0.05") returns 50000n
 *
 */

export const adaToUnits = coinAmountToUnits(unitsPerAda);

export const pmxFromUnits = coinAmountFromUnits(unitsPerPmx);

export const pmxToUnits = coinAmountToUnits(unitsPerPmx);
