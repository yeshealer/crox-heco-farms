/* eslint-disable */
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardBody, Text } from "crox-new-uikit";
import { useMatchBreakpoints } from "crox-uikit";
import BigNumber from 'bignumber.js';
import styled from "styled-components";
import useTheme from "hooks/useTheme";
import { GiThumbUp, GiNewShoot } from 'react-icons/gi'
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetBNBPrice, useGetCroxPrice } from "hooks/api";
import {
  getAPYAndTVLOfDualFarm,
} from "utils/defi";
import {
  usePriceBnbBusd,
  useDualFarms,
} from "../../../state/hooks";
import "./TopFarm.scss";

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
`;

const TopFarm = styled.div`
  text-align: center;
  width: 85%;
  margin: auto;
`;

const Col = styled.div`
  // width: 25%;
  margin-right: 0px;
`;

const Content = styled.div`
  display: block;
  width: 60%;
  text-align: center;
`;

const EarnTag = styled.div`
  background: #2c2d3a;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 2px solid #3b3c4e;
`

const SymbolText = styled(Text)`
  border-bottom: 2px solid #3b3c4e;
  color: white;
`

const StyledCakeStats = styled(Card)`
  border: 2px solid #3b3c4e;
  background: #2c2d3a;
  margin: 10px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  & .swiper-button-prev:after,
  & .swiper-button-next:after {
    opacity: 0.5 !important;
    font-size: 20px !important;
  }
`;

export interface FarmsProps {
  tokenMode?: boolean;
}

const TwitterCard = () => {
  const history = useHistory();
  const dualfarms = useDualFarms();
  const cakePrice_raw = useGetCroxPrice();
  const cakePrice = new BigNumber(cakePrice_raw)
  const bnbPrice_raw = useGetBNBPrice();
  const bnbPrice = new BigNumber(bnbPrice_raw)
  const { isMd, isSm, isXs } = useMatchBreakpoints();
  const { isDark } = useTheme()

  const activeDualFarms = dualfarms
    .filter((it) => (it as any).active)
    .map((farm) => {
      let pidInAbs = Math.abs(farm.pid);
      const { apy1, apy2, totalValue } = getAPYAndTVLOfDualFarm(farm, {
        cakePrice,
        bnbPrice,
      });
      return { ...farm, apy: apy1.plus(apy2), totalValue, pidInAbs };
    });
  const goToDualFarm = () => {
    history.push('/hecofarms');
  }

  return (
    <>
      {!isMd && !isSm && !isXs ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            flex: "auto",
          }}
        >
          <div className="twitter">
            <div className="twitter__price-tag" style={{ top: "0px", left: "0px" }}>
              <GiThumbUp />
              <p className="twitter__price-tag-price">TOP FARMS</p>
            </div>
          </div>
          <StyledCakeStats style={{ marginBottom: "10px" }}>
            <CardBody style={{ padding: "12px 0" }}>
              <div
                style={{
                  width: "100%",
                  marginRight: "20px",
                  zIndex: 0,
                }}
              >
                <Swiper
                  navigation={true}
                  loop={true}
                  className="mySwiper"
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {activeDualFarms &&
                    activeDualFarms.length > 0 &&
                    activeDualFarms.sort((a, b) =>
                      a && b ? (a.apy.isGreaterThan(b.apy) ? -1 : 1) : 1
                    ) &&
                    activeDualFarms.slice(0, 2).map((farm, index) => {

                      const farmImage = (farm as any).isDualFarm
                        ? `${farm.lpSymbol.split(" ")[0].toLowerCase()}`
                        : `${farm.tokenSymbol.split(" ")[0].toLowerCase()}`;

                      return (
                        <SwiperSlide style={{ width: '90%', margin: "auto", marginBottom: "-11px" }}>
                          <TopFarm onClick={goToDualFarm}>
                            <Row>
                              <div style={{ width: "30%" }}>
                                <div style={{ margin: "auto" }}>
                                  <img src={`/images/farms/${farmImage}.svg`} alt={farmImage} width={80} height={80} />
                                </div>
                              </div>
                              <Content>
                                <div>
                                  <SymbolText fontSize="25px" mb="5px" bold>
                                    {farm?.lpSymbol}
                                  </SymbolText>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Text color="white" fontSize="18px">APR: </Text>
                                  <Text color="white" fontSize="18px" style={{ marginLeft: '4px' }}>
                                    {farm.apy.times(100).toFixed(2)}%
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Text color="white" fontSize="18px">Liquidity: </Text>
                                  <Text color="white" fontSize="18px" style={{ marginLeft: '3px' }} >
                                    ${farm.totalValue.toNumber() ? farm.totalValue.toNumber().toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}
                                  </Text>
                                </div>
                              </Content>
                              <div style={{ width: "31%", margin: "5px" }}>
                                <EarnTag style={{ margin: "auto" }}>
                                  <div style={{ paddingTop: "10px" }}>
                                    <Text color="white" style={{ fontSize: "20px" }} bold>Earn</Text>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "center" }}>
                                    <img
                                      src={`/images/farms/${farm.tokenSymbol.toLowerCase()}.svg`}
                                      alt={farm.tokenSymbol}
                                      width={35}
                                      height={35}
                                      style={{ margin: "0 5px" }}
                                    />
                                    <Text color="white" style={{ fontSize: "20px" }} bold>+</Text>
                                    <img
                                      src={`/images/farms/crox.svg`}
                                      alt={'CROX'}
                                      width={35}
                                      height={35}
                                      style={{ margin: "0 5px" }}
                                    />
                                  </div>
                                  <div style={{ paddingTop: "5px" }}>
                                    <Text color="white" fontSize="12px" bold>Dual Rewards</Text>
                                  </div>
                                </EarnTag>
                              </div>
                            </Row>
                          </TopFarm>
                        </SwiperSlide>
                      );
                    })
                  }
                </Swiper>
              </div>
            </CardBody>
          </StyledCakeStats>

          <div className="twitter">
            <div className="twitter__price-tag" style={{ top: "0px", left: "0px" }}>
              <GiNewShoot />
              <p className="twitter__price-tag-price">NEW FARMS</p>
            </div>
          </div>
          <StyledCakeStats style={{ marginTop: "10px" }}>
            <CardBody style={{ padding: "15px 0" }}>
              <div
                style={{
                  width: "100%",
                  marginRight: "20px",
                  zIndex: 0,
                }}
              >
                <Swiper
                  navigation={true}
                  loop={true}
                  className="mySwiper"
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {activeDualFarms &&
                    activeDualFarms.length > 0 &&
                    activeDualFarms.sort((a, b) =>
                      a && b ? (a.pidInAbs > b.pidInAbs ? -1 : 1) : 1
                    ) &&
                    activeDualFarms.slice(0, 2).map((farm, index) => {

                      const farmImage = (farm as any).isDualFarm
                        ? `${farm.lpSymbol.split(" ")[0].toLowerCase()}`
                        : `${farm.tokenSymbol.split(" ")[0].toLowerCase()}`;

                      return (
                        <SwiperSlide style={{ width: '80%' }}>
                          <TopFarm onClick={goToDualFarm}>
                            <Row style={{ justifyContent: 'center', margin: "10px 0" }}>
                              <div style={{ width: "20%" }}>
                                <div style={{ margin: "auto" }}>
                                  <img src={`/images/farms/${farmImage}.svg`} alt={farmImage} width={80} height={80} />
                                </div>
                              </div>
                              <Content>
                                <div>
                                  <Text color="white" fontSize="25px" style={{ lineHeight: "1" }} bold>
                                    {farm?.lpSymbol}
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Text color="white" fontSize="18px">APR: </Text>
                                  <Text color="white" fontSize="18px" style={{ marginLeft: '4px' }}>
                                    {farm.apy.times(100).toFixed(2)}%
                                  </Text>
                                </div>
                                <div style={{ width: "100%" }}>
                                  <EarnTag style={{ padding: '5px', margin: "auto", borderRadius: "10px", width: "80%", display: "inline-flex", height: 'auto' }}>
                                    <div style={{ display: "flex", justifyContent: "center", width: "70%" }}>
                                      <img
                                        src={`/images/farms/${farm.tokenSymbol.toLowerCase()}.svg`}
                                        alt={farm.tokenSymbol}
                                        width={20}
                                        height={20}
                                        style={{ margin: "0 8px" }}
                                      />
                                      <Text color="white" style={{ fontSize: "15px", paddingTop: "3px" }} bold>+</Text>
                                      <img
                                        src={`/images/farms/crox.svg`}
                                        alt={'CROX'}
                                        width={30}
                                        height={30}
                                        style={{ margin: "0 8px" }}
                                      />
                                    </div>
                                    <div style={{ width: "30%" }}>
                                      <Text color="white" style={{ fontSize: "11px" }} bold >Dual Rewards</Text>
                                    </div>
                                  </EarnTag>
                                </div>
                              </Content>
                              <Col>
                              </Col>
                            </Row>
                          </TopFarm>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </CardBody>
          </StyledCakeStats>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            flex: "auto",
          }}
        >
          <div className="twitter">
            <div className="twitter__price-tag" style={{ top: "-8px", left: "-10px" }}>
              <GiThumbUp />
              <p className="twitter__price-tag-price">TOP FARMS</p>
            </div>
          </div>
          <StyledCakeStats style={{ margin: "0 0 10px 0" }}>
            <CardBody style={{ padding: "15px 0" }}>
              <div
                style={{
                  width: "100%",
                  marginRight: "20px",
                  zIndex: 0,
                }}
              >
                <Swiper
                  navigation={true}
                  loop={true}
                  className="mySwiper"
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {activeDualFarms &&
                    activeDualFarms.length > 0 &&
                    activeDualFarms.sort((a, b) =>
                      a && b ? (a.apy.isGreaterThan(b.apy) ? -1 : 1) : 1
                    ) &&
                    activeDualFarms.slice(0, 2).map((farm, index) => {

                      const farmImage = (farm as any).isDualFarm
                        ? `${farm.lpSymbol.split(" ")[0].toLowerCase()}`
                        : `${farm.tokenSymbol.split(" ")[0].toLowerCase()}`;

                      return (
                        <SwiperSlide style={{ width: '100%', margin: "auto", marginBottom: "-11px" }}>
                          <TopFarm onClick={goToDualFarm}>
                            <Row>
                              <div style={{ width: "30%" }}>
                                <div style={{ margin: "auto" }}>
                                  <img src={`/images/farms/${farmImage}.svg`} alt={farm.tokenSymbol} width={80} height={80} />
                                </div>
                              </div>
                              <Content>
                                <div>
                                  <Text color="white" fontSize="20px" style={{ lineHeight: "1" }} bold>
                                    {farm?.lpSymbol}
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                                  <Text color="white" fontSize="15px" bold>APR: </Text>
                                  <Text color="white" fontSize="15px" bold style={{ marginLeft: '4px' }}>
                                    {farm.apy.times(100).toFixed(2)}%
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                                  <Text color="white" fontSize="20px" bold>Liquidity: </Text>
                                  <Text color="white" fontSize="18px" style={{ marginTop: '3px', marginLeft: '3px' }} >
                                    ${farm.totalValue.toNumber() ? farm.totalValue.toNumber().toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}
                                  </Text>
                                </div>
                              </Content>
                            </Row>
                          </TopFarm>
                        </SwiperSlide>
                      );
                    })
                  }
                </Swiper>
              </div>
            </CardBody>
          </StyledCakeStats>

          <div className="twitter">
            <div className="twitter__price-tag" style={{ top: "-8px", left: "-10px" }}>
              <GiNewShoot />
              <p className="twitter__price-tag-price">NEW FARMS</p>
            </div>
          </div>
          <StyledCakeStats style={{ margin: "0 0 10px 0" }}>
            <CardBody style={{ padding: "15px 0" }}>
              <div
                style={{
                  width: "100%",
                  marginRight: "20px",
                  zIndex: 0,
                }}
              >
                <Swiper
                  navigation={true}
                  loop={true}
                  className="mySwiper"
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {activeDualFarms &&
                    activeDualFarms.length > 0 &&
                    activeDualFarms.sort((a, b) =>
                      a && b ? (a.pidInAbs > b.pidInAbs ? -1 : 1) : 1
                    ) &&
                    activeDualFarms.slice(0, 2).map((farm, index) => {

                      const farmImage = (farm as any).isDualFarm
                        ? `${farm.lpSymbol.split(" ")[0].toLowerCase()}`
                        : `${farm.tokenSymbol.split(" ")[0].toLowerCase()}`;

                      return (
                        <SwiperSlide style={{ width: '100%' }}>
                          <TopFarm onClick={goToDualFarm}>
                            <Row style={{ justifyContent: 'center', margin: "10px 0" }}>
                              <div style={{ width: "30%" }}>
                                <div style={{ margin: "auto" }}>
                                  <img src={`/images/farms/${farmImage}.svg`} alt={farm.tokenSymbol} width={80} height={80} />
                                </div>
                              </div>
                              <Content>
                                <div>
                                  <Text color="white" fontSize="20px" style={{ lineHeight: "1" }} bold>
                                    {farm?.lpSymbol}
                                  </Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Text color="white" fontSize="15px" bold>APR: </Text>
                                  <Text color="white" fontSize="15px" bold style={{ marginLeft: '4px' }}>
                                    {farm.apy.times(100).toFixed(2)}%
                                  </Text>
                                </div>
                                <div style={{ width: "100%" }}>
                                  <div style={{ backgroundColor: "#3b3c4e", margin: "auto", borderRadius: "10px", width: "80%", display: "inline-flex" }}>
                                    <div style={{ display: "flex", justifyContent: "center", width: "50%", margin: "auto" }}>
                                      <img
                                        src={`/images/farms/${farm.tokenSymbol.toLowerCase()}.svg`}
                                        alt={farm.tokenSymbol}
                                        width={25}
                                        height={25}
                                        style={{ margin: "0 3px" }}
                                      />
                                      <Text color="white" style={{ fontSize: "15px", paddingTop: "3px" }} bold>+</Text>
                                      <img
                                        src={`/images/farms/crox.svg`}
                                        alt={`CROX`}
                                        width={30}
                                        height={30}
                                        style={{ margin: "0 3px" }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Content>
                              <Col>
                              </Col>
                            </Row>
                          </TopFarm>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </CardBody>
          </StyledCakeStats>
        </div>
      )}
    </>
  );
};

export default TwitterCard;
