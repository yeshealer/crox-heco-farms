export type IfoStatus = "coming_soon" | "live" | "finished";

export interface Ifo {
  id: string;
  isActive: boolean;
  address: string;
  name: string;
  subTitle?: string;
  description?: string;
  launchDate: string;
  launchTime: string;
  saleAmount: string;
  raiseAmount: string;
  cakeToBurn: string;
  projectSiteUrl: string;
  currency: string;
  currencyAddress: string;
  tokenDecimals: number;
  releaseBlockNumber: number;
}

export enum QuoteToken {
  "BNB" = "BNB",
  "CAKE" = "CAKE",
  "SYRUP" = "SYRUP",
  "BUSD" = "BUSD",
  "TWT" = "TWT",
  "UST" = "UST",
  "USDC" = "USDC",
  "USDT" = "USDT",
  'RASTA' = 'RASTA',
  'MRASTA' = 'MRASTA',
  'ETH' = 'ETH',
  'COMP' = 'COMP',
  'DOT' = 'DOT',
  'CNS' = 'CNS',
  'DFL' = 'DFL',
  'WHT' = 'WHT',
  'WNOW' = 'WNOW'
}

export enum PoolCategory {
  "COMMUNITY" = "Community",
  "CORE" = "Core",
  "BINANCE" = "Binance", // Pools using native BNB behave differently than pools using a token
}

export interface Address {
  97?: string;
  128: string;
}

export interface FarmConfig {
  pid: number;
  pidv1?: number;
  lpSymbol: string;
  lpAddresses: Address;
  tokenSymbol: string;
  tokenAddresses: Address;
  quoteTokenSymbol: QuoteToken;
  quoteTokenAdresses: Address;
  multiplier?: string;
  isTokenOnly?: boolean;
  isCommunity?: boolean;
  isDualFarm?: boolean;
  risk: number;
  dual?: {
    rewardPerBlock: number;
    earnLabel: string;
    endBlock: number;
  };
  title: string;
  cgProjectId?: string;
  tokenPrice?: number;
  tokenDecimal?: number;
}

export interface RastaFarmConfig {
  pid?: number
  lpSymbol?: string
  lpAddresses?: Address
  tokenSymbol?: string
  tokenAddresses?: Address
  quoteTokenSymbol?: QuoteToken
  quoteTokenAdresses?: Address
  multiplier?: string
  tokenDecimals?: number
  isCommunity?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
  depositFee?: number
}

export interface DualFarmConfig {
  pid: number;
  pidv1?: number;
  lpSymbol: string;
  lpType: string;
  lpAddresses: Address;
  poolAddress: Address;
  tokenIcon?: string;
  tokenSymbol: string;
  tokenAddresses: Address;
  rewardTokenSymbol?: string;
  rewardTokenAddresses?: Address;
  quoteTokenSymbol: QuoteToken;
  quoteTokenAdresses: Address;
  multiplier?: string;
  isTokenOnly?: boolean;
  isCommunity?: boolean;
  risk: number;
  dual?: {
    rewardPerBlock: number;
    earnLabel: string;
    endBlock: number;
  };
  title: string;
  tokenDecimal?: number;
  tokenPrice?: number;
  rewardTokenPrice?: number;
  quoteTokenPrice?: number;
  newPool?: number;
  duration?: number;
  isWhalePool?: boolean;
  isShrimpPool?: boolean;
  isBoosterPool?: boolean;
  isDualFarm?: boolean;
  depositLink?: string;
  projectLink?: string;
  active: boolean;
  isLPToken?: boolean;
  isHintVisible?: boolean;
  minStaking?: number;
  showBackground?: boolean;
  penaltyFee?: number;
  minFirstDeposit?: number;
  maxFirstDeposit?: number;
  reward1?: number;
  poolStartTime?: number;
  reward2?: number;
  cgProjectID?: string;
  closed?: boolean;
  revert?: boolean;
  lpTokenDecimal?: number;
  cmcId?: number;
}

export interface GrandPoolRewardToken {
  tokenSymbol: string;
  tokenAddress: Address;
  tokenPrice: number;
  rewardPerBlock: number;
}
export interface GrandFarmConfig {
  pid: number;
  pidv1?: number;
  lpSymbol: string;
  lpType: string;
  lpAddresses: Address;
  poolAddress: Address;
  tokenIcon?: string;
  tokenSymbol: string;
  tokenAddresses: Address;
  rewardTokenSymbol?: string;
  rewardTokenAddresses?: Address;
  rewardTokens?: Array<GrandPoolRewardToken>;
  quoteTokenSymbol: QuoteToken;
  quoteTokenAdresses: Address;
  multiplier?: string;
  isTokenOnly?: boolean;
  isCommunity?: boolean;
  risk: number;
  dual?: {
    rewardPerBlock: number;
    earnLabel: string;
    endBlock: number;
  };
  title: string;
  tokenDecimal?: number;
  tokenPrice?: number;
  rewardTokenPrice?: number;
  quoteTokenPrice?: number;
  newPool?: number;
  duration?: number;
  isWhalePool?: boolean;
  isShrimpPool?: boolean;
  isBoosterPool?: boolean;
  isDualFarm?: boolean;
  depositLink?: string;
  projectLink?: string;
  active: boolean;
  isLPToken?: boolean;
  isHintVisible?: boolean;
  minStaking?: number;
  showBackground?: boolean;
  penaltyFee?: number;
  minFirstDeposit?: number;
  maxFirstDeposit?: number;
  reward1?: number;
  poolStartTime?: number;
  reward2?: number;
  cgProjectID?: string;
  closed?: boolean;
  revert?: boolean;
  lpTokenDecimal?: number;
}

export interface PoolConfig {
  sousId: number;
  image?: string;
  tokenName: string;
  stakingTokenName: QuoteToken;
  stakingLimit?: number;
  stakingTokenAddress?: string;
  contractAddress: Address;
  poolCategory: PoolCategory;
  projectLink: string;
  tokenPerBlock: string;
  sortOrder?: number;
  harvest?: boolean;
  isFinished?: boolean;
  tokenDecimals: number;
}

export type Nft = {
  name: string;
  description: string;
  originalImage: string;
  previewImage: string;
  blurImage: string;
  sortOrder: number;
  bunnyId: number;
};
