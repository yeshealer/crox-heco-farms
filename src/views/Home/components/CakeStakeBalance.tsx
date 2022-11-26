import React from 'react'
import { Text } from 'crox-new-uikit'
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js'
import CardValue from './CardValue'

const CakeStakeBalance = ({stakeValue, isInvestor}) => {
  const { account } = useWeb3React()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ textAlign: 'center' }}>
          LOCKED
      </Text>
    )
  }

  return isInvestor ? <CardValue value={stakeValue} fontSize="14px" /> : <CardValue value={stakeValue} />
}

export default CakeStakeBalance
