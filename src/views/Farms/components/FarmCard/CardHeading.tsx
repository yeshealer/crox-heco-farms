import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image, Text } from 'crox-new-uikit'
import { CommunityTag, CoreTag, NoFeeTag, RiskTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  risk?: number
  depositFee?: number
  farmImage?: string
  removed?: boolean
  tokenSymbol?: string
}

const Wrapper = styled(Flex)`
  width: 18%;
  svg {
    margin-right: 0.25rem;
  }
  @media screen and (max-width: 1000px) {
    width: 30%;
    margin: 0 !important;
    float: left;
  } 
  @media screen and (max-width: 550px) {
    width: 40%;
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
  font-size: 20px;
  @media screen and (max-width: 1000px) {
    font-size: 18px;
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
  removed,
  multiplier,
  risk,
  farmImage,
  tokenSymbol,
  depositFee,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center">
      <TokenImg><img src={`/images/farms/${farmImage}.svg`} className="img" alt={tokenSymbol} width={50} height={50} /></TokenImg>
      <TokenFee>
        <Flex flexDirection="column" alignItems="flex-end">
          <TokenName>{lpLabel}</TokenName>
        </Flex>
        {!removed ? (
          <CakeLP>
            <CakeBorder>Cake LP</CakeBorder>
          </CakeLP>
        ) : <div />
        }
      </TokenFee>
    </Wrapper>
  )
}

export default CardHeading
