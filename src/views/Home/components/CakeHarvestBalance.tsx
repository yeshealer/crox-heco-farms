import React from 'react'
import { Text } from 'crox-new-uikit'
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import useAllEarnings from 'hooks/useAllEarnings'
import CardValue from './CardValue'

const CakeHarvestBalance = ({earningsSum, isInvestor}) => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ textAlign: 'center' }}>
        {TranslateString(298, 'Locked')}
      </Text>
    )
  }

  return isInvestor ? <CardValue value={earningsSum} fontSize="14px" /> : <CardValue value={earningsSum} />
}

export default CakeHarvestBalance
