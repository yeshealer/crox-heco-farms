import { useEffect, useRef, useState } from "react";
import BigNumber from "bignumber.js";
import { useWeb3React } from '@web3-react/core';
import { provider } from "web3-core";
import cakeABI from "config/abi/cake.json";
import { getContract } from "utils/web3";
import { getTokenBalance } from "utils/erc20";
import { getCakeAddress, getMasterChefAddress } from "utils/addressHelpers";
import dualFarms from "config/constants/dualFarms";
import useRefresh from "./useRefresh";

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const {
    account,
    library
  } = useWeb3React();
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(library.provider, tokenAddress, account);
      setBalance(new BigNumber(res));
    };

    if (account && library) {
      fetchBalance();
    }
  }, [account, library, tokenAddress, fastRefresh]);

  return balance;
};

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getContract(cakeABI, getCakeAddress());
      const supply = await cakeContract.methods.totalSupply().call();
      setTotalSupply(new BigNumber(supply));
    }

    fetchTotalSupply();
  }, [slowRefresh]);

  return totalSupply;
};

export const useTotalStakedSupply = () => {
  const { slowRefresh } = useRefresh();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getContract(cakeABI, getCakeAddress());
      const func = [];
      func.push(cakeContract.methods.balanceOf('0xa9b1a527f2e77b0ae670d61a997f3b3585ba0c1d').call());

      for (let i = 0; i < dualFarms.length; i++) {
        func.push(
          cakeContract.methods
            .balanceOf(dualFarms[i].lpAddresses[process.env.REACT_APP_CHAIN_ID])
            .call()
        );
      }
      const response = await Promise.all(func);
      let supply = new BigNumber(0);
      for (let i = 0; i < response.length; i++) {
        supply = new BigNumber(supply).plus(new BigNumber(response[i]));
      }
      setTotalSupply(new BigNumber(supply));
    }

    fetchTotalSupply();
  }, [slowRefresh]);

  return totalSupply;
};

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      const cakeContract = getContract(cakeABI, getCakeAddress());
      const bal = await cakeContract.methods
        .balanceOf("0x000000000000000000000000000000000000dEaD")
        .call();
      setBalance(new BigNumber(bal));
    };

    fetchBalance();
  }, [tokenAddress, slowRefresh]);

  return balance;
};

export default useTokenBalance;
