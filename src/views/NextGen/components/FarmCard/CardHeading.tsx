import React from "react";
import styled from "styled-components";
import { Tag, Flex, Heading, Image, Text } from "crox-new-uikit";
import {
  CommunityTag,
  CoreTag,
  NoFeeNoIconTag,
  RiskTag,
} from "components/Tags";

export interface ExpandableSectionProps {
  lpLabel?: string;
  lpSymbol?: string;
  lpSubLabel?: string;
  multiplier?: string;
  risk?: number;
  depositFee?: number;
  farmImage?: string;
  tokenSymbol?: string;
  lpType?: string;
  isDualFarm?: boolean;
}

const Wrapper = styled(Flex)`
  width: 20%;
  @media screen and (max-width: 1000px) {
    width: 30%;
    margin: 0 !important;
    float: left;
  } 
  @media screen and (max-width: 550px) {
    width: 45%;
    margin: 0 !important;
    float: left;
  } 
`

const TokenFee = styled.div`
  @media screen and (max-width: 1000px) {
    width: 100%;
    font-size: 12px;
  }
`;

const TokenName = styled.div`
  color: #c9c4d4;
  font-weight: bold;
  font-size: 17px;
  @media screen and (max-width: 1000px) {
    font-size: 16px;
    width: 100%;
  }
`;

const TokenSubName = styled.div`
  font-size: 15px;
  @media screen and (max-width: 1000px) {
    font-size: 12px;
    width: 100%;
  }
`;

const CakeLP = styled.div`
    display: none;
    @media screen and (max-width: 550px) {
      font-size: 15px;
      display: inline-table;
    }
`;

const CakeBorder = styled.div`
    width: 70px;
    border-radius: 20px;
    color: #2d74c4;
    border: 2px solid #2d74c4;
`;

const FeeIco = styled.div`
  margin: 0 22px;
  @media screen and (max-width: 1000px) {
    font-size: 12px;
  }
`;

const TokenImg = styled.div`
  @media screen and (max-width: 1000px) {
    width: 100px;
  }
`;

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  lpSubLabel,
  farmImage,
  tokenSymbol,
  isDualFarm
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center">
      <TokenImg><img src={`/images/farms/${farmImage}.svg`} className="img" alt={tokenSymbol} width={50} height={50} /></TokenImg>
      <TokenFee>
        <Flex flexDirection="column" alignItems="flex-end" justifyContent='center'>
          {!isDualFarm ? (<TokenName>EARN {lpLabel}</TokenName>) : (<TokenName>{lpLabel}</TokenName>)}
          {!isDualFarm && (<TokenSubName>{lpSubLabel}</TokenSubName>)}
        </Flex>
        {tokenSymbol ? (
          <CakeLP>
            <CakeBorder>{tokenSymbol}</CakeBorder>
          </CakeLP>
        ) : ("")}
      </TokenFee>
    </Wrapper>
  );
};

export default CardHeading;
