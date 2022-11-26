import { useCallback } from "react";
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from "react-redux";
import { fetchFarmUserDataAsync } from "state/actions";
import { nextUnstake } from "utils/callHelpers";
import { useNextGenPool } from "./useContract";

const useDualUnstake = (poolAddress: any) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const nextGenContract = useNextGenPool(poolAddress);

  const handleUnstake = useCallback(
    async (amount: string, decimal = 18) => {
      const txHash = await nextUnstake(nextGenContract, amount, account, decimal);
      dispatch(fetchFarmUserDataAsync(account));
      return txHash;
    },
    [account, dispatch, nextGenContract]
  );

  return { onDualUnstake: handleUnstake };
};

export default useDualUnstake;
