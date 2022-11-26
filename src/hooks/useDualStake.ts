import Web3 from "web3";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from '@web3-react/core';

import { fetchDualFarmUserDataAsync } from "state/actions";
import { nextStake } from "utils/callHelpers";
import { useNextGenPool } from "./useContract";

const useDualStake = (poolAddress: any) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const nextGenContract = useNextGenPool(poolAddress);

  const handleStake = useCallback(
    async (amount: string, decimal = 18) => {
      const txHash = await nextStake(nextGenContract, amount, account, decimal);
      dispatch(fetchDualFarmUserDataAsync(account));
      return txHash;
    },
    [account, dispatch, nextGenContract]
  );

  return { onDualStake: handleStake };
};

export default useDualStake;
