import React, { useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { usePriceCakeBusd } from "state/hooks";
import {
  Button,
  Text,
  Flex,
  Heading,
  IconButton,
  AddIcon,
  useModal,
} from "crox-new-uikit";
import useI18n from "hooks/useI18n";
import useDualStake from "hooks/useDualStake";
import useDualUnstake from "hooks/useDualUnstake";
import { getBalanceNumber } from "utils/formatBalance";
import { useGetCroxPrice } from "hooks/api";
import DepositModal from "../DepositModal";
import WithdrawModal from "../WithdrawModal";
import './farmcard.css'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber;
  tokenBalance?: BigNumber;
  tokenName?: string;
  pid?: number;
  depositFeeBP?: number;
  withdrawModalHint?: string;
  withdrawFee?: number;
  minFirstDeposit?: number;
  depositLink?: any
  lpLabel?: any
  isDualFarm?: boolean;
  lpWorthValue?: any;
  isLPToken?: boolean;
  secondSymbol?: string;
  tokenDecimal?: number;
  isShrimpPool?: boolean;
  isWhalePool?: boolean;
  minStaking?: number;
  removed?: boolean;
  maxstakedBalance?: number
}

const IconButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  text-align: left;
  svg {
    width: 20px;
  }
`;

const BtnGrp = styled.div`
  font-size: 20px;
  display: flex;
  text-align: center;
  flex-direction: column;
  @media screen and (max-width: 1000px) {
    text-align: left;
    flex-direction: column;
  }
`;

const APRInfo = styled.div`
  position: absolute;
  padding: 10px;
  text-align: left;
  width: 400px;
  background: #2d74c4;
  left: 100%;
  top: -140%;
  z-index: 10;
  @media screen and (max-width: 1000px) {
    left: -155%;
  }
  @media screen and (max-width: 550px) {
    left: -62%;
    width: 250px;
  }
`;

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  depositFeeBP,
  withdrawModalHint,
  withdrawFee,
  minFirstDeposit,
  isDualFarm,
  lpWorthValue,
  lpLabel,
  isLPToken,
  depositLink,
  tokenDecimal,
  secondSymbol,
  isShrimpPool,
  isWhalePool,
  minStaking,
  removed,
  maxstakedBalance
}) => {
  const TranslateString = useI18n();
  const { onDualStake } = useDualStake(pid);
  const { onDualUnstake } = useDualUnstake(pid);

  const rawStakedBalance = getBalanceNumber(stakedBalance);
  const displayBalance = rawStakedBalance.toLocaleString();

  const [onPresentDeposit] = useModal(
    <DepositModal
      maxstakedBalance={maxstakedBalance}
      max={tokenBalance}
      onConfirm={onDualStake}
      tokenName={tokenName}
      depositFeeBP={depositFeeBP}
      depositLink={depositLink}
      minFirstDeposit={minFirstDeposit}
      stakedBalance={stakedBalance}
      isDualFarm={isDualFarm}
      tokenDecimal={tokenDecimal}
      isWhalePool={isWhalePool}
      isShrimpPool={isShrimpPool}
    />
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onDualUnstake}
      tokenName={tokenName}
      tokenDecimal={tokenDecimal}
      withdrawModalHint={withdrawModalHint}
    />
  );
  const cakePriceUsd_raw = useGetCroxPrice();
  const cakePriceUsd = new BigNumber(cakePriceUsd_raw);

  const [hover, setHover] = useState(false);

  let yourLPValue = stakedBalance
    ? new BigNumber(stakedBalance).div(`1e18`).times(lpWorthValue)
    : 0;

  if (!isLPToken && !isDualFarm) {
    yourLPValue = stakedBalance
      ? new BigNumber(stakedBalance).div(`1e18`).times(cakePriceUsd)
      : 0;
  }

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <>
        {minFirstDeposit && (
          <Text color="#2d74c4" fontSize="12px" mt='-15px'>Min Stake Limit: {minFirstDeposit} {lpLabel}</Text>
        )}
        <Button style={{ height: "32px", borderRadius: "5px" }} fullWidth onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
      </>
    ) : (
      <>
        {minFirstDeposit && (
          <Text color="#2d74c4" fontSize="12px" mt='-15px'>Min Stake Limit: {minFirstDeposit} {lpLabel}</Text>
        )}
        <IconButtonWrapper>
          <Button size="sm" style={{ borderRadius: "5px", backgroundColor: "#483f5a", height: '32px', fontSize: '16px' }} onClick={onPresentWithdraw} mr="5px">
            Unstake
          </Button>
          <IconButton style={{ borderRadius: "5px", height: '32px', width: '32px' }} onClick={onPresentDeposit}>
            <AddIcon color="text" />
          </IconButton>
        </IconButtonWrapper>
        {(isDualFarm || secondSymbol === "GREM") && !removed && (
          <Flex
            alignItems="center"
            justifyContent="flex-start"
            style={{ position: "relative" }}
          >
            <Text fontSize="12px" color="white">Early Withdrawal Fee: {withdrawFee || 10}% LP</Text>
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                marginLeft: 4,
                marginBottom: 2,
              }}
              onClick={() => setHover(true)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <path
                d="M6 0.6875C2.78906 0.6875 0.1875 3.3125 0.1875 6.5C0.1875 9.71094 2.78906 12.3125 6 12.3125C9.1875 12.3125 11.8125 9.71094 11.8125 6.5C11.8125 3.3125 9.1875 0.6875 6 0.6875ZM6 3.26562C6.53906 3.26562 6.98438 3.71094 6.98438 4.25C6.98438 4.8125 6.53906 5.23438 6 5.23438C5.4375 5.23438 5.01562 4.8125 5.01562 4.25C5.01562 3.71094 5.4375 3.26562 6 3.26562ZM7.3125 9.21875C7.3125 9.38281 7.17188 9.5 7.03125 9.5H4.96875C4.80469 9.5 4.6875 9.38281 4.6875 9.21875V8.65625C4.6875 8.51562 4.80469 8.375 4.96875 8.375H5.25V6.875H4.96875C4.80469 6.875 4.6875 6.75781 4.6875 6.59375V6.03125C4.6875 5.89062 4.80469 5.75 4.96875 5.75H6.46875C6.60938 5.75 6.75 5.89062 6.75 6.03125V8.375H7.03125C7.17188 8.375 7.3125 8.51562 7.3125 8.65625V9.21875Z"
                fill="white"
              />
            </svg>
            {hover && (
              <APRInfo>
                <Text fontSize="12px" color="white">{withdrawFee || 10}% unstaking Penalty if withdrawn before {minStaking || 30} days or Rewards End Block.</Text>
                <Text fontSize="12px" color="white">No fees after {minStaking || 30}days or Pool End Date.</Text>
                <Text fontSize="12px" color="white">Fees charged will be used to Buy Back & Burn CROX</Text>
              </APRInfo>
            )}
          </Flex>
        )}

      </>
    );
  };

  return (
    <Flex justifyContent="space-between" alignItems="space-between" flexDirection='column'>
      <Flex style={{ width: 'max-content' }} justifyContent='center' mt='3px'>
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
      <Flex justifyContent='space-between' mt='5px'>
        <Flex flexDirection='column'>
          <Text fontSize="18px" bold>
            {displayBalance}
          </Text>
          {isDualFarm && (<Text style={{ fontWeight: "initial" }} fontSize="18px" bold>${yourLPValue.toFixed(3)}</Text>)}
        </Flex>
        <BtnGrp>
          {renderStakingButtons()}
        </BtnGrp>
      </Flex>
    </Flex>
  );
};

export default StakeAction;
