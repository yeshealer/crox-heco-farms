import BigNumber from "bignumber.js";
import { QuoteToken } from "../config/constants/types";
import {
  BLOCKS_PER_DAY,
  BLOCKS_PER_YEAR,
  RASTA_PER_BLOCK
} from "../config";

export const getAPYAndTVLOfFarm = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.croxPerBlock || 1)
    .times(new BigNumber(farm.poolWeight))
    .div(new BigNumber(10).pow(18));
  const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR);

  let apy = cakePrice.times(cakeRewardPerYear);

  let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

  if (farm.quoteTokenSymbol === QuoteToken.BNB) {
    totalValue = totalValue.times(bnbPrice);
  }

  if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
    totalValue = cakePrice.times(farm.lpTotalInQuoteToken);
  }

  if (totalValue.comparedTo(0) > 0) {
    apy = apy.div(totalValue);
  }
  return { apy, totalValue };
};
export const getAPYAndTVLOfRastaFarms = (farm, meta) => {
  const { rastaPrice, ethPriceUsd, bnbPrice, cakePriceVsBNB } = meta;

  const cakeRewardPerBlock = RASTA_PER_BLOCK.times(farm.poolWeight)
  const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

  // cakePriceInQuote * cakeRewardPerYear / lpTotalInQuoteToken
  let apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)

  if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.UST) {
    apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken).times(bnbPrice)
  } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
    apy = rastaPrice.div(ethPriceUsd).times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)
  } else if (farm.quoteTokenSymbol === QuoteToken.RASTA) {
    apy = cakeRewardPerYear.div(farm.lpTotalInQuoteToken)
  } else if (farm.dual) {
    const cakeApy =
      farm && cakePriceVsBNB.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
    const dualApy =
      farm.tokenPriceVsQuote &&
      new BigNumber(farm.tokenPriceVsQuote)
        .times(farm.dual.rewardPerBlock)
        .times(BLOCKS_PER_YEAR)
        .div(farm.lpTotalInQuoteToken)

    apy = cakeApy && dualApy && cakeApy.plus(dualApy)
  }
  return apy
};

export const getAPYAndTVLOfRastaPools = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.rastaPerBlock || 1)
    .times(new BigNumber(farm.poolWeight))
    .div(new BigNumber(10).pow(18));
  const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR);

  let apy = cakePrice.times(cakeRewardPerYear);

  const totalValue = new BigNumber(
    farm.lpTotalInQuoteToken === "NaN" ? 0.0001 : farm.lpTotalInQuoteToken
  );

  if (totalValue.comparedTo(0) > 0) {
    apy = apy.div(totalValue);
  }

  return { apy, totalValue };
};

export const getAPYAndTVLOfPool = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.croxPerBlock || 1)
    .times(new BigNumber(farm.poolWeight))
    .div(new BigNumber(10).pow(18));
  const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR);

  let apy = cakePrice.times(cakeRewardPerYear);

  const totalValue = new BigNumber(
    farm.lpTotalInQuoteToken === "NaN" ? 0.0001 : farm.lpTotalInQuoteToken
  );

  if (totalValue.comparedTo(0) > 0) {
    apy = apy.div(totalValue);
  }

  return { apy, totalValue };
};

export const getAPYAndTVLOfDualFarm = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.rewardPerBlock || 1).div(1e18);
  const secRewardPerBlock = new BigNumber(farm.secRewardPerBlock || 1).div(
    1e18
  );
  const cakeRewardPerDuration = cakeRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));
  const secRewardPerDuration = secRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));

  let apy2 = cakePrice.times(cakeRewardPerDuration);
  let apy1 = new BigNumber(farm.tokenPrice).times(secRewardPerDuration).times(
    // eslint-disable-next-line no-restricted-properties
    Math.pow(10, farm && farm?.tokenDecimal ? 18 - farm.tokenDecimal : 0)
  );

  let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);
  if (farm.tokenSymbol === QuoteToken.BNB) {
    totalValue = totalValue.times(bnbPrice);
  } else if (farm.tokenSymbol === QuoteToken.CAKE) {
    totalValue = cakePrice.times(farm.lpTotalInQuoteToken);
  } else {
    totalValue = new BigNumber(farm.quoteTokenPrice).times(
      farm.lpTotalInQuoteToken
    );
  }

  if (totalValue.comparedTo(0) > 0) {
    apy1 = apy1.div(totalValue);
    apy2 = apy2.div(totalValue);
  }

  return { apy1, apy2, totalValue };
};

export const getAPYAndTVLofGrandPools = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const rewardTokens = farm[0].rewardTokens;
  let apys = rewardTokens.map((rewardToken) => {
    const { tokenSymbol, tokenPrice, rewardPerBlock } = rewardToken;
    const rewardPerDuration = new BigNumber(rewardPerBlock)
      .times(new BigNumber(BLOCKS_PER_DAY))
      .times(new BigNumber(365));
    return new BigNumber(tokenPrice).times(rewardPerDuration);
  })
  let totalGrandValue = cakePrice.times(farm.lpBalance).div(1e18);
  if (farm.revert) {
    totalGrandValue = new BigNumber(farm.quoteTokenPrice).times(farm.lpBalance);
  }

  if (farm.isLPToken) {
    totalGrandValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

    if (farm.tokenSymbol === QuoteToken.BNB) {
      totalGrandValue = totalGrandValue.times(bnbPrice);
    } else if (farm.tokenSymbol === QuoteToken.CAKE) {
      totalGrandValue = cakePrice.times(farm.lpTotalInQuoteToken);
    } else {
      totalGrandValue = new BigNumber(farm.quoteTokenPrice).times(
        farm.lpTotalInQuoteToken
      );
    }
  }
  if (totalGrandValue.comparedTo(0) > 0) {
    apys = apys.map((apy) => {
      return apy.div(totalGrandValue);
    })
  }
  return { apys, totalGrandValue };
}

export const getAPYAndTVLOfCroxmasPools = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.rewardPerBlock || 1).div(1e18);
  const secRewardPerBlock = new BigNumber(farm.secRewardPerBlock || 1).div(1e18);
  const rewardPerDuration = cakeRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));
  const secRewardPerDuration = secRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));

  let apy1 = new BigNumber(farm.tokenPrice).times(rewardPerDuration)
  let apy2 = new BigNumber(farm.tokenPrice).times(secRewardPerDuration).times(
    // eslint-disable-next-line no-restricted-properties
    Math.pow(10, farm?.lpTokenDecimal ? 18 - farm.lpTokenDecimal : 0)
  );

  if (farm.tokenSymbol === 'CNR' && farm.lpSymbol === 'CROX') {
    apy1 = new BigNumber(farm.tokenPrice).times(rewardPerDuration).times(10 ** 10);
  }

  if (farm.tokenSymbol === 'CNS' && farm.lpSymbol === 'CROX') {
    apy1 = new BigNumber(farm.tokenPrice).times(rewardPerDuration).times(10 ** 10);
  }

  if (farm.rewardTokenSymbol) {
    apy2 = new BigNumber(farm.rewardTokenPrice).times(secRewardPerDuration);
  }

  if (!farm.isDualFarm) {
    apy2 = new BigNumber(0);
  }

  let totalValue = cakePrice.times(farm.lpBalance);

  if (farm.revert) {
    totalValue = new BigNumber(farm.quoteTokenPrice).times(farm.lpBalance);
  }

  if (farm.isLPToken) {
    totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

    if (farm.tokenSymbol === QuoteToken.BNB) {
      totalValue = totalValue.times(bnbPrice);
    } else if (farm.tokenSymbol === QuoteToken.CAKE) {
      totalValue = cakePrice.times(farm.lpTotalInQuoteToken);
    } else {
      totalValue = new BigNumber(farm.quoteTokenPrice).times(
        farm.lpTotalInQuoteToken
      );
    }
  }

  if (totalValue.comparedTo(0) > 0) {
    apy1 = apy1.div(totalValue);
    apy2 = apy2.div(totalValue);
  }
  return { apy1, apy2, totalValue };
};

export const getAPYAndTVLOfNGPool = (farm, meta) => {
  const { cakePrice, bnbPrice } = meta;
  const cakeRewardPerBlock = new BigNumber(farm.rewardPerBlock || 1).div(1e18);
  const secRewardPerBlock = new BigNumber(farm.secRewardPerBlock || 1).div(1e8);

  const cakeRewardPerDuration = cakeRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));
  const secRewardPerDuration = secRewardPerBlock
    .times(new BigNumber(BLOCKS_PER_DAY))
    .times(new BigNumber(365));

  let apy1 = new BigNumber(farm.tokenPrice).times(cakeRewardPerDuration).times(
    // eslint-disable-next-line no-restricted-properties
    Math.pow(10, farm?.tokenDecimal ? 18 - farm.tokenDecimal : 0)
  );

  let apy2 = new BigNumber(farm.tokenPrice).times(secRewardPerDuration).times(
    // eslint-disable-next-line no-restricted-properties
    Math.pow(10, farm?.tokenDecimal ? 18 - farm.tokenDecimal : 0)
  );

  let totalValue = cakePrice.times(farm.lpBalance);
  if (farm.lpSymbol !== 'CROX') {
    totalValue = new BigNumber(farm.tokenPrice).times(farm.lpBalance)
  }
  if (farm.isLPToken) {
    totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

    if (farm.tokenSymbol === QuoteToken.BNB) {
      totalValue = totalValue.times(bnbPrice);
    } else if (farm.tokenSymbol === QuoteToken.CAKE) {
      totalValue = cakePrice.times(farm.lpTotalInQuoteToken);
    } else {
      totalValue = new BigNumber(farm.quoteTokenPrice).times(
        farm.lpTotalInQuoteToken
      );
    }
  }
  if (totalValue.comparedTo(0) > 0) {
    apy1 = apy1.div(totalValue);
    apy2 = apy2.div(totalValue);
  }
  return { apy1, apy2, totalValue };
};
