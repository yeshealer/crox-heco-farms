import BigNumber from "bignumber.js";
import { FarmConfig, PoolConfig, RastaFarmConfig } from "config/constants/types";

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber;
  lpTotalInQuoteToken?: BigNumber;
  lpTotalSupply?: BigNumber;
  lpBalance?: BigNumber;
  tokenPriceVsQuote?: BigNumber;
  poolWeight?: number;
  depositFeeBP?: number;
  croxPerBlock?: number;
  poolAddress?: any;
  userData?: {
    allowance: BigNumber;
    tokenBalance: BigNumber;
    stakedBalance: BigNumber;
    prevStakedBalance: BigNumber;
    earnings: BigNumber;
    nextHarvestUntil: number;
  };
}

// Slices states
export interface FarmsState {
  data: Farm[];
}

// Global state

export interface State {
  farms: FarmsState;
  dualFarms: FarmsState;
  croxPools: FarmsState;
}
