/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Card, CardBody, Heading, Text, Flex } from "crox-new-uikit";
import BigNumber from "bignumber.js/bignumber";
import styled from "styled-components";
import axios from 'axios'
import { getBalanceNumber } from "utils/formatBalance";
import useTheme from "hooks/useTheme";
import {
  useTotalSupply,
  useBurnedBalance,
  useTotalStakedSupply,
} from "hooks/useTokenBalance";
import { useGetCroxPrice } from "hooks/api";
import { CountUp } from "use-count-up";
import useI18n from "hooks/useI18n";
import { getCakeAddress } from "utils/addressHelpers";
import { IoMdStats } from 'react-icons/io'
import { MdQueryStats } from 'react-icons/md'
import CardValue from "./CardValue";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTotalValue } from "../../../state/hooks";

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  background: #2c2d3a;
  position: initial;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const SCHeading = styled(Heading)`
  display: flex;
  justify-content: center;
  font-size: 18px;
  margin-top: 12px;
  border-top: 1px solid #3b3c4e;
  padding-top: 12px;
  font-weight: 700;
  align-items: center;
`;

const NetTVL = styled(Flex)`
  background-color: #3b3c4e;
  padding: 5px 10px;
  border-radius: 10px;
`;

const CakeStats = () => {
  const totalValue = useTotalValue();
  const TranslateString = useI18n();
  const totalSupply = useTotalSupply();
  const burnedBalance = useBurnedBalance(getCakeAddress());
  const stakedCrox = useTotalStakedSupply();
  const cakePrice = useGetCroxPrice();
  const circSupply = totalSupply
    ? totalSupply.minus(burnedBalance)
    : new BigNumber(0);
  // const marketCap = eggPrice.times(circSupply);
  const marketCap = cakePrice * getBalanceNumber(circSupply)

  const ismobile = useMediaQuery("(max-width: 600px)")

  useEffect(() => {
    const addBnbStats = async () => {
      await axios.post(`https://crox-backend.herokuapp.com/record/add/heco?hecotvl=${totalValue}&hecoCroxStake=${getBalanceNumber(stakedCrox)}`)
    };
    addBnbStats()
  }, [totalValue, stakedCrox]);

  const [croxstats, SetCroxstats] = useState([])

  useEffect(() => {
    const getCroxStats = async () => {
      const res = await axios.get(`https://crox-backend.herokuapp.com/record/get`)
      SetCroxstats(((res as any).data)[0])
    };
    getCroxStats()
  }, []);

  const bnbtvl = Number(croxstats['bnbtvl'])
  const bnbCroxStake = Number(croxstats['bnbCroxStake'])

  return (
    <div style={{ flex: "auto" }}>

      <StyledCakeStats style={{ marginBottom: "10px" }}>
        <CardBody>
          <Flex alignItems='center' style={{ backgroundColor: '#3b3c4e', width: '140px', padding: '3px 10px', borderRadius: '5px' }}>
            <IoMdStats style={{ color: 'white', fontSize: '20px' }} />
            <Text color="white" fontSize="17px" bold ml='3px'>CROX STATS</Text>
          </Flex>
          <Row style={{ marginTop: '20px' }}>
            <Text fontSize="17px" color='textSubtle' bold>
              {TranslateString(10005, "Market Cap")}
            </Text>
            <CardValue
              fontSize="18px"
              value={marketCap}
              prefix="$"
              decimals={0}
            />
          </Row>
          <Row style={{ marginTop: '-10px' }}>
            <Text bold fontSize="17px" color="textSubtle">
              Total CROX Staked
            </Text>
            {stakedCrox && (
              <Text fontSize="18px" color="textSubtle" bold><CountUp isCounting end={getBalanceNumber(stakedCrox) + bnbCroxStake} thousandsSeparator=',' decimalPlaces={0} /></Text>
            )}
          </Row>

          <SCHeading fontSize="18px" color='textSubtle'>
            <MdQueryStats style={{ fontSize: '22px', marginRight: '5px', color: 'textSubtle' }} />
            {TranslateString(999, "Total Value Locked (TVL)")}
          </SCHeading>
          <div style={{ textAlign: "center" }}>
            {/* <CardValue
              fontSize="27px"
              value={totalValue.toNumber()}
              prefix="$"
              decimals={2}
            /> */}
            <Text fontSize="27px" color="textSubtle" bold>$<CountUp isCounting end={totalValue.toNumber() + bnbtvl} thousandsSeparator=',' decimalPlaces={2} /></Text>
          </div>
          <Flex justifyContent='space-between' p='0 10px' flexDirection={ismobile ? 'column' : 'row'}>
            <NetTVL justifyContent='center'>
              <img src="/images/network/heco_net.svg" alt="HECO" style={{ width: '22px', height: '21px' }} />
              <Text bold mr='5px' color="#01943f">TVL</Text>
              <CardValue
                fontSize="16px"
                value={totalValue.toNumber()}
                prefix="$"
                decimals={2}
              />
            </NetTVL>
            <NetTVL justifyContent='center' mt={ismobile && '3px'}>
              <img src="/images/network/bsc_icon.png" alt="BSC" style={{ width: '22px', height: '21px' }} />
              <Text bold mr='5px' color='#e0ae32'>TVL</Text>
              <Text color="textSubtle" bold>$<CountUp isCounting end={bnbtvl} thousandsSeparator=',' decimalPlaces={2} /></Text>
            </NetTVL>
          </Flex>
          <div style={{ textAlign: "center" }}>
            <Text bold fontSize="14px" color='textSubtle'>
              {TranslateString(999, "Across all Farms and Pools")}
            </Text>
          </div>
        </CardBody>
      </StyledCakeStats>
    </div>
  );
};

export default CakeStats;
