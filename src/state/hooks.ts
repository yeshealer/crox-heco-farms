import BigNumber from "bignumber.js";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetCroxPrice, useGetBNBPrice } from "hooks/api";
import Axios from 'axios'
import {
  fetchFarmsPublicDataAsync,
  fetchDualFarmsPublicDataAsync,
} from "./actions";
import { State, Farm } from "./types";
import { QuoteToken } from "../config/constants/types";

const ZERO = new BigNumber(0);

export const useFetchPublicData = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync());
    dispatch(fetchDualFarmsPublicDataAsync());
  }, [dispatch]);
};

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data);
  return farms;
};

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);
  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// Dual-farms

export const useDualFarms = (single = false): Farm[] => {
  let farms = useSelector((state: State) => state.dualFarms.data);
  farms = farms.filter((it) => (single ? !it.isDualFarm : it.isDualFarm));
  return farms;
};

export const useDualFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.dualFarms.data.find(
      (f) => JSON.stringify(f.poolAddress) === JSON.stringify(pid)
    )
  );
  return farm;
};

export const useDualFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.dualFarms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useDualFarmUser = (pid) => {
  const farm = useDualFarmFromPid(pid);
  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData ? farm.userData.earnings : [0, 0],
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 4; // BUSD-BNB LP
  const farm = useFarmFromPid(pid);
  return farm && farm.tokenPriceVsQuote
    ? new BigNumber(farm.tokenPriceVsQuote)
    : ZERO;
};

export const usePriceCroxBnb = (): BigNumber => {
  const pid = 0; // BUSD-BNB LP
  const farm = useFarmFromPid(pid);
  return farm && farm.tokenPriceVsQuote
    ? new BigNumber(farm.tokenPriceVsQuote)
    : ZERO;
};

export const usePriceCakeBusd = (): BigNumber => {
  const croxprice = useRef(new BigNumber(0));
  (async () => {
    await Axios.get("https://api.coingecko.com/api/v3/simple/price?ids=croxswap&vs_currencies=usd").then(res => {
      croxprice.current = new BigNumber((res.data as any).croxswap.usd)
    })
  })
  return croxprice.current
};

export const useTotalValue = (): BigNumber => {
  const dualFarms = useDualFarms();
  const nextPools = useDualFarms(true);
  const bnbPrice = new BigNumber(useGetBNBPrice());
  const cakePrice = new BigNumber(useGetCroxPrice());
  let value = new BigNumber(0);
  for (let i = 0; i < dualFarms.length; i++) {
    const dualFarm = dualFarms[i];

    if (dualFarm.lpTotalInQuoteToken) {
      let val2;
      if (dualFarm.quoteTokenSymbol === QuoteToken.BNB) {
        val2 = bnbPrice.times(dualFarm.lpTotalInQuoteToken);
      } else if (dualFarm.quoteTokenSymbol === QuoteToken.CAKE) {
        val2 = cakePrice.times(dualFarm.lpTotalInQuoteToken);
      } else {
        val2 = dualFarm.lpTotalInQuoteToken;
      }
      value = value.plus(val2);
    }
  }
  for (let i = 0; i < nextPools.length; i++) {
    const nextPool = nextPools[i];

    if (nextPool.lpTotalInQuoteToken) {
      let val2 = cakePrice.times(nextPool.lpBalance);
      if (nextPool.lpSymbol !== 'CROX') {
        val2 = new BigNumber(nextPool.tokenPrice).times(nextPool.lpBalance)
      }
      value = value.plus(val2);
    }
  }
  return value;
};
