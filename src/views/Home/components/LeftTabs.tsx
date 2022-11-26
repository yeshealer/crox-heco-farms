import React, { useEffect, useRef } from 'react'
import { Text, LinkExternal, Flex, Input, useMatchBreakpoints, } from 'crox-new-uikit'
import { useWeb3React } from '@web3-react/core';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { getAPYAndTVLOfFarm, getAPYAndTVLOfDualFarm, getAPYAndTVLOfPool, getAPYAndTVLOfNGPool } from "utils/defi";
import SearchIcon from '@mui/icons-material/Search';
import { FaWallet } from 'react-icons/fa'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { GiSprout } from 'react-icons/gi'
import { Icon } from '@iconify/react';
import { useGetBNBPrice, useGetCroxPrice } from "hooks/api"
import BigNumber from 'bignumber.js';
import StakedFarmList from './StakedFarmList'
import StakedPoolList from './StakedPoolList'
import StakedDualFarmList from './StakedDualFarmList'
import StakedNextPoolList from './StakedNextPoolList'
import CakeWalletBalance from "./CakeWalletBalance";
import { getBalanceNumber } from "../../../utils/formatBalance";
import { getCakeAddress } from "../../../utils/addressHelpers";
import useTokenBalance from "../../../hooks/useTokenBalance";
import { useTotalValue, usePriceCakeBusd, usePriceBnbBusd } from "../../../state/hooks";
import HarvestIcon from "./Icon/harvestIcon_port";
import TransactionIcon from "./Icon/transactionIcon";
import VerifyIcon from "./Icon/VerifyIcon";
import WithdrawIcon from "./Icon/withdrawIcon";
import MobileTableWallet from "./MobileTableWallet";
import MobileTableTransaction from "./MobileTableTransaction";
import MobileTableYield from "./MobileTableYield";
import './LeftTabs.css'

interface LeftTabsProps {
  stakedFarmList?: any
  stakedDualFarmList?: any
  stakedPoolList?: any
  stakedNextGenList?: any
  walletTokenList?: any
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ color: 'white', fontFamily: "'Baloo 2', cursive" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const LeftTabs: React.FC<LeftTabsProps> = ({
  stakedFarmList,
  stakedDualFarmList,
  stakedPoolList,
  stakedNextGenList,
  walletTokenList
}) => {
  const { account } = useWeb3React();
  const totalValue = useTotalValue();
  const bnbPrice_raw = useGetBNBPrice();
  const bnbPrice = new BigNumber(bnbPrice_raw)

  function divider(res) {
    if (res >= 10 ** 9) {
      return `${(res / 10 ** 9).toFixed(2)}B`
    }
    if (res >= 10 ** 6) {
      return `${(res / 10 ** 6).toFixed(2)}M`
    }
    if (res >= 10 ** 3) {
      return `${(res / 1000).toFixed(2)}K`
    }
    return res.toFixed(2)
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()));
  const eggPrice = useGetCroxPrice();
  const cakePrice = new BigNumber(eggPrice);

  const tabstyle = {
    minHeight: '40px',
    justifyContent: 'flex-start',
    fontFamily: "'Baloo 2', cursive",
    fontSize: '20px',
    letterSpacing: 0,
  };
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();
  const dualFarmImage = []
  const dualFarmApyGroup = []
  const dualFarmApy = []
  const dualFarmLpWorth = []
  const nextgenImage = []
  const nextgenApyGroup = []
  const nextgenApy = []
  const nextgenLpWorth = []
  let totalStakedAmount = 0
  let totalEarningAmount = 0

  for (let i = 0; i < stakedDualFarmList.length; i++) {
    dualFarmImage[i] = stakedDualFarmList[i].lpSymbol.split(" ")[0].toLowerCase()
    dualFarmApyGroup[i] = getAPYAndTVLOfDualFarm(stakedDualFarmList[i], { cakePrice, bnbPrice })
    dualFarmApy[i] = (dualFarmApyGroup[i].apy1).plus(dualFarmApyGroup[i].apy2)
    dualFarmLpWorth[i] = new BigNumber(dualFarmApyGroup[i].totalValue)
      .div(new BigNumber(stakedDualFarmList[i].lpBalance))
      .toFixed(2);
    totalStakedAmount += getBalanceNumber(stakedDualFarmList[i].userData.stakedBalance) * dualFarmLpWorth[i]
    totalEarningAmount += getBalanceNumber(stakedDualFarmList[i].userData.earnings[0]) * eggPrice
    totalEarningAmount += getBalanceNumber(stakedDualFarmList[i].userData.earnings[1]) * stakedDualFarmList[i].tokenPrice
  }

  for (let i = 0; i < stakedNextGenList.length; i++) {
    nextgenImage[i] = stakedNextGenList[i].tokenSymbol
    nextgenApyGroup[i] = getAPYAndTVLOfNGPool(stakedNextGenList[i], { cakePrice, bnbPrice })
    nextgenApy[i] = (nextgenApyGroup[i].apy1)
    nextgenLpWorth[i] = new BigNumber(nextgenApyGroup[i].totalValue)
      .div(new BigNumber(stakedNextGenList[i].lpBalance))
      .toFixed(2);
    totalStakedAmount += getBalanceNumber(stakedNextGenList[i].userData.stakedBalance) * nextgenLpWorth[i]
    totalEarningAmount += stakedNextGenList[i].lpSymbol === 'CNR' ? getBalanceNumber(stakedNextGenList[i].userData.earnings[0], 8) * stakedDualFarmList[i].tokenPrice : getBalanceNumber(stakedNextGenList[i].userData.earnings[0]) * stakedDualFarmList[i].tokenPrice
  }

  let netWalletAmount = 0;
  for (let i = 0; i < walletTokenList.length; i++) {
    (netWalletAmount as any) += walletTokenList[i].price * walletTokenList[i].amount
  }

  return (
    <>
      {!isMd && !isSm && !isXs && !isLg ? (
        <Box sx={{ flexGrow: 1, bgcolor: '#171923', display: 'flex', height: 560 }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider', width: 210 }}
          >
            <Tab icon={<FaWallet style={{ fontSize: '24px' }} />} iconPosition='start' label="WALLET" style={tabstyle} sx={{ mt: 2 }} {...a11yProps(0)} className='leftTab' />
            {/* <Tab icon={<Icon icon="akar-icons:arrow-right-left" style={{ fontSize: '24px' }} />} iconPosition='start' label="TRANSACTIONS" style={tabstyle} {...a11yProps(1)} /> */}
            <Tab icon={<GiSprout style={{ fontSize: '24px' }} />} iconPosition='start' label="YIELD TRACKER" style={tabstyle} {...a11yProps(2)} className='leftTab' />
            <div className='info_crox_wallet top_card'>
              <Card sx={{ maxWidth: 250 }} className='tabbody' >
                <CardActionArea>
                  <CardContent className="cardContent">
                    <Typography variant="h5" component="div">
                      <Text fontSize="18px" mr='3px' color='#2d74c4'>$CROX in Wallet</Text>
                      <Text><CakeWalletBalance cakeBalance={cakeBalance} isInvestor fontSize="18px" /></Text>
                      <Text style={{ textAlign: 'center' }} fontSize="18px">${(eggPrice * cakeBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
            {/* <div className='info_crox_wallet'>
              <Card sx={{ maxWidth: 250 }} className='tabbody' >
                <CardActionArea>
                  <CardContent className="cardContent">
                    <Typography variant="h5" component="div">
                      <Text fontSize="18px" mr='3px' color='#2d74c4'>Net Wallet Portfolio</Text>
                      <Text style={{ textAlign: 'center' }} fontSize="18px">${netWalletAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div> */}
            <div className='info_crox_wallet'>
              <Card sx={{ maxWidth: 250 }} className='tabbody' >
                <CardActionArea>
                  <CardContent className="cardContent">
                    <Typography variant="h5" component="div">
                      <Text fontSize="18px" mr='3px' color='#2d74c4'>Net Staked Amount</Text>
                      <Text style={{ textAlign: 'center' }} fontSize="18px">${totalStakedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          </Tabs>
          <TabPanel value={value} index={0}>
            <Text color='#EAE2FC' fontSize='18px' className='HeaderTitle'>Your Portfolio</Text>
            <div className='headerCard'>
              <img src="/images/network/heco_icon.png" alt="HECO" width='40px' style={{ padding: '10px 0', marginRight: '30px' }} />
            </div>
            <table className="table tablesorter " id="plain-table">
              <thead className="thead_portfolio_wallet">
                <tr>
                  <th>
                    Token Name
                  </th>
                  <th>
                    Token Price
                  </th>
                  <th>
                    Amount
                  </th>
                  <th>
                    TotalValue($)
                  </th>
                  <th>
                    Verified
                  </th>
                  {/* <th>
                    {' '}
                  </th> */}
                </tr>
              </thead>
              <tbody className="tbody_wallet">
                <tr>
                  <td>
                    <Flex alignItems="center" justifyContent="left" ml="20px">
                      <img
                        src="/images/farms/crox.svg"
                        alt="crox"
                        width={35}
                        height={35}
                        style={{ margin: "0 5px" }}
                      />
                      CROX
                    </Flex>
                  </td>
                  <td>
                    ${eggPrice && eggPrice.toFixed(3)}
                  </td>
                  <td>
                    <CakeWalletBalance color="white" cakeBalance={cakeBalance} isInvestor fontSize="16px" />
                  </td>
                  <td>
                    ${(eggPrice * cakeBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    <VerifyIcon />
                  </td>
                  {/* <td>
                    <Button variant="outlined" style={{ color: '#2d74c4', border: '1px solid #2d74c4', padding: '3px 12px' }} href="https://exchange.croxswap.com/#/swap/0x2c094f5a7d1146bb93850f629501eb749f6ed491">Swap</Button>
                  </td> */}
                </tr>
                {walletTokenList.map((walletToken) => (
                  <tr>
                    <td>
                      <Flex alignItems="center" justifyContent="left" ml="20px">
                        <img
                          src={walletToken.logo_url ? walletToken.logo_url : `/images/farms/${walletToken.symbol}.svg`}
                          alt={walletToken.symbol.toLowerCase()}
                          width={35}
                          height={35}
                          style={{ margin: "0 5px" }}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = '/images/no_icon.png'
                          }}
                        />
                        {walletToken.symbol.split('.')}
                      </Flex>
                    </td>
                    <td>
                      {walletToken.price !== 0 ? `$${walletToken.price.toFixed(2)}` : '?'}
                    </td>
                    <td>
                      {walletToken.amount.toFixed(2)}
                    </td>
                    <td>
                      ${(walletToken.amount * walletToken.price).toFixed(2)}
                    </td>
                    <td>
                      {walletToken.is_verified ? <VerifyIcon /> : "-"}
                    </td>
                    {/* <td>
                      <Button variant="outlined" style={{ color: '#2d74c4', border: '1px solid #2d74c4', padding: '3px 12px' }} href={`https://exchange.croxswap.com/#/swap/${walletToken.id}`}>Swap</Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel value={value} index={9}>
            <Text color='#EAE2FC' fontSize='18px' className='HeaderTitle'>Your Transactions</Text>
            <table className="table tablesorter table_portfolio" id="plain-table">
              <thead className="thead_portfolio_transaction">
                <tr>
                  <th>
                    Date
                  </th>
                  <th>
                    Amount
                  </th>
                  <th>
                    From/To
                  </th>
                  <th>
                    Txn Type
                  </th>
                  <th>
                    Txn Hash
                  </th>
                </tr>
              </thead>
              <tbody className="tbody_transaction">
                <tr>
                  <td>
                    22-12-2021 13:25
                  </td>
                  <td>
                    <Flex alignItems="center" justifyContent="center">
                      <img
                        src="/images/farms/crox.svg"
                        alt="crox"
                        width={20}
                        height={20}
                        style={{ margin: "0 5px" }}
                      />
                      550.356
                    </Flex>
                    $1025.56
                  </td>
                  <td>
                    <Flex alignItems="center" justifyContent="center">
                      <WithdrawIcon />
                      0x5d0...169c0
                    </Flex>
                  </td>
                  <td>
                    Withdrawal
                  </td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button href={`https://hecoinfo.com/address/${account}`} target="_blank">
                      <Flex alignItems='center'>
                        <Text color='#2d74c4' mr='3px'>0x5d0...69c0</Text>
                        <HiOutlineExternalLink style={{ fontSize: '20px', color: '#2d74c4' }} />
                      </Flex>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Text color='#EAE2FC' fontSize='18px' className='HeaderTitle'>Staked Farms & Pools</Text>
            <div className='headerCard headerCard_yield'>
              <Flex alignItems="center" ml='25px'>
                <SearchIcon style={{ position: 'fixed', marginLeft: 10 }} />
                <Input style={{ maxWidth: 250, paddingLeft: 40 }} placeholder="Search by Pool Name" />
              </Flex>
              <Card className='cardbody' >
                <CardActionArea>
                  <CardContent className="cardContent">
                    <Typography variant="h5" component="div" className='typography_text'>
                      <Text fontSize="20px" mr='3px' color='white'>Available to claim:</Text>
                      <Text fontSize="20px" color='white'>${divider(totalEarningAmount)}</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
            <table className="table tablesorter" id="plain-table">
              <thead className="thead_portfolio_yield">
                <tr>
                  <th style={{ padding: '10px 60px' }}>
                    Pool Name
                  </th>
                  <th>
                    APR
                  </th>
                  <th>
                    Staked Tokens
                  </th>
                  <th>
                    Rewards
                  </th>
                  <th>
                    Total Earnings
                  </th>
                  <th>
                    Status
                  </th>
                  <th>
                    Unlocked Tokens
                  </th>
                </tr>
              </thead>
              <tbody className="tbody_yield">
                {stakedDualFarmList.map((list, index) => (
                  <StakedDualFarmList
                    farmAddress={list.poolAddress}
                    farmImage={dualFarmImage[index]}
                    lpSymbol={list.lpSymbol}
                    farmApy={dualFarmApy[index]}
                    stakedBalance={list.userData.stakedBalance}
                    lpWorth={dualFarmLpWorth[index]}
                    earnings={list.userData.earnings}
                    active={list.active}
                    tokenPrice={list.tokenPrice}
                    tokenSymbol={list.tokenSymbol}
                    tokenDecimal={list.tokenDecimal}
                  />
                ))}
                {stakedNextGenList.map((list, index) => (
                  <StakedNextPoolList
                    farmAddress={list.poolAddress}
                    nextgenImage={nextgenImage[index]}
                    lpSymbol={list.lpSymbol}
                    nextgenApy={nextgenApy[index]}
                    stakedBalance={list.userData.stakedBalance}
                    earnings={list.userData.earnings}
                    active={list.active}
                    tokenPrice={list.tokenPrice}
                    tokenSymbol={list.tokenSymbol}
                  />
                ))}
              </tbody>
            </table>
          </TabPanel>
        </Box>
      ) : (
        <Box
          sx={{ flexGrow: 1, bgcolor: '#171923', height: 500 }}
        >
          <Flex justifyContent="center" className="tabcard_mobile">
            <div className='info_crox_wallet'>
              <Card sx={{ maxWidth: 250 }} className='tabbody' >
                <CardActionArea>
                  <CardContent className="cardContent">
                    <Typography variant="h5" component="div">
                      <Text fontSize="18px" mr='3px' color='white'>$CROX in Wallet</Text>
                      <Text><CakeWalletBalance color="#2d74c4" cakeBalance={cakeBalance} isInvestor fontSize="18px" /></Text>
                      <Text color="#2d74c4" style={{ textAlign: 'center' }} fontSize="18px">${(eggPrice * cakeBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
            <div className='info_crox_wallet'>
              <Card sx={{ maxWidth: 250 }} className='tabbody' >
                <CardActionArea>
                  <CardContent className="cardContent" style={{ margin: '12px 0px' }}>
                    <Typography variant="h5" component="div">
                      <Text fontSize="18px" mr='3px' color='white'>Net Wallet Portfolio</Text>
                      <Text color="#2d74c4" style={{ textAlign: 'center' }} fontSize="18px">${(eggPrice * cakeBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
            <div className='info_crox_wallet'>
              <Card sx={{ maxWidth: 250 }} className='tabbody' >
                <CardActionArea>
                  <CardContent className="cardContent" style={{ margin: '12px 0px' }}>
                    <Typography variant="h5" component="div">
                      <Text fontSize="18px" mr='3px' color='white'>Net Staked Amount</Text>
                      <Text color="#2d74c4" style={{ textAlign: 'center' }} fontSize="18px">${totalStakedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          </Flex>
          <Flex justifyContent="center">
            <Tabs
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              className="tabs_mobile"
            >
              <Tab icon={<FaWallet style={{ fontSize: '24px' }} />} iconPosition='start' label="WALLET" style={tabstyle} className="TabIcon leftTab" {...a11yProps(0)} />
              {/* <Tab icon={<Icon icon="akar-icons:arrow-right-left" style={{ fontSize: '24px' }} />} iconPosition='start' label="TRASACTIONS" style={tabstyle} className="TabIcon" {...a11yProps(1)} /> */}
              <Tab icon={<GiSprout style={{ fontSize: '24px' }} />} iconPosition='start' label="YIELD TRACKER" style={tabstyle} className="TabIcon leftTab" {...a11yProps(2)} />
            </Tabs>
          </Flex>
          <TabPanel value={value} index={0}>
            <Text color='#EAE2FC' fontSize='18px' className='HeaderTitle'>Your Portfolio</Text>
            <MobileTableWallet walletTokenList={walletTokenList} />
          </TabPanel>
          <TabPanel value={value} index={9}>
            <Text color='#EAE2FC' fontSize='18px' className='HeaderTitle headerTitle_mobile'>Your Transactions</Text>
            <MobileTableTransaction />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Text color='#EAE2FC' fontSize='18px' className='HeaderTitle headerTitle_mobile'>Staked Farms & Pools</Text>
            <MobileTableYield stakedFarmList={stakedFarmList} stakedDualFarmList={stakedDualFarmList} stakedPoolList={stakedPoolList} stakedNextGenList={stakedNextGenList} />
          </TabPanel>
        </Box>
      )}
    </>
  )
}

export default LeftTabs
