import React from 'react'
import { Text, Flex, useMatchBreakpoints, } from 'crox-new-uikit'
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import CakeWalletBalance from "./CakeWalletBalance";
import { getBalanceNumber } from "../../../utils/formatBalance";
import { getCakeAddress } from "../../../utils/addressHelpers";
import useTokenBalance from "../../../hooks/useTokenBalance";
import { usePriceCakeBusd } from "../../../state/hooks";
import VerifyIcon from "./Icon/VerifyIcon";

interface MobileTableProps {
  walletTokenList?: any
}

const MobileTable: React.FC<MobileTableProps> = ({
  walletTokenList
}) => {
  const [croxExpanded, setCroxExpanded] = React.useState(false);
  const [expandCollapse, setExpandCollapse] = React.useState([]);

  const handleCroxExpandClick = () => {
    setCroxExpanded(!croxExpanded);
  };

  const handleExpandClick = (e) => {
    const newArr = expandCollapse;
    newArr[e] = !newArr[e];
    setExpandCollapse(newArr);
  }

  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()));
  const eggPrice = usePriceCakeBusd().toNumber();

  return (
    <Flex justifyContent='center' style={{ margin: '5px 0' }} className="MobileTable" flexDirection='column'>
      <Card style={{ backgroundColor: '#242542', width: '100%', margin: '0 5px 5px' }} onClick={handleCroxExpandClick}>
        <CardContent style={{ padding: 5, backgroundColor: '#242542' }}>
          <Flex justifyContent='space-between' alignItems='center'>
            <div>
              <Flex alignItems="center" justifyContent="center">
                <img
                  src="/images/farms/crox.svg"
                  alt="crox"
                  width={35}
                  height={35}
                  style={{ margin: "0 5px" }}
                />
                <Text>CROX</Text>
              </Flex>
            </div>
            <div>
              <CakeWalletBalance color="white" cakeBalance={cakeBalance} isInvestor fontSize="14px" />
            </div>
            <div>
              <VerifyIcon />
            </div>
            <div>
              <Button variant="outlined" style={{ color: '#2d74c4', border: '1px solid #2d74c4', padding: '3px 12px' }}>Swap</Button>
            </div>
          </Flex>
        </CardContent>
        <Collapse in={croxExpanded} timeout="auto" unmountOnExit style={{ padding: '5px 10px' }}>
          <Flex justifyContent='space-between' alignItems='center'>
            <div>
              <Text>Token Price:</Text>
              <Text>${eggPrice.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</Text>
            </div>
            <div>
              <Text>Token Value($):</Text>
              <Text>${(eggPrice * cakeBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </div>
          </Flex>
        </Collapse>
      </Card>
      {walletTokenList && walletTokenList.map((walletToken) => (
        <Card style={{ backgroundColor: '#242542', width: '100%', margin: '0 5px 5px' }} onClick={() => handleExpandClick(walletToken.symbol.split('.'))}>
          <CardContent style={{ padding: 5, backgroundColor: '#242542' }}>
            <Flex justifyContent='space-between' alignItems='center'>
              <div>
                <Flex alignItems="center" justifyContent="center">
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
                  <Text fontSize='14px'>{walletToken.symbol.split('.')}</Text>
                </Flex>
              </div>
              <div>
                <Text fontSize='14px'>{walletToken.amount.toFixed(2)}</Text>
              </div>
              <div>
                {walletToken.is_verified ? <VerifyIcon /> : "-"}
              </div>
              <div>
                <Button variant="outlined" style={{ color: '#2d74c4', border: '1px solid #2d74c4', padding: '3px 12px' }} href={`https://exchange.croxswap.com/#/swap/${walletToken.id}`}>Swap</Button>
              </div>
            </Flex>
          </CardContent>
          <Collapse in={expandCollapse[walletToken.symbol.split('.')]} timeout="auto" unmountOnExit style={{ padding: '5px 10px' }}>
            <Flex justifyContent='space-between' alignItems='center'>
              <div>
                <Text>Token Price:</Text>
                <Text>{walletToken.price !== 0 ? `$${walletToken.price.toFixed(2)}` : '?'}</Text>
              </div>
              <div>
                <Text>Token Value($):</Text>
                <Text>${(walletToken.amount * walletToken.price).toFixed(2)}</Text>
              </div>
            </Flex>
          </Collapse>
        </Card>
      ))}
    </Flex>
  )
}

export default MobileTable