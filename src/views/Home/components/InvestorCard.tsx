import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import {
  Card,
  CardBody,
  Button,
  Text,
  useMatchBreakpoints,
  Flex
} from "crox-new-uikit";
import { useDispatch } from "react-redux";
import { HiOutlineExternalLink } from "react-icons/hi"
import { Icon } from '@iconify/react';
import ReactModal from 'react-modal'
import { useWeb3React } from '@web3-react/core';
import BigNumber from "bignumber.js";
import { fetchDualFarmUserDataAsync, fetchFarmUserDataAsync } from "state/actions";
import useI18n from "hooks/useI18n";
import { useAllHarvest } from "hooks/useHarvest";
import { FaWallet } from 'react-icons/fa'
import useFarmsWithBalance from "hooks/useFarmsWithBalance";
import UnlockButton from "components/UnlockButton";
import useRefresh from "hooks/useRefresh";
import useMediaQuery from "@mui/material/useMediaQuery";
import ViewPortfolioModal from './ViewPortfolioModal'
import CakeHarvestBalance from "./CakeHarvestBalance";
import CakeWalletBalance from "./CakeWalletBalance";
import CakeStakeBalance from "./CakeStakeBalance";
import { usePriceCakeBusd, useDualFarms, useFarms } from "../../../state/hooks";
import useTokenBalance from "../../../hooks/useTokenBalance";
import { getCakeAddress } from "../../../utils/addressHelpers";
import useAllEarnings from "../../../hooks/useAllEarnings";
import FarmIcon from "./Icon/farmIcon";
import FolioIcon from "./Icon/folioIcon";
import WalletIcon from "./Icon/WalletIcon";
import StakeIcon from "./Icon/stakeIcon";
import HarvestIcon from "./Icon/harvestIcon";
import { getBalanceNumber } from "../../../utils/formatBalance";
import './Investor.css';

const StyledFarmStakingCard = styled(Card)`
  min-height: 376px;
  background-color: #2c2d3a;
`;

const FolioSection = styled.div`
  padding: 15px;
  z-index: 97;
  color: white;
  font-weight: 700;
  font-size: 20px;
  color: #2d74c4;
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
`;

const Actions = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  @media screen and (max-width: 440px) {
    text-align: end;
    .portfolioLink {
      text-align: center;
    }
  }
`;

const ColorThead = styled.thead`
  background-color: #3b3c4e;
  tr th {
    color: #2d74c4;
  }
`

const LinkButton = styled.button`
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: bold;
  background-color: transparent;
`

const customStyles = {
  body: {
    overflow: 'hidden !important'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "transparent",
    border: 'none',
    overflow: 'auto'
  },
};

ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(69,42,122,0.6)';
ReactModal.defaultStyles.overlay.zIndex = '98';

const InvestorCard = () => {
  const [isViewPortfolioModalOpen, setIsViewPortfolioModalOpen] = useState(false);
  function closeModal() {
    setIsViewPortfolioModalOpen(false);
  }
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();
  const [pendingTx, setPendingTx] = useState(false);
  const [tab, setTab] = useState("wallet");
  const { account } = useWeb3React();
  const TranslateString = useI18n();
  const farmsWithBalance = useFarmsWithBalance();
  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()));
  const eggPrice = usePriceCakeBusd().toNumber();
  const allEarnings = useAllEarnings();
  // const { stakedBalance } = useCroxPoolSymbol('CROX');
  const activeDualFarms = useDualFarms(true)
  const farmList = useFarms()
  const stakedFarmList = [];
  for (let j = 0; j < farmList.length; j++) {
    if (farmList[j].userData && getBalanceNumber(new BigNumber(farmList[j].userData.stakedBalance)) !== 0) {
      stakedFarmList.push(farmList[j])
    }
  }
  const dualFarmList = useDualFarms()
  const dualFarmResult = []
  for (let j = 0; j < dualFarmList.length; j++) {
    if (dualFarmList[j].userData && getBalanceNumber(new BigNumber(dualFarmList[j].userData.stakedBalance)) !== 0) {
      dualFarmResult.push(dualFarmList[j])
    }
  }
  const nextgenList = useDualFarms(true)
  const stakedNextGenList = []
  for (let j = 0; j < nextgenList.length; j++) {
    if (nextgenList[j].userData && getBalanceNumber(new BigNumber(nextgenList[j].userData.stakedBalance)) !== 0) {
      stakedNextGenList.push(nextgenList[j])
    }
  }
  const stakedDualFarmList = dualFarmResult.filter(it => it.active === true)
  // for (let i = 0; i < dualFarmList.length; i ++) {
  // }
  let nextgenstaked = new BigNumber(0)
  for (let i = 0; i < activeDualFarms.length; i++) {
    if (activeDualFarms[i].userData) {
      nextgenstaked = new BigNumber(nextgenstaked).plus(new BigNumber(activeDualFarms[i].userData.stakedBalance))
    }
  }
  const totalstaked = getBalanceNumber(nextgenstaked)
  const stakedBalancePrice = totalstaked * eggPrice
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return (
      accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
    );
  }, 0);
  const balancesWithValue = farmsWithBalance.filter(
    (balanceType) => balanceType.balance.toNumber() > 0
  );

  const { onReward } = useAllHarvest(
    balancesWithValue.map((farmWithBalance) => farmWithBalance.pid)
  );

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true);
    try {
      await onReward();
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false);
    }
  }, [onReward]);

  const dispatch = useDispatch();
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account));
      dispatch(fetchDualFarmUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const ismobile = useMediaQuery("(max-width: 600px)")

  return (
    <>
      <StyledFarmStakingCard>
        <CardBody
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Flex justifyContent={ismobile ? 'center' : 'flex-start'}>
            <Flex alignItems='center' style={{ backgroundColor: '#3b3c4e', width: '230px', padding: '3px 10px', borderRadius: '5px' }} justifyContent='flex-start'>
              <Icon icon="fa-solid:tractor" style={{ color: 'white' }} />
              <Text color="white" fontSize="17px" ml='3px' bold>CROXSTER DASHBOARD</Text>
            </Flex>
          </Flex>
          {!isSm && !isXs ? (
            <>
              <FolioSection>
                <FolioIcon />
                CROX FOLIO
              </FolioSection>
              <table className="table tablesorter " id="plain-table">
                <ColorThead className="thead_invest">
                  <tr>
                    <th style={{ textAlign: 'left', paddingLeft: '16px' }}>
                      $CROX
                    </th>
                    <th>
                      Amount
                    </th>
                    <th>
                      Total($)
                    </th>
                  </tr>
                </ColorThead>
                <tbody className="tbody_invest">
                  <tr>
                    <td>
                      <Flex alignItems='center' ml='15px'>
                        <FaWallet style={{ fontSize: '14px' }} />
                        <Text bold color='white' ml='3px'>In Wallet</Text>
                      </Flex>
                    </td>
                    <td>
                      <CakeWalletBalance cakeBalance={cakeBalance} isInvestor />
                    </td>
                    <td>
                      <Text style={{ textAlign: 'center', color: 'white' }}>${(eggPrice * cakeBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Flex alignItems='center' ml='15px'>
                        <StakeIcon />
                        <Text bold color='white'>Staked</Text>
                      </Flex>
                    </td>
                    <td>
                      <CakeStakeBalance stakeValue={totalstaked} isInvestor />
                    </td>
                    <td>
                      <Text style={{ textAlign: 'center', color: 'white' }}>${stakedBalancePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Flex alignItems='center' ml='15px'>
                        <HarvestIcon />
                        <Text bold color='white'>To Harvest</Text>
                      </Flex>
                    </td>
                    <td>
                      <CakeHarvestBalance earningsSum={earningsSum} isInvestor />
                    </td>
                    <td>
                      <Text style={{ textAlign: 'center', color: 'white' }}>${(eggPrice * earningsSum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <>
              <FolioSection>
                <FolioIcon />
                CROX FOLIO
              </FolioSection>
              <table className="table tablesorter " id="plain-table">
                <ColorThead className="thead_invest">
                  <tr>
                    <th style={{ textAlign: 'left', paddingLeft: '16px' }}>
                      $CROX
                    </th>
                    <th>
                      Amount
                    </th>
                    <th>
                      Total($)
                    </th>
                  </tr>
                </ColorThead>
                <tbody className="tbody_invest">
                  <tr>
                    <td>
                      <Flex alignItems='center' ml='15px'>
                        <FaWallet style={{ fontSize: '14px' }} />
                        <Text bold color='white' ml='3px'>In Wallet</Text>
                      </Flex>
                    </td>
                    <td>
                      <CakeWalletBalance cakeBalance={cakeBalance} isInvestor />
                    </td>
                    <td>
                      <Text style={{ textAlign: 'center', color: 'white' }}>${(eggPrice * cakeBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Flex alignItems='center' ml='15px'>
                        <StakeIcon />
                        <Text bold color='white'>Staked</Text>
                      </Flex>
                    </td>
                    <td>
                      <CakeStakeBalance stakeValue={totalstaked} isInvestor />
                    </td>
                    <td>
                      <Text style={{ textAlign: 'center', color: 'white' }}>${stakedBalancePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Flex alignItems='center' ml='15px'>
                        <HarvestIcon />
                        <Text bold color='white'>To Harvest</Text>
                      </Flex>
                    </td>
                    <td>
                      <CakeHarvestBalance earningsSum={earningsSum} isInvestor />
                    </td>
                    <td>
                      <Text style={{ textAlign: 'center', color: 'white' }}>${(eggPrice * earningsSum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
          <Actions>
            <Flex mr="50px" alignItems='center' onClick={() => setIsViewPortfolioModalOpen(true)}>
              <LinkButton style={{ cursor: 'pointer', color: '#2d74c4' }} >{ismobile ? 'Portfolio' : 'View Full Portfolio'}</LinkButton>
              <HiOutlineExternalLink style={{ color: '#2d74c4', fontSize: '20px' }} />
            </Flex>
            {account ? (
              <Button
                id="harvest-all"
                disabled={balancesWithValue.length <= 0 || pendingTx}
                onClick={harvestAllFarms}
                size="sm"
                className='havest_all_btn'
                style={{ fontSize: "14px", width: '124px', borderRadius: '5px' }}
                fullWidth
              >
                {pendingTx
                  ? TranslateString(548, "Collecting CROX")
                  : TranslateString(
                    999,
                    `Harvest all (${balancesWithValue.length})`
                  )}
              </Button>
            ) : (
              <Button
                id="harvest-all"
                onClick={harvestAllFarms}
                fullWidth
                size="sm"
                className='havest_all_btn'
                style={{ fontSize: "14px", width: '124px', borderRadius: '5px' }}
              >
                {pendingTx
                  ? TranslateString(548, "Collecting CROX")
                  : TranslateString(999, `Harvest All`)}
              </Button>
            )}
          </Actions>
        </CardBody>
      </StyledFarmStakingCard>
      <ReactModal isOpen={isViewPortfolioModalOpen} onRequestClose={() => closeModal()} style={customStyles}>
        <ViewPortfolioModal onDismiss={() => closeModal()} stakedFarmList={stakedFarmList} stakedDualFarmList={stakedDualFarmList} stakedNextGenList={stakedNextGenList} />
      </ReactModal>
    </>
  );
};

export default InvestorCard;
