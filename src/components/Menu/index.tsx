import React, { useContext } from 'react'
import { useWeb3React } from '@web3-react/core';
import { allLanguages } from 'config/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localisation/languageContext'
import useTheme from 'hooks/useTheme'
import { usePriceCakeBusd } from 'state/hooks'
import { injected, walletconnect, bsc } from "../../utils/connector";
import { Menu as UikitMenu, ConnectorId } from 'crox-new-uikit'
import config from './config'

const Menu = (props) => {
  const { account, activate, deactivate } = useWeb3React()
  const handleLogin = (connectorId: ConnectorId) => {
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
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()

  return (
    <UikitMenu
      account={account}
      login={handleLogin}
      logout={deactivate}
      isDark={false}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config}
      priceLink=" "
      {...props}
    />
  )
}

export default Menu
