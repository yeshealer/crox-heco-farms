/* eslint-disable */
import React, { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { Route, useRouteMatch, useLocation, Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import { useWeb3React } from '@web3-react/core';
import { provider } from "web3-core";
import {
  Heading,
  Text,
  useMatchBreakpoints,
  Toggle
} from "crox-new-uikit";
import { orderBy } from "lodash";
import FlexLayout from "components/layout/Flex";
import Page from "components/layout/Page";
import {
  useDualFarms,
  usePriceBnbBusd,
} from "state/hooks";
import { useGetCroxPrice } from "hooks/api";
import useRefresh from "hooks/useRefresh";
import { getAPYAndTVLOfDualFarm } from "utils/defi";
import { fetchDualFarmUserDataAsync } from "state/actions";
import useI18n from "hooks/useI18n";
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
`;

const HeaderText1 = styled.div`
  font-size: 20px;
  margin-top: -20px;
  @media screen and (max-width: 550px) {
    font-size: 18px;
  }
  @media screen and (max-width: 450px) {
    font-size: 15px;
  }
`;

const SelectSearch = styled.div`
  display: flex;
  @media screen and (max-width: 1000px) {
    display: flex;
    margin-top: 1%;
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

const Selecter = styled.div`
  flex: auto;
  @media screen and (max-width: 1000px) {
    display: flex;
    width: 136px !important;
    margin-top: 8px;
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
  const history = useHistory()
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  const [query, setQuery] = useState("");
  const lpTypeList = useRef([])
  const lpTypeSelectList = useRef([])
  const [sortOption, setSortOption] = useState("hot");
  const [filterOption, setFilterOption] = useState("")
  const { pathname } = useLocation();

  const { path } = useRouteMatch();
  const TranslateString = useI18n();
  const farmsLP = useDualFarms();
  const cakePrice_raw = useGetCroxPrice();
  const cakePrice = new BigNumber(cakePrice_raw)
  const bnbPrice = usePriceBnbBusd();
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
    window.scrollTo(0, 0);
  }, []);
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

          const { apy1, apy2 } = getAPYAndTVLOfDualFarm(farm, { cakePrice, bnbPrice });
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
            (farm: FarmWithStakedValue) => farm.apy2.plus(farm.apy1).times(new BigNumber(100)).toNumber(),
            "desc"
          );
        case "earned":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.userData ? Number(farm.userData.earnings) : 0,
            "desc"
          );
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
    lpTypeList.current = []
    lpTypeSelectList.current = []
    for (let i = 0; i < farmsStaked.length; i++) {
      if (!lpTypeList.current.includes(farmsStaked[i].lpType)) {
        lpTypeList.current.push(farmsStaked[i].lpType)
        lpTypeSelectList.current.push({ label: farmsStaked[i].lpType, value: farmsStaked[i].lpType.toLowerCase() })
      }
    }
    lpTypeList.current.unshift('All')
    lpTypeSelectList.current.unshift({ label: 'All' })

    if (filterOption && filterOption !== 'All') {
      farmsStaked = farmsStaked.filter(farm => farm.lpType === filterOption.toUpperCase());
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

  const handleSortLPTypeChange = (option: OptionProps): void => {
    setFilterOption(option.value);
  };

  return (
    <Page style={{ padding: '0px' }}>
      <div style={{ textAlign: "center", position: "absolute", top: "65px", width: "100%", left: "0" }}>
        <Heading
          as="h1"
          size="lg"
          color="primary"
          mb="20px"
          style={{ fontWeight: "bolder" }}
        >
          <HeaderText>
            Next-Generation Staking & Yield Farming
          </HeaderText>
        </Heading>

        <Heading
          size="md"
          color="primary"
          mb="30px"
          style={{ textAlign: "center" }}
        >
          <HeaderText1>
            Stake your LP tokens to earn dual rewards + trade fees
          </HeaderText1>
        </Heading>
      </div>
      {!isMd && !isSm && !isXs && !isLg ? (
        <>
          <ControlContainer>
            <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} />
            <SelectSearch>
              <Selecter style={{ marginRight: '40px' }}>
                <Select
                  options={lpTypeSelectList.current}
                  onChange={handleSortLPTypeChange}
                />
              </Selecter>
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
                <SearchInput onChange={handleChangeQuery} placeHolder={"Search farms"} />
              </Searchfarm>
            </SelectSearch>
          </ControlContainer>
        </>
      ) : (
        <>
          <ControlContainer>
            <Searchfarm>
              <SearchInput onChange={handleChangeQuery} placeHolder={"Search farms"} />
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
                      label: "Earned",
                      value: "earned",
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </Selecter>
            </div>
          </ControlContainer>
          <Selecter style={{ marginBottom: '8px' }}>
            <Select
              options={lpTypeSelectList.current}
              onChange={handleSortLPTypeChange}
            />
          </Selecter>
        </>
      )}
      <div>
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
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
          Upcoming Dual-Farms
        </UpcomingText>
        <FlexLayout>


          {/* <UpComingCard
            farm={{
              lpLabel: "EARN<br/>FCF + CROX + Trade Fees",
              lpSubLabel: "Stake CROX-USDT LP",
              tokenSymbol: "BABY LP",
              multiplier: "4",
              depositFeeBP: 0,
              harvestInterval: 600,
              farmImage: "crox-usdt",
              timestamp: 1642559400000,
              description:
                "CroxSwap is a fully decentralized dual farming and staking protocol which provides farming and staking as a service for other DeFi projects with no extra cost and hassle to set up.",
              website: "https://www.croxswap.com/",
            }}
            removed={false}
          />
          <UpComingCard
            farm={{
              lpLabel: "EARN<br/>CROX + MILK + Trade Fees",
              lpSubLabel: "Stake MILK-USDT LP",
              tokenSymbol: "BABY LP",
              multiplier: "4",
              depositFeeBP: 0,
              harvestInterval: 600,
              farmImage: "milk-usdt",
              timestamp: 1639454400000,
              description:
                "The Crypto You is an online game based on Binance Smart Chain (BSC). Players can summon characters, complete daily mining missions, conquer the dark monsters, loot rare items to play and earn. The babies live on the Baby Planet, and the most abundant resources on the planet are cryptocurrencies.",
              website: "https://thecryptoyou.io/home",
            }}
            removed={false}
          />

          <UpComingCard
            farm={{
              lpLabel: "EARN<br/>CROX + CNR + Trade Fees",
              lpSubLabel: "Stake CNS-BNB LP",
              tokenSymbol: "CAKE LP",
              multiplier: "4",
              depositFeeBP: 0,
              harvestInterval: 600,
              farmImage: "cns-bnb",
              timestamp: 1642773600000,
              description:
                "Centric is an innovative dual-token digital currency and decentralized blockchain protocol built on sound economics. The dual-token model rewards adoption with a fixed hourly yield, and stabilizes over time as it self-regulates token supply to meet ongoing changes in demand.",
              website: "https://www.centric.com/",
            }}
            removed={false}
          /> */}

          <CreateYourProject
            farm={{
              lpLabel: "CREATE A FARM?",
              lpSubLabel: "Submit the application to start a farm",
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
