import { useCallback } from "react";
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from "react-redux";
import {
  fetchFarmUserDataAsync,
} from "state/actions";
import {
  unstake,
  prevunstake,
} from "utils/callHelpers";
import { useMasterchef, usePrevMasterchef } from "./useContract";

const useUnstake = (pid: number) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchef();

  const handleUnstake = useCallback(
    async (amount: string, decimal = 18) => {
      const txHash = await unstake(
        masterChefContract,
        pid,
        amount,
        account,
        decimal
      );
      dispatch(fetchFarmUserDataAsync(account));
      return txHash;
    },
    [account, dispatch, masterChefContract, pid]
  );

  return { onUnstake: handleUnstake };
};

export const usePrevUnstake = (pid: number) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = usePrevMasterchef();

  const handleUnstake = useCallback(async () => {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call();
    const txHash = await prevunstake(masterChefContract, pid, amount, account);
    dispatch(fetchFarmUserDataAsync(account));
    console.info(txHash);
  }, [account, dispatch, masterChefContract, pid]);

  return { onPrevUnstake: handleUnstake };
};

export default useUnstake;
