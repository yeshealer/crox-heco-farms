import React from "react";
import { useHistory } from "react-router-dom";
import { Card, CardBody, Text, Flex, Button } from "crox-new-uikit";
import styled, { useTheme } from "styled-components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getAPYAndTVLOfPool } from "utils/defi";
import {
  usePriceCakeBusd,
  usePriceBnbBusd,
} from "../../../state/hooks";

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 15px;
  @media screen and (max-width: 750px) {
    display: block;
  }
`;

const Col = styled.div`
  // width: 25%;
  margin-right: 0px;
`;

const Content = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 0 20px;
  @media screen and (max-width: 750px) {
      display: inline-block;
      width: 100%;
      padding: 0;
  }
`;

const StyledCakeStats = styled(Card)`
  width: 100%;
  margin: auto;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  background: #2c2d3a;
  margin-bottom: 10px;
  & .swiper-button-prev:after,
  & .swiper-button-next:after {
    opacity: 0.5 !important;
    font-size: 20px !important;
  }
  @media screen and (min-width: 770px) {
    width: 80%;
}
`;

const SCSubHeading = styled(Text)`
  font-size: 25px;
  font-weight: bold;
  @media screen and (max-width: 750px) {
    text-align: center;
  }
`;

const SCTvlText = styled(Text)`
    fontSize: 15px;
    font-weight: bold;
    @media screen and (max-width: 750px) {
       text-align: center;
    }
    @media screen and (max-width: 550px) {
      font-size: 12px;
   }
`;

const BannerCard = styled.div`
  padding: 10px 20px;
  background: #3b3c4e;
  border-radius: 10px;
  display: flex;
  margin: auto;
  @media screen and (max-width: 750px) {
    justify-content: center;
 }
`;

const Title = styled(Text)`
  font-size: 18px;
  @media screen and (max-width: 750px) {
    font-size: 17px;
    margin-top: 10px;
    text-align: center;
  }
`;


const PoolBannerCard = () => {
  const { isDark } = useTheme()
  const history = useHistory();
  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();

  // const activeCroxPools = croxpools
  //   .filter((farm) => farm.multiplier !== "0X" && farm.lpSymbol === "CROX")
  //   .map((farm) => {
  //     const pidInAbs = Math.abs(farm.pid);
  //     const { apy, totalValue } = getAPYAndTVLOfPool(farm, {
  //       cakePrice,
  //       bnbPrice,
  //     });
  //     return { ...farm, apy, totalValue, pidInAbs };
  //   });

  const ismobile = useMediaQuery("(max-width: 600px)")

  const goToPool = () => {
    history.push('/hecopools')
  }

  return (
    <StyledCakeStats>
      <CardBody style={{ padding: "20px 40px 20px 30px" }}>
        <Row style={{ marginBottom: "5px" }}>
          <SCSubHeading color="#2d74c4" bold >
            Next-Generation Staking Pools
          </SCSubHeading>
        </Row>
        <Row>
          <SCTvlText mt='-5px'>
            Stake your CROX in pools to earn new tokens
          </SCTvlText>
        </Row>
        {/* {activeCroxPools &&
          activeCroxPools.length > 0 &&
          activeCroxPools.map((farm, index) => {
            return ( */}
        <Content>
          <Col>
            <BannerCard>
              <div>
                <img src="/images/farms/crox.svg" alt="crox" width={80} height={80} />
              </div>
              <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                <Text fontSize={!ismobile ? "22px" : "16px"} color="#2d74c4" bold>Native CROX Pool</Text>
                <Text fontSize={!ismobile ? "16px" : "12px"} color='white' bold>Stake CROX, Earn CROX</Text>
                <Flex justifyContent="center">
                  <Text color="#2d74c4" fontSize={!ismobile ? "18px" : "16px"} bold>APR:</Text>
                  {/* <Text color="#2d74c4" ml='3px' fontSize={!ismobile ? "18px" : "16px"} bold>{farm.apy.times(100).toFixed(2)}%</Text> */}
                  <Text color="#2d74c4" ml='3px' fontSize={!ismobile ? "18px" : "16px"} bold>100%</Text>
                </Flex>
              </Flex>
            </BannerCard>
          </Col>
          <Col>
            <div>
              <div style={{ justifyContent: "center", marginBottom: "10px" }}>
                <Title bold>Passive income forever</Title>
              </div>
              <div style={{ textAlign: "center" }}>
                <Button style={{ borderRadius: "10px", padding: "0px 40px", backgroundColor: '#2d74c4', fontSize: '18px' }} onClick={goToPool}> Earn Now </Button>
              </div>
            </div>
          </Col>
        </Content>
        {/* );
          })
        } */}
      </CardBody>
    </StyledCakeStats>
  )
}

export default PoolBannerCard;
