import { useEffect, useState } from "react";
import { AbiItem } from "web3-utils";
import { ContractOptions } from "web3-eth-contract";
import useWeb3 from "hooks/useWeb3";
import {
  getMasterChefAddress,
  getCakeAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getPrevMasterChefAddress,
} from "utils/addressHelpers";
import ifo from "config/abi/ifo.json";
import erc20 from "config/abi/erc20.json";
import rabbitmintingfarm from "config/abi/rabbitmintingfarm.json";
import pancakeRabbits from "config/abi/pancakeRabbits.json";
import lottery from "config/abi/lottery.json";
import lotteryTicket from "config/abi/lotteryNft.json";
import masterChef from "config/abi/masterchef.json";
import prevMasterChef from "config/abi/prevmasterchef.json";
import nextGenPool from "config/abi/nextGenPool.json";
import wsow from "config/abi/wsow.json";
import nextGenPoolNew from "config/abi/nextGenPoolNew.json";
import tokenSale from "config/abi/tokensale.json";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

const useContract = (
  abi: AbiItem,
  address: string,
  contractOptions?: ContractOptions
) => {
  const web3 = useWeb3();
  const [contract, setContract] = useState(
    new web3.eth.Contract(abi, address, contractOptions)
  );

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address, contractOptions));
  }, [abi, address, contractOptions, web3]);

  return contract;
};

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const ifoAbi = (ifo as unknown) as AbiItem;
  return useContract(ifoAbi, address);
};

export const useERC20 = (address: string) => {
  const erc20Abi = (erc20 as unknown) as AbiItem;
  return useContract(erc20Abi, address);
};

export const useTokenSale = (address: string) => {
  const tokenSaleAbi = (tokenSale as unknown) as AbiItem;
  return useContract(tokenSaleAbi, address);
};

export const useCake = () => {
  return useERC20(getCakeAddress());
};

export const useRabbitMintingFarm = (address: string) => {
  const rabbitMintingFarmAbi = (rabbitmintingfarm as unknown) as AbiItem;
  return useContract(rabbitMintingFarmAbi, address);
};

export const usePancakeRabbits = (address: string) => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem;
  return useContract(pancakeRabbitsAbi, address);
};

export const useLottery = () => {
  const abi = (lottery as unknown) as AbiItem;
  return useContract(abi, getLotteryAddress());
};

export const useLotteryTicket = () => {
  const abi = (lotteryTicket as unknown) as AbiItem;
  return useContract(abi, getLotteryTicketAddress());
};

export const useMasterchef = () => {
  const abi = (masterChef as unknown) as AbiItem;
  return useContract(abi, getMasterChefAddress());
};

export const useNextGenPool = (poolAddress, newOne = false) => {
  const abi = (newOne ? nextGenPoolNew : (nextGenPool as unknown)) as AbiItem;
  return useContract(abi, poolAddress[CHAIN_ID]);
};

export const useXpadContract = (poolAddress) => {
  const abi = (wsow as unknown) as AbiItem;
  return useContract(abi, poolAddress);
};

export const usePrevMasterchef = () => {
  const abi = (prevMasterChef as unknown) as AbiItem;
  return useContract(abi, getPrevMasterChefAddress());
};

export default useContract;
