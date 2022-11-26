import React from 'react'
import { Text, useWalletModal, ConnectorId, LinkExternal, Flex, Input, useMatchBreakpoints, } from 'crox-new-uikit'
import { useWeb3React } from '@web3-react/core';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import SearchIcon from '@mui/icons-material/Search';
import CakeWalletBalance from "./CakeWalletBalance";
import { getBalanceNumber } from "../../../utils/formatBalance";
import { getCakeAddress } from "../../../utils/addressHelpers";
import useTokenBalance from "../../../hooks/useTokenBalance";
import { useTotalValue, usePriceCakeBusd } from "../../../state/hooks";
import WalletIcon from "./Icon/walletIcon_port";
import HarvestIcon from "./Icon/harvestIcon_port";
import TransactionIcon from "./Icon/transactionIcon";
import VerifyIcon from "./Icon/VerifyIcon";
import WithdrawIcon from "./Icon/withdrawIcon";
import DepositIcon from "./Icon/depositIcon";
import './LeftTabs.css'

const MobileTable: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [isVerified, setIsVerified] = React.useState(true)
  const totalValue = useTotalValue();

  function divider(res) {
    if(res >= 10 ** 9 ) {
      return `${(res/10**9).toFixed(2)}B`
    }
    if(res >= 10 ** 6 ) {
      return `${(res/10**6).toFixed(2)}M`
    }
    if(res >= 10 ** 3) {
      return `${(res/1000).toFixed(2)}K`
    }
    return res.toFixed(2)
  }
  
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()));
  const eggPrice = usePriceCakeBusd().toNumber();

  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  return (
    <Flex justifyContent='center' style={{margin: '5px 0'}} className="MobileTable">
        <Card style={{backgroundColor: '#242542'}} onClick={handleExpandClick}>
            <CardContent style={{padding: 5, backgroundColor: '#242542'}}>
                <tbody className="tbody_wallet tbody_wallet_transaction">
                    <tr>
                        <td>
                            <Flex alignItems="center" justifyContent="center">
                                <img
                                src="/images/farms/crox.svg"
                                alt="crox"
                                width={20}
                                height={20}
                                style={{ margin: "0 5px" }}
                                />
                                <Text>550.356</Text>
                            </Flex>
                            <Text>$1025.56</Text>
                        </td>
                        <td>
                            <WithdrawIcon />
                        </td>
                        <td>
                            <LinkExternal>0x5d0...169c0</LinkExternal>
                        </td>
                    </tr>
                </tbody>
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <tbody className="tbody_wallet tbody_wallet_transaction_expand">
                    <tr>
                        <td>
                            <Text>Date:</Text>
                            <Text>22-12-2021 13:25</Text>
                        </td>
                        <td>
                            <Text>Txn Type:</Text>
                            <Text>Withdrawal</Text>
                        </td>
                    </tr>
                </tbody>
            </Collapse>
        </Card>
    </Flex>
  )
}
  
export default MobileTable