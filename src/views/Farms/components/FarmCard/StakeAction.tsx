import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, IconButton, AddIcon, useModal, Text } from 'crox-new-uikit'
import useI18n from 'hooks/useI18n'
import { usePriceCakeBusd } from "state/hooks";
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  lpWorthValue?: any
  isTokenOnly?: boolean
  depositFeeBP?: number
  liquidityUrlPathParts?: any
  lpLabel?: any
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const BtnGrp = styled.div`
  fontSize: "20px"; 
  width: "60%"; 
  marginLeft: "15%"; 
  text-align: "center";
  @media screen and (max-width: 1000px) {
    margin: -1%;
    text-align: left;
  } 
`;

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  depositFeeBP,
  lpWorthValue,
  isTokenOnly,
  liquidityUrlPathParts,
  lpLabel
}) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} isTokenOnly={isTokenOnly} liquidityUrlPathParts={liquidityUrlPathParts} lpLabel={lpLabel} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} isWithdraw />,
  )
  const yourLPValue = stakedBalance
    ? new BigNumber(stakedBalance).div(`1e18`).times(lpWorthValue)
    : 0;

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button style={{ height: "32px", borderRadius: "5px" }} onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        <Button size="sm" style={{ borderRadius: "5px", backgroundColor: "#483f5a", height: '32px' }} onClick={onPresentWithdraw} mr="5px">
          Unstake
        </Button>
        <IconButton style={{ borderRadius: "5px", height: '32px', width: '32px' }} onClick={onPresentDeposit}>
          <AddIcon color="white" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent='space-between' alignItems='center'>
      <Flex flexDirection='column'>
        <Flex mt='3px'>
          <Text
            textTransform="uppercase"
            color="#2d74c4"
            fontSize="15px"
            pr="3px"
            bold
          >
            {tokenName}
          </Text>
          <Text textTransform="uppercase" fontSize="15px" bold>
            {TranslateString(999, "Staked")}
          </Text>
        </Flex>
        <Text fontSize="18px" bold>{displayBalance}</Text>
        <Text fontSize='18px' bold>${yourLPValue.toFixed(3)}</Text>
      </Flex>
      <BtnGrp>
        {renderStakingButtons()}
      </BtnGrp>
    </Flex>
  )
}

export default StakeAction
