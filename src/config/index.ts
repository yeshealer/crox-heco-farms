import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const CAKE_PER_BLOCK = new BigNumber(0.5);
export const RASTA_PER_BLOCK = new BigNumber(0.2)
export const BLOCKS_PER_YEAR = new BigNumber(10512000);
export const BLOCKS_PER_DAY = new BigNumber(28800);
export const BSC_BLOCK_TIME = 3;

export const CAKE_POOL_PID = 1;
export const RASTA_POOL_PID = 1