import React from "react";
import useI18n from "hooks/useI18n";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { Text, Flex, Link, LinkExternal } from "crox-uikit";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import { Address } from "config/constants/types";

export interface ExpandableSectionProps {
  isTokenOnly?: boolean;
  hecoinfoaddress?: string;
  removed?: boolean;
  // totalValueFormated?: string;
  lpLabel?: string;
  lpWorth?: string;
  quoteTokenAdresses?: Address;
  quoteTokenSymbol?: string;
  tokenAddresses: Address;
  stakedBalance?: string;
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: white;
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isTokenOnly,
  hecoinfoaddress,
  removed,
  // totalValueFormated,
  lpLabel,
  lpWorth,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  stakedBalance,
}) => {
  const TranslateString = useI18n();
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAdresses,
    quoteTokenSymbol,
    tokenAddresses,
  });

  const yourLPValue = stakedBalance
    ? new BigNumber(stakedBalance).div(`1e18`).times(lpWorth)
    : 0;

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <StyledLinkExternal
          href={
            isTokenOnly
              ? `https://exchange.croxswap.com/#/swap/${tokenAddresses[process.env.REACT_APP_CHAIN_ID]
              }`
              : `https://exchange.croxswap.com/#/add/${liquidityUrlPathParts}`
          }
        >
          {lpLabel}
        </StyledLinkExternal>
      </Flex>
      <Flex justifyContent="flex-start">
        <Link external href={hecoinfoaddress} bold={false} color="white">
          {TranslateString(356, "View on Hecochain")}
        </Link>
      </Flex>
    </Wrapper>
  );
};

export default DetailsSection;
