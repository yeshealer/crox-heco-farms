import { useCallback } from "react";
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from "react-redux";
import {
  fetchFarmUserDataAsync,
  fetchDualFarmUserDataAsync,
} from "state/actions";
import {
  harvest,
  nextHarvest,
  xpadHarvest,
  compound,
} from "utils/callHelpers";
import { useMasterchef, useNextGenPool, useXpadContract } from "./useContract";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchef();

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account);
    dispatch(fetchFarmUserDataAsync(account));
    return txHash;
  }, [account, dispatch, farmPid, masterChefContract]);

  return { onReward: handleHarvest };
};

export const useDualHarvest = (poolAddress) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const nextGenContract = useNextGenPool(poolAddress);

  const handleHarvest = useCallback(async () => {
    const txHash = await nextHarvest(nextGenContract, account);
    dispatch(fetchDualFarmUserDataAsync(account));
    return txHash;
  }, [account, dispatch, nextGenContract]);

  return { onReward: handleHarvest };
};

export const useXpadHarvest = (poolAddress) => {
  const { account } = useWeb3React();
  const XpadContract = useXpadContract(poolAddress);
  const handleHarvest = useCallback(async () => {
    const txHash = await xpadHarvest(XpadContract, account);
    return txHash;
  }, [account, XpadContract]);

  return { onReward: handleHarvest };
};

export const useCompound = (farmPid: number) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchef();

  const handleCompound = useCallback(async () => {
    const txHash = await compound(masterChefContract, farmPid, account);
    dispatch(fetchFarmUserDataAsync(account));
    return txHash;
  }, [account, dispatch, farmPid, masterChefContract]);

  return { onCompound: handleCompound };
};

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWeb3React();
  const masterChefContract = useMasterchef();

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)];
    }, []);

    return Promise.all(harvestPromises);
  }, [account, farmPids, masterChefContract]);

  return { onReward: handleHarvest };
};
