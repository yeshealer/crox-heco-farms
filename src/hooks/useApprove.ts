import { useCallback } from "react";
import { useWeb3React } from '@web3-react/core';
import { Contract } from "web3-eth-contract";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import {
  fetchFarmUserDataAsync,
  fetchDualFarmUserDataAsync,
} from "state/actions";
import { approve } from "utils/callHelpers";
import {
  useMasterchef,
  useCake,
  useLottery,
  useNextGenPool,
} from "./useContract";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchef();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account);
      dispatch(fetchFarmUserDataAsync(account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, lpContract, masterChefContract]);

  return { onApprove: handleApprove };
};

// Approve a NextGen
export const useDualApprove = (lpContract: Contract, poolAddress: any) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const nextGenContract = useNextGenPool(poolAddress);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, nextGenContract, account);
      dispatch(fetchDualFarmUserDataAsync(account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, lpContract, nextGenContract]);

  return { onApprove: handleApprove };
};

// Approve the lottery
export const useLotteryApprove = () => {
  const { account } = useWeb3React();
  const cakeContract = useCake();
  const lotteryContract = useLottery();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, lotteryContract, account);
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, cakeContract, lotteryContract]);

  return { onApprove: handleApprove };
};

// Approve an IFO
export const useIfoApprove = (
  tokenContract: Contract,
  spenderAddress: string
) => {
  const { account } = useWeb3React();
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.methods
        .approve(spenderAddress, ethers.constants.MaxUint256)
        .send({ from: account });
      return tx;
    } catch {
      return false;
    }
  }, [account, spenderAddress, tokenContract]);

  return onApprove;
};

// Approve an ICO
export const useSaleApprove = (
  tokenContract: Contract,
  spenderAddress: string
) => {
  const { account } = useWeb3React();
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.methods
        .approve(spenderAddress, ethers.constants.MaxUint256)
        .send({ from: account });
      return tx;
    } catch {
      return false;
    }
  }, [account, spenderAddress, tokenContract]);

  return onApprove;
};