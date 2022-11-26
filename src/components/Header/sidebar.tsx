import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js/bignumber";
import {
  Button,
} from "@kenshooui/react-menu";
import {
  Text,
  Flex,
  Link
} from "crox-new-uikit";
import useTheme from "hooks/useTheme";
import HomeIcon from '@mui/icons-material/Home';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PoolIcon from '@mui/icons-material/Pool';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useHistory } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";
import { useGetCroxPrice } from "hooks/api";
import BridgeIcon from './Icon/bridgeIcon'
import BridgeIconWhite from './Icon/bridgeIcon_white'
// import CroxMasHeaderIcon from "../../views/CroxMas/components/CroxMasHeaderIcon"
import './switchButton.css'

const StyledButton = styled(Button)`
  align-items: center;
  display: flex !important;
`

const StyledButtonItem = styled(Button)`
text-align: left;
  align-items: center;
  display: flex !important;
  color: #d1d1d1;
  padding: 10px 12px;
  width: 185px;
  margin-left: 25px;
`

const StyledButtonGroup = styled.div`
  padding: 3px 0;
  border-top: 1px solid #8080801c;
  border-bottom: 1px solid #8080801c;
`

export default props => {
  const cakePrice = useGetCroxPrice();
  const cakePriceUsd = new BigNumber(cakePrice);
  const history = useHistory();
  const { isDark, toggleTheme } = useTheme();
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [snowBanner, setSnowBanner] = useState("")
  const [element, setElement] = useState(window.localStorage.getItem('target_id'))
  const unselect = 'menu_item'
  const select = isDark ? 'menu_item menu_active' : 'menu_item menu_active_white'
  const onElement = (data) => {
    setIsOpenMenu(false)
    window.localStorage.setItem('target_id', data.target.id)
    setElement(window.localStorage.getItem('target_id'))
    switch (window.localStorage.getItem('target_id')) {
      case 'ico':
        history.push("/ico")
        break;
      case 'home':
        history.push("/")
        break;
      case 'farms':
        history.push("/hecofarms")
        break;
      case 'pools':
        history.push("/hecopools")
        break;
      case 'croxmas':
        history.push("/croxmas")
        break;
      default:
    }
  }
  const onTrade = () => {
    if (document.getElementById('trade_group').style.display === 'none') {
      document.getElementById('trade_group').style.display = 'block'
      document.getElementById('bridge_iswap').style.display = 'none'
      // document.getElementById('window_icon').style.top = '573px'
    } else {
      document.getElementById('trade_group').style.display = 'none'
      // document.getElementById('window_icon').style.top = '385px'
    }
  }

  const onBridge = () => {
    if (document.getElementById('bridge_iswap').style.display === 'none') {
      document.getElementById('bridge_iswap').style.display = 'block'
      document.getElementById('trade_group').style.display = 'none'
      // document.getElementById('window_icon').style.top = '435px'
    } else {
      document.getElementById('bridge_iswap').style.display = 'none'
      // document.getElementById('window_icon').style.top = '385px'
    }
  }

  const SwitchClick = (data) => {
    toggleTheme()
  }
  const handleStateChange = (state) => {
    setIsOpenMenu(state.isOpen)
  }
  useEffect(() => {
    if (!isDark) {
      document.getElementById("crox_price").parentElement.parentElement.style.backgroundColor = '#defaff'
      document.getElementById("crox_price").firstElementChild.classList.add('white_mode_price')
    }
    else {
      document.getElementById("crox_price").parentElement.parentElement.style.backgroundColor = "black"
      document.getElementById("crox_price").firstElementChild.classList.remove('white_mode_price')
    }
  })

  return (
    <>
      <Menu id="menu_body" {...props} isOpen={isOpenMenu} onStateChange={(state) => handleStateChange(state)}>
        <Button className="closeButton" onClick={() => setIsOpenMenu(false)}>&#10006;</Button>
        <Link href='https://coinmarketcap.com/currencies/croxswap' external style={{ textDecoration: 'none' }}>
          <div className="menu_croxprice" id="crox_price">
            <Text className="croxprice" color="white">$CROX: ${cakePriceUsd.toFixed(3)}</Text>
          </div>
        </Link>
        <Flex flexDirection='column' style={{ position: 'relative', height: '450px', overflow: 'scroll', overflowX: 'hidden' }}>
          <StyledButton className={element === 'home' ? select : unselect} id="home" onClick={(e) => onElement(e)}>
            {isDark ? <HomeIcon sx={{ fontSize: '18px', color: 'white' }} id="home" onClick={(e) => onElement(e)} /> : <HomeIcon sx={{ fontSize: '18px', color: '#0498aec7' }} id="home" onClick={(e) => onElement(e)} />}
            <Text fontSize="18px" ml="7px" id="home" onClick={(e) => onElement(e)}>Home</Text>
          </StyledButton>

          <StyledButton className={element === 'trade' ? select : unselect} id="trade" onClick={() => onTrade()}>
            {isDark ? <AccountBalanceIcon sx={{ fontSize: '18px', color: 'white' }} id="trade" /> : <AccountBalanceIcon sx={{ fontSize: '18px', color: '#0498aec7' }} id="trade" />}
            <Text fontSize="18px" ml="7px" id="trade" mr="103px">Trade</Text>
            {isDark ? <ArrowDropDownIcon id="trade" sx={{ color: 'white' }} /> : <ArrowDropDownIcon sx={{ color: '#0498aec7' }} id="trade" />}
          </StyledButton>
          <StyledButtonGroup id="trade_group" style={{ display: 'none' }}>
            <StyledButtonItem>
              <a style={isDark ? { fontSize: '16px', width: '180px' } : { fontSize: '16px', width: '180px', color: '#0498aec7' }} href="https://ht.mdex.com/#/swap?inputCurrency=0xa71edc38d189767582c38a3145b5873052c3e47a&outputCurrency=0x381785593F9BAcE15aF908ac108b5f538155Ff3e
">Swap (MDEX)</a>
            </StyledButtonItem>
            <StyledButtonItem>
              <a style={isDark ? { fontSize: '16px', width: '180px' } : { fontSize: '16px', width: '180px', color: '#0498aec7' }} href="https://ht.mdex.com/#/add/0xa71EdC38d189767582C38A3145b5873052c3e47a/0x381785593F9BAcE15aF908ac108b5f538155Ff3e">Liquidity (MDEX)</a>
            </StyledButtonItem>
          </StyledButtonGroup>

          <StyledButton className={element === 'farms' ? select : unselect} id="farms" onClick={(e) => onElement(e)}>
            {isDark ? <AgricultureIcon sx={{ fontSize: '18px', color: 'white' }} id="farms" onClick={(e) => onElement(e)} /> : <AgricultureIcon sx={{ fontSize: '18px', color: '#0498aec7' }} id="farms" onClick={(e) => onElement(e)} />}
            <Text fontSize="18px" ml="7px" id="farms" onClick={(e) => onElement(e)}>Farms</Text>
          </StyledButton>

          <StyledButton className={element === 'pools' ? select : unselect} id="pools" onClick={(e) => onElement(e)}>
            {isDark ? <PoolIcon sx={{ fontSize: '18px', color: 'white' }} id="pools" onClick={(e) => onElement(e)} /> : <PoolIcon sx={{ fontSize: '18px', color: '#0498aec7' }} id="pools" onClick={(e) => onElement(e)} />}
            <Text fontSize="18px" ml="7px" id="pools" onClick={(e) => onElement(e)}>Pools</Text>
          </StyledButton>

          <StyledButton className={element === 'bridge' ? select : unselect} id="bridge" onClick={(e) => onBridge()}>
            <div style={{ width: '18px', height: '18px', marginTop: '-7px' }}>{!isDark ? <BridgeIconWhite /> : <BridgeIcon />}</div>
            <Text fontSize="18px" ml="7px" id="trade" mr='96px'>Bridge</Text>
            {isDark ? <ArrowDropDownIcon id="trade" sx={{ color: 'white' }} /> : <ArrowDropDownIcon sx={{ color: '#0498aec7' }} id="trade" />}
          </StyledButton>
          <StyledButtonGroup id="bridge_iswap" style={{ display: 'none' }}>
            <StyledButtonItem>
              <a style={isDark ? { fontSize: '16px', width: '180px' } : { fontSize: '16px', width: '180px', color: '#0498aec7' }} href="https://app.multichain.org/#router">Multichain Bridge</a>
            </StyledButtonItem>
            <StyledButtonItem>
              <a style={isDark ? { fontSize: '16px', width: '180px' } : { fontSize: '16px', width: '180px', color: '#0498aec7' }} href="https://bridge.croxswap.com">CROX Bridge (soon)</a>
            </StyledButtonItem>
          </StyledButtonGroup>

          {/* <StyledButton className={element === 'referral' ? select : unselect} id="referral" onClick={(e) => onElement(e)}>
            {isDark ? <ThumbUpOffAltIcon sx={{ fontSize: '18px', color: 'white' }} id="pools" onClick={(e) => onElement(e)} /> : <ThumbUpOffAltIcon sx={{ fontSize: '18px', color: '#0498aec7' }} id="pools" onClick={(e) => onElement(e)} />}
            {isDark ? <a style={{ fontSize: '18px', width: '160px', marginLeft: '7px', color: '#EAE2FC' }} href="https://referral.croxswap.com">Referral</a> : <a style={{ fontSize: '18px', width: '160px', marginLeft: '7px', color: '#2B2A29' }} href="https://bridge.croxswap.com">Referral</a>}
          </StyledButton>

          <StyledButton className={element === 'ico' ? select : unselect} id="ico" onClick={(e) => onElement(e)}>
            <div style={{ width: '18px', height: '18px', marginTop: '-7px' }} id="ico">{isDark ? <RocketLaunchIcon sx={{ fontSize: '18px', color: 'white' }} id="pools" onClick={(e) => onElement(e)} /> : <RocketLaunchIcon sx={{ fontSize: '18px', color: '#0498aec7' }} id="pools" onClick={(e) => onElement(e)} />}</div>
            {isDark ? <Text style={{ fontSize: '18px', width: '160px', marginLeft: '7px', color: '#EAE2FC' }} id="ico" >Xpad</Text> : <Text style={{ fontSize: '18px', width: '160px', marginLeft: '7px', color: '#2B2A29' }} id="ico">Xpad</Text>}
          </StyledButton> */}

          {/* <StyledButton className={element === 'referral' ? select : unselect} id="croxmas" onClick={(e) => onElement(e)}>
            <CroxMasHeaderIcon />
            <Text className="HotPink-Glitter" color="white" style={{ marginLeft: '25px', fontFamily: 'Mountains of Christmas' }} id="croxmas" onClick={(e) => onElement(e)}>CROXMAS</Text>
          </StyledButton> */}
        </Flex>

        <div style={{ position: 'absolute', bottom: '55px', left: '20px' }}>
          <Button className="wrapper_switch" onClick={(e) => SwitchClick(e)}>
            <div className={isDark ? 'tdnn' : 'tdnn day'}>
              <div className={isDark ? 'moon' : 'moon sun'} />
            </div>
          </Button>
        </div>
        <div
          style={isDark ? {
            display: "flex",
            alignItems: "center",
            position: 'absolute',
            bottom: 15
          } : {
            padding: '5px 10px 2px',
            display: "flex",
            alignItems: "center",
            position: 'absolute',
            bottom: 15,
            backgroundColor: "#0498aec7",
            borderRadius: '10px',
            left: '16px'
          }}
        >
          <a href="https://t.me/croxswap">
            <img
              src="/icon_telegram.svg"
              alt="telegram"
              style={{ marginRight: "12px" }}
            />
          </a>
          <a href="https://twitter.com/croxswap">
            <img
              src="/icon_twitter.svg"
              alt="twitter"
              style={{ marginRight: "12px" }}
            />
          </a>
          <a href="https://github.com/croxswap">
            <img
              src="/icon_github.svg"
              alt="github"
              style={{ marginRight: "12px" }}
            />
          </a>
          <a href="https://www.youtube.com/channel/UCPEJ2aiaH03VwKe4YoFWSGw">
            <img
              src="/icon_youtube.svg"
              alt="youtube"
              style={{ marginRight: "12px" }}
            />
          </a>
          <a href="https://croxswap.medium.com">
            <img
              src="/icon_medium.svg"
              alt="blog"
              style={{ marginRight: "12px" }}
            />
          </a>
          <a href="https://reddit.com/r/croxswap">
            <img
              src="/icon_reddit.svg"
              alt="reddit"
              style={isDark ? { marginRight: "12px" } : {}}
            />
          </a>
        </div>
      </Menu>
      <Button style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => { setIsOpenMenu(true) }}><MenuIcon sx={{ color: 'white' }} /></Button>
    </>
  );
};