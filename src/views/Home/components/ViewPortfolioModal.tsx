import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useWalletModal, ConnectorId, Flex, Text } from 'crox-new-uikit'
import { HiOutlineExternalLink } from 'react-icons/hi'
import getRpcUrl from "utils/getRpcUrl";
import Button from '@mui/material/Button';
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect, bsc } from "../../../utils/connector";
import LeftTabs from './LeftTabs'
import FarmIcon from "./Icon/farmIcon";
import './LeftTabs.css'

interface ViewPortfolioModalProps {
  onDismiss?: () => void;
  stakedFarmList?: any;
  stakedDualFarmList?: any;
  stakedPoolList?: any;
  stakedNextGenList?: any;
}

const StyledModal = styled.div`
  background-color: #171923;
  padding: 12px 0;
  border-radius: 10px;
  margin: 0 30px;
  text-align: center;
  width: 1100px;
  transition: all ease 200ms;
  @media screen and (max-width: 1024px) {
    width: 750px;
  }
  @media screen and (max-width: 760px) {
    width: 510px;
  }
  @media screen and (max-width: 520px) {
    width: 350px;
  }
`

const DashboardHeader = styled.div`
  background-color: #2d74c4;
  border-radius: 5px;
  padding: 12px 15px;
  width: 230px;
  color: white;
  font-size: 20px;
  margin-left: -10px;
  font-weight: 400;
`;

const HeaderGroup = styled.div`
  display: flex;
  @media screen and (max-width: 1024px) {
    display: flex;
  }
  @media screen and (max-width: 760px) {
    display: block;
  }
  @media screen and (max-width: 520px) {
    display: block;
  }
`;

const SubHeaderGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 750px;
  @media screen and (max-width: 1024px) {
    width: 530px;
  }
  @media screen and (max-width: 760px) {
    width: 510px;
  }
  @media screen and (max-width: 520px) {
    margin-top: 10px;
    width: 350px;
  }
`;

let IsConnected = false;

const ViewPortfolioModal: React.FC<ViewPortfolioModalProps> = ({
  onDismiss,
  stakedFarmList,
  stakedDualFarmList,
  stakedPoolList,
  stakedNextGenList
}) => {

  const { account, activate, deactivate, error } = useWeb3React();

  useEffect(() => {
    if (IsConnected && error) {
      if (error && error.name === "ChainUnsupportedError") {
        const { ethereum } = window as any;
        (async () => {
          try {
            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x80" }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x80",
                      chainName: "HECO chain",
                      nativeCurrency: {
                        name: "HT",
                        symbol: "HT",
                        decimals: 18,
                      },
                      rpcUrls: [getRpcUrl()],
                      blockExplorerUrls: ["https://hecoinfo.com"],
                    },
                  ],
                });
              } catch (addError: any) {
                console.error(addError);
              }
            }
          }
          activate(injected);
        })();
      }
      IsConnected = false;
    }
  }, [account, error, activate]);

  const handleLogin = (connectorId: ConnectorId) => {
    IsConnected = true;
    switch (connectorId) {

      case "bsc":
        {
          activate(bsc);
          break;
        }
      case "walletconnect":
        {
          activate(walletconnect);
          break;
        }
      default:
        activate(injected);
    }
  }

  const { onPresentNewConnectModal } = useWalletModal(
    handleLogin,
    deactivate,
    account as string
  );


  const walletTokenList = useRef([])

  function isVaildName(value) {
    return value.symbol !== 'HMDX'
  }

  useEffect(() => {
    axios.get(`https://openapi.debank.com/v1/user/token_list?chain_id=heco&id=${account}&is_all=false`).then(res => {
      walletTokenList.current = res.data as any
      walletTokenList.current.filter(isVaildName)
      walletTokenList.current.sort(function (b, a) { return a.price * a.amount - b.price * b.amount })
    })
  })

  return (
    <StyledModal>
      <Button style={{ position: "fixed", right: '50px', top: '30px', color: 'white', backgroundColor: 'transparent', boxShadow: 'none', width: '10px', fontSize: 18 }} onClick={onDismiss}>&#10006;</Button>
      <HeaderGroup>
        <DashboardHeader>
          <FarmIcon />
          Croxster Dashboard
        </DashboardHeader>
        <SubHeaderGroup>
          {!account ? (
            <Button style={{ border: '1px solid #2d74c4' }} className='AccountButton' onClick={onPresentNewConnectModal} variant='outlined'>
              <Flex alignItems='center'>
                <Text color='#2d74c4' mr='3px'>Connect Wallet</Text>
                <HiOutlineExternalLink style={{ fontSize: '20px', color: '#2d74c4' }} />
              </Flex>
            </Button>
          ) : (
            <Button style={{ border: '1px solid #2d74c4' }} className='AccountButton' href={`https://hecoinfo.com/address/${account}`} target="_blank">
              <Flex alignItems='center'>
                <Text color='#2d74c4' mr='3px'>{account.slice(0, 5)}...{account.slice(-5)}</Text>
                <HiOutlineExternalLink style={{ fontSize: '20px', color: '#2d74c4' }} />
              </Flex>
            </Button>
          )}
        </SubHeaderGroup>
      </HeaderGroup>
      <LeftTabs stakedFarmList={stakedFarmList} stakedDualFarmList={stakedDualFarmList} stakedPoolList={stakedPoolList} stakedNextGenList={stakedNextGenList} walletTokenList={walletTokenList.current} />
    </StyledModal>
  )
}

export default ViewPortfolioModal
