/* eslint-disable */
import React, { useEffect, useCallback, useState, useMemo } from "react";
import { Route, useRouteMatch, useLocation, Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import { useWeb3React } from '@web3-react/core';
import { provider } from "web3-core";
import {
  Heading,
  Text, useMatchBreakpoints, Toggle
} from "crox-new-uikit";
import { orderBy } from "lodash";
import FlexLayout from "components/layout/Flex";
import Page from "components/layout/Page";
import {
  useDualFarms,
  usePriceBnbBusd,
} from "state/hooks";
import { useGetBNBPrice, useGetCroxPrice } from "hooks/api";
import useRefresh from "hooks/useRefresh";
import { fetchDualFarmUserDataAsync } from "state/actions";
import useI18n from "hooks/useI18n";
import { getAPYAndTVLOfNGPool } from "utils/defi";
import Select, { OptionProps } from "components/Select/Select";
import FarmCard, { FarmWithStakedValue } from "./components/FarmCard/FarmCard";
import FarmTabButtons from "./components/FarmTabButtons";
import Divider from "./components/Divider";
import SearchInput from "./components/SearchInput";
import CreateYourProject from "./components/CreateYourProject";

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  @media screen and (max-width: 1000px) {
    margin: 10px 0;
    display: -webkit-box;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`;

const HeaderText = styled.div`
  font-size: 40px;
  font-weight: bolder;
  @media screen and (max-width: 1000px) {
    font-size: 29px;
  }
  @media screen and (max-width: 650px) {
    font-size: 27px;
  }
`;

const HeaderText1 = styled.div`
  font-size: 20px;
  margin-top: -20px;
  @media screen and (max-width: 650px) {
    font-size: 18px;
  }
`;

const SelectSearch = styled.div`
  display: flex;
  @media screen and (max-width: 1000px) {
    display: flex;
    margin-top: 1%;
  }
`;

const Selecter = styled.div`
  flex: auto;
  @media screen and (max-width: 1000px) {
    display: flex;
    width: 136px !important;
    margin-top: 8px;
  }
`;

const UpcomingText = styled.span`
  font-size: 40px;
  color: white;
  font-weight: bold;
  @media screen and (max-width: 550px) {
    font-size: 30px;
  }
`;

const Searchfarm = styled.div`
  flex: auto;
  margin-left: 40px;
  @media screen and (max-width: 1000px) {
    display: block;
    margin-left: 0px;
    width: fit-content;
  }
`;


export interface FarmsProps {
  tokenMode?: boolean;
}

const DualFarm: React.FC<FarmsProps> = (farmsProps) => {
  const history = useHistory();
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("hot");
  const { pathname } = useLocation();

  const { path } = useRouteMatch();
  const TranslateString = useI18n();
  const farmsLP = useDualFarms(true);
  const cakePrice_raw = useGetCroxPrice();
  const cakePrice = new BigNumber(cakePrice_raw)
  const bnbPrice_raw = useGetBNBPrice();
  const bnbPrice = new BigNumber(bnbPrice_raw)
  const {
    account,
    library
  } = useWeb3React();
  const isInactive = pathname.includes("history");
  const isActive = !isInactive;

  const [stakedOnly, setStakedOnly] = useState(!isActive);
  useEffect(() => {
    setStakedOnly(!isActive);
  }, [isActive]);

  const dispatch = useDispatch();
  const { fastRefresh } = useRefresh();
  useEffect(() => {
    if (account) {
      dispatch(fetchDualFarmUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const activeFarms = farmsLP.filter((it) => (it as any).active);
  const inactiveFarms = farmsLP.filter((it) => !(it as any).active);

  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const farmsList = useCallback(
    (farmsToDisplay, removed?: boolean) => {
      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map(
        (farm) => {
          const { apy1: apy1, apy2: apy2 } = getAPYAndTVLOfNGPool(farm, {
            cakePrice,
            bnbPrice,
          });
          return { ...farm, apy1, apy2 };
        }
      );

      if (query) {
        const lowercaseQuery = query.toLowerCase();
        farmsToDisplayWithAPY = farmsToDisplayWithAPY.filter((farm: any) => {
          return farm.lpSymbol.toLowerCase().includes(lowercaseQuery);
        });
      }
      return farmsToDisplayWithAPY;
    },
    [bnbPrice, account, cakePrice, library]
  );

  const { url } = useRouteMatch()

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = [];

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case "apy":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => farm.apy1,
            "desc"
          );
        case "earned":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.userData ? Number(farm.userData.earnings) : 0,
            "desc"
          );
        // case 'liquidity':
        //   return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms;
      }
    };

    if (isActive) {
      farmsStaked = farmsList(
        stakedOnly ? stakedOnlyFarms : activeFarms,
        false
      );
    }
    if (isInactive) {
      farmsStaked = farmsList(
        stakedOnly ? stakedInactiveFarms : inactiveFarms,
        true
      );
    }

    return sortFarms(farmsStaked);
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    isActive,
    isInactive,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
  ]);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  return (
    <Page style={{ padding: '0px' }}>
      <div style={{ textAlign: "center", position: "absolute", top: "65px", width: "100%", left: "0" }}>
        <Heading
          as="h1"
          size="lg"
          color="primary"
          mb="20px"
          style={{ textAlign: "center" }}
        >
          <HeaderText>
            Next-Generation Staking Pools & Yield Farming
          </HeaderText>
        </Heading>

        <Heading
          size="md"
          color="primary"
          mb="30px"
          style={{ textAlign: "center" }}
        >
          <HeaderText1>
            Stake CROX to earn other tokens
          </HeaderText1>
        </Heading>
      </div>
      {!isMd && !isSm && !isXs && !isLg ? (
        <ControlContainer>
          <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} />
          <SelectSearch>
            <Selecter>
              <Select
                options={[
                  {
                    label: "Hot",
                    value: "hot",
                  },
                  {
                    label: "APY",
                    value: "apy",
                  },
                  {
                    label: "Earned",
                    value: "earned",
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </Selecter>
            <Searchfarm>
              <SearchInput onChange={handleChangeQuery} placeHolder={"Search pools"} />
            </Searchfarm>
          </SelectSearch>
        </ControlContainer>
      ) : (
        <ControlContainer>
          {/* <SelectSearch > */}
          <Searchfarm>
            <SearchInput onChange={handleChangeQuery} placeHolder={"Search pools"} />
            <label>
              <input type='checkbox' />
              <span className='base-color'>
                <span className='toggle-slider' />
                <span className='cash' onClick={() => { history.replace(url) }}>Active</span>
                <span className='token' onClick={() => { history.replace(`${url}/history`) }}>Finished</span>
              </span>
            </label>
          </Searchfarm>
          <div style={{ display: "block", width: "fit-content" }}>
            <div style={{ display: "flex" }}>
              <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
              <Text style={{ padding: "3% 9px" }}> {TranslateString(699, 'Staked only')}</Text>
            </div>
            <Selecter>
              <Select
                options={[
                  {
                    label: "Hot",
                    value: "hot",
                  },
                  {
                    label: "APY",
                    value: "apy",
                  },
                  {
                    label: "Multiplier",
                    value: "multiplier",
                  },
                  {
                    label: "Earned",
                    value: "earned",
                  },
                  // {
                  //   label: 'Liquidity',
                  //   value: 'liquidity',
                  // },
                ]}
                onChange={handleSortOptionChange}
              />
            </Selecter>
          </div>


          {/* </SelectSearch> */}


        </ControlContainer>
      )}
      <div>
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            {/* {stakedOnly
              ? farmsList(stakedOnlyFarms, false)
              : farmsList(activeFarms, false)} */}
            {/* {farmsStakedMemoized} */}
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                account={account}
                bnbPrice={bnbPrice}
                ethereum={library}
                cakePrice={cakePrice}
                removed={false}
              />
            ))}
          </Route>
          <Route exact path={`${path}/history`}>
            {/* {farmsList(inactiveFarms, true)} */}
            {/* {farmsStakedMemoized} */}
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                account={account}
                bnbPrice={bnbPrice}
                ethereum={library}
                cakePrice={cakePrice}
                removed={true}
              />
            ))}
          </Route>
        </FlexLayout>
        <Divider />
        <UpcomingText>
          Upcoming Pools
        </UpcomingText>
        <FlexLayout>
          {" "}


          {/*  <UpComingCard
              farm={{
                lpLabel: "EARN IF1",
                lpSubLabel: "STAKE CROX",
                multiplier: "4",
                harvestInterval: 600,
                farmImage: "if1",
                timestamp: 1642644000000,
                description:
                "InfiniteOne Airdrops Other Tokens Directly Into Your Wallet hassle free. The one token that rewards you through the ups and downs of the market.",
              website: "https://infiniteone.io/",
              }}
              removed={false}
            />
            <UpComingCard
                  farm={{
                    lpLabel: "EARN CRUSH + CNR",
                    lpSubLabel: "STAKE CROX",
                    multiplier: "4",
                    harvestInterval: 600,
                    farmImage: "crush",
                    timestamp: 1637038800000,
                    description:
                    "The First Hybrid Defi Gaming Platform on BSC. A hybrid system of provably fair and decentralized games that utilize Defi protocols, launching with a tested and working product.",
                  website: "https://bitcrusharcade.io/",
                  }}
                  removed={false}
                />
                <UpComingCard

                      farm={{
                        lpLabel: "EARN BABY",
                        lpSubLabel: "STAKE CROX",
                        multiplier: "4",
                        harvestInterval: 600,
                        farmImage: "baby",
                        timestamp: 1639454400000,
                        description:
                        "Baby Metaverse is a crypto world for users to trade, earn, and play. It's the best choice for newborn projects on Binance Smart Chain to get supports, including AMM, NFT, and GameFi.",
                      website: "https://babyswap.finance/",
                      }}
                      removed={false}
                    />
                <UpComingCard

                      farm={{
                        lpLabel: "EARN CNR",
                        lpSubLabel: "STAKE CROX",
                        multiplier: "4",
                        harvestInterval: 600,
                        farmImage: "cnr",
                        timestamp: 1642773600000,
                        description:
                        "Centric is an innovative dual-token digital currency and decentralized blockchain protocol built on sound economics. The dual-token model rewards adoption with a fixed hourly yield, and stabilizes over time as it self-regulates token supply to meet ongoing changes in demand.",
                      website: "https://www.centricswap.com/",
                      }}
                      removed={false}
                    /> */}


          {" "}
          <CreateYourProject
            farm={{
              lpLabel: "CREATE A POOL?",
              lpSubLabel: "Submit the application to start a pool",
              farmImage: "question",
              website: "https://forms.gle/xv759uRs4GARh4jQA",
            }}
          />
        </FlexLayout>
      </div>
    </Page>
  );
};

export default DualFarm;
