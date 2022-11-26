import React from "react";
import useI18n from "hooks/useI18n";
import styled from "styled-components";
import { Text, Flex, Link, LinkExternal } from "crox-uikit";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import { Address } from "config/constants/types";
import BigNumber from "bignumber.js";
import { usePriceCakeBusd } from "state/hooks";

export interface ExpandableSectionProps {
  isLPToken?: boolean;
  isDualFarm?: boolean;
  hecoinfoaddress?: string;
  removed?: boolean;
  lpLabel?: string;
  lpWorth?: string;
  projectLink?: string;
  depositLink?: string;
  bonusEndBlock?: any;
  stakedBalance?: string;
  redeemableAmount?: string;
  isWhalePool?: boolean;
  isShrimpPool?: boolean;
  tokenDecimal?: number;
  tokenSymbol?: string;
  reward1?: number;
  reward2?: number;
}

const Wrapper = styled.div`
  padding-top: 0px;
  display: flex;
  width: 46%;
  @media screen and (max-width: 1000px) {
    text-align: -webkit-center;
    width: 100%;
    display: inline-block;
  }
`;

const DepositContainer = styled.div`
  width: 100%;
  border: 1px solid #2c2d3a;
  border-radius: 10px;
  padding: 15px;
  margin: 0 2%;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 1%;
    padding: 15px;
  }
`;

const DetailContainer = styled.div`
  padding: 2%;
  width: 90%;
  @media screen and (max-width: 1000px) {
    text-align: center;
    width: 98%;
    margin: 1%;
  }
`;

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isDualFarm,
  hecoinfoaddress,
  removed,
  lpLabel,
  lpWorth,
  depositLink,
  bonusEndBlock,
  projectLink,
  isLPToken,
  stakedBalance,
  tokenSymbol,
  tokenDecimal,
  redeemableAmount,
  isWhalePool,
  isShrimpPool,
  reward1,
  reward2,
}) => {
  const cakePriceUsd = usePriceCakeBusd();
  const TranslateString = useI18n();
  let yourLPValue = stakedBalance
    ? new BigNumber(stakedBalance).div(`1e${tokenDecimal ?? 18}`).times(lpWorth)
    : 0;

  if (!isLPToken && !isDualFarm) {
    yourLPValue = stakedBalance
      ? new BigNumber(stakedBalance).div(`1e18`).times(cakePriceUsd)
      : 0;
  }

  const redeemable = redeemableAmount
    ? new BigNumber(redeemableAmount).div("1e18")
    : 0;

  return (
    <Wrapper>
      {isDualFarm || isLPToken ? (
        <DepositContainer>
          {!removed && (
            <Flex justifyContent="space-between">
              <Text fontSize="15px" bold>{TranslateString(23, "Rewards End Block")}:</Text>
              <LinkExternal href={`https://hecoinfo.com/block/${bonusEndBlock}`}>{bonusEndBlock}</LinkExternal>
            </Flex>
          )}
          {!removed && (
            <Flex justifyContent="space-between">
              <Text fontSize="15px" bold>Total Rewards</Text>
              <Flex flexDirection="column">
                {reward1 && <Text fontSize="15px" bold style={{textAlign: "right"}}>{reward1} CROX</Text>}
                {reward2 && (<Text fontSize="15px" bold style={{textAlign: "right"}}>{`${reward2} ${tokenSymbol}`} </Text>)}
              </Flex>
            </Flex>
          )}
          {!removed && (isDualFarm || isLPToken) && (
            <Flex justifyContent="space-between">
              <Text fontSize="15px" bold>Withdrawable LP:</Text>
              <Text fontSize="15px" bold>{redeemable.toFixed(3)}</Text>
            </Flex>
          )}
        </DepositContainer>
      ) : (
        <DepositContainer>
          {!removed && (
            <Flex justifyContent="space-between">
              <Text>
                {TranslateString(23, "Rewards End Block")}:
              </Text>
              <LinkExternal
                href={`https://hecoinfo.com/block/${bonusEndBlock}`}
              >
                {bonusEndBlock}
              </LinkExternal>
            </Flex>
          )}
          {!removed && (
            <Flex justifyContent="space-between">
              <Text>Total Rewards</Text>
              {(isWhalePool || isShrimpPool) ? (
                <Flex flexDirection="column">
                  {reward1 && <Text>{reward1} CRUSH</Text>}
                  {reward2 && (
                    <Text>{reward2} CNR</Text>
                  )}
                </Flex>
              ) : (
                <Flex flexDirection="column">
                  {reward1 && <Text>{reward1} CROX</Text>}
                  {reward2 && (
                    <Text>{`${reward2} ${tokenSymbol}`} </Text>
                  )}
                </Flex>
              )}
            </Flex>
          )}
        </DepositContainer>
      )}
      {isDualFarm || isLPToken ? (
        <DetailContainer>
          <Flex justifyContent="space-between">
            <LinkExternal href={depositLink} fontSize="18px">Get {lpLabel}</LinkExternal>
          </Flex>
          <Flex justifyContent="flex-start">
            <Link external href={hecoinfoaddress} bold fontSize="18px">
              {TranslateString(356, "View on Hecochain")}
            </Link>
          </Flex>
          <Flex justifyContent="flex-start">
            <Link external href={projectLink} bold fontSize="18px">
              View Project Site
            </Link>
          </Flex>
        </DetailContainer>
      ) : (
        <DetailContainer>
          <Flex justifyContent="space-between">
            <LinkExternal fontSize="18px" bold href={depositLink}>Get {lpLabel}</LinkExternal>
          </Flex>
          <Flex justifyContent="flex-start">
            <Link external href={projectLink} bold fontSize="18px">
              View Project Site
            </Link>
          </Flex>
        </DetailContainer>
      )}
    </Wrapper>
  );
};

export default DetailsSection;
