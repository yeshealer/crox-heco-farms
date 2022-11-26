import React, { useEffect } from 'react'
import { Button, useWalletModal, ConnectorId } from 'crox-new-uikit'
import { useWeb3React } from '@web3-react/core';
import useI18n from 'hooks/useI18n'
import getRpcUrl from "utils/getRpcUrl";
import { injected, walletconnect, bsc } from "../utils/connector";

let IsConnected = false;

const UnlockButton = (props) => {
  const TranslateString = useI18n()
  const { activate, deactivate, error, account } = useWeb3React()
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
  const { onPresentNewConnectModal } = useWalletModal(handleLogin, deactivate)

  return (
    <Button onClick={onPresentNewConnectModal} {...props}>
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
