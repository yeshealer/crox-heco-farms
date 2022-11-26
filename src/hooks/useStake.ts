import Web3 from "web3";
import { useCallback, useState } from "react";
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from "react-redux";
import {
  fetchFarmUserDataAsync,
} from "state/actions";
import { stake } from "utils/callHelpers";
import { useMasterchef } from "./useContract";

const useStake = (pid: number) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchef();

  const handleStake = useCallback(
    async (amount: string, decimal = 18) => {
      const isValidAddress = Web3.utils.isAddress(localStorage.getItem("ref"));
      let txHash;
      if (!isValidAddress) {
        txHash = await stake(
          masterChefContract,
          pid,
          amount,
          account,
          undefined,
          decimal
        )
      }
      else {
        txHash = await stake(
          masterChefContract,
          pid,
          amount,
          account,
          localStorage.getItem("ref"),
          decimal
        )
      }
      dispatch(fetchFarmUserDataAsync(account));
      return txHash;
    },
    [account, dispatch, masterChefContract, pid]
  );
  return { onStake: handleStake };
};

export default useStake;
