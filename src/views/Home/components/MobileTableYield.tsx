import React, { useState } from 'react'
import { Text, Flex } from 'crox-new-uikit'
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import BigNumber from 'bignumber.js';
import Collapse from '@mui/material/Collapse';
import { getAPYAndTVLOfFarm, getAPYAndTVLOfDualFarm, getAPYAndTVLOfPool, getAPYAndTVLOfNGPool } from "utils/defi";
import { useGetCroxPrice } from 'hooks/api';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDualHarvest, useHarvest } from 'hooks/useHarvest';
import { getBalanceNumber } from "../../../utils/formatBalance";
import { usePriceCakeBusd, usePriceBnbBusd } from "../../../state/hooks";

interface MobileTableYieldProps {
  stakedFarmList?: any
  stakedDualFarmList?: any
  stakedPoolList?: any
  stakedNextGenList?: any
}

const MobileTable: React.FC<MobileTableYieldProps> = ({
  stakedFarmList,
  stakedDualFarmList,
  stakedPoolList,
  stakedNextGenList
}) => {
  const [expandCollapse, setExpandCollapse] = useState([]);

  const handleExpandClick = (e) => {
    const newArr = expandCollapse;
    newArr[e] = !newArr[e];
    setExpandCollapse(newArr);
  }

  const eggPrice = useGetCroxPrice();

  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();

  const dualFarmImage = []
  const dualFarmApyGroup = []
  const dualFarmApy = []
  const dualFarmLpWorth = []
  for (let i = 0; i < stakedDualFarmList.length; i++) {
    dualFarmImage[i] = stakedDualFarmList[i].lpSymbol.split(" ")[0].toLowerCase()
    dualFarmApyGroup[i] = getAPYAndTVLOfDualFarm(stakedDualFarmList[i], { cakePrice, bnbPrice })
    dualFarmApy[i] = (dualFarmApyGroup[i].apy1).plus(dualFarmApyGroup[i].apy2)
    dualFarmLpWorth[i] = new BigNumber(dualFarmApyGroup[i].totalValue)
      .div(new BigNumber(stakedDualFarmList[i].lpBalance))
      .toFixed(2);
  }
  const nextgenImage = []
  const nextgenApyGroup = []
  const nextgenApy = []
  const nextgenLpWorth = []
  for (let i = 0; i < stakedNextGenList.length; i++) {
    nextgenImage[i] = stakedNextGenList[i].tokenSymbol
    nextgenApyGroup[i] = getAPYAndTVLOfNGPool(stakedNextGenList[i], { cakePrice, bnbPrice })
    nextgenApy[i] = (nextgenApyGroup[i].apy1).plus(nextgenApyGroup[i].apy2)
    nextgenLpWorth[i] = new BigNumber(nextgenApyGroup[i].totalValue)
      .div(new BigNumber(stakedNextGenList[i].lpBalance))
      .toFixed(2);
  }

  const ismobile = useMediaQuery("(max-width: 520px)")

  const RenderClaimButton = (pid) => {
    const { onReward } = useHarvest(pid)
    return (
      <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }} onClick={() => onReward()}>Claim</Button>
    )
  }

  const RenderDualClaimButton = (address) => {
    const { onReward } = useDualHarvest(address)
    return (
      <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }} onClick={() => onReward()}>Claim</Button>
    )
  }

  return (
    <Flex justifyContent='center' style={{ margin: '5px' }} className="MobileTable" flexDirection='column'>
      {stakedDualFarmList && stakedDualFarmList.map((list, index) => (
        <Card style={{ backgroundColor: '#242542', marginBottom: '5px' }} onClick={() => handleExpandClick(`${list.pid}dual`)}>
          <CardContent style={{ padding: 5, backgroundColor: '#242542' }}>
            <Flex justifyContent='space-between' alignItems='center' p={!ismobile ? '5px 10px' : '5px 0'}>
              <div>
                <Flex alignItems="center" justifyContent="center">
                  <img
                    src={`/images/farms/${dualFarmImage[index]}.svg`}
                    alt={`${dualFarmImage[index]}`}
                    width={35}
                    height={35}
                    style={{ margin: "0 5px" }}
                  />
                  <div>
                    <Text color="white">{list.lpSymbol}</Text>
                    <Text fontSize="14px" color="#2d74c4" className="farm_type">DualFarm</Text>
                  </div>
                </Flex>
              </div>
              <div>
                <Text fontSize="14px" color='white'>${((getBalanceNumber(list.userData.earnings[0]) * eggPrice) + (getBalanceNumber(list.userData.earnings[1]) as any * list.tokenPrice)).toFixed(2)}</Text>
                {/* <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button> */}
                {RenderDualClaimButton(list.poolAddress)}
              </div>
              <div>
                <Text color='white'>{getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
              </div>
              <div>
                {!list.active ? <Text className='finished_farm'>{ismobile ? '' : 'Finished'}</Text> : <Text className='farming_farm'>{ismobile ? '' : 'Farming'}</Text>}
              </div>
            </Flex>
          </CardContent>
          <Collapse in={expandCollapse[`${list.pid}dual`]} timeout="auto" unmountOnExit sx={{ backgroundColor: 'rgb(55, 55, 100)' }}>
            <Flex justifyContent='space-between' alignItems='center' p='5px 10px'>
              <div>
                <Text color="#2d74c4">APR:</Text>
                <Text color='white'>{dualFarmApy[index].times(new BigNumber(100)).toNumber().toFixed(2)}%</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Staked Token:</Text>
                <Text color='white'>{getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                <Text color='white'>${(getBalanceNumber(list.userData.stakedBalance) * dualFarmLpWorth[index]).toFixed(2)}</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Rewards:</Text>
                <Flex justifyContent='center' alignItems='center'><Text fontSize="14px" color='white'>{getBalanceNumber(list.userData.earnings[0]).toFixed(2)}</Text><Text fontSize="14px" color='#2d74c4'>CROX</Text><Text fontSize='14px' color='white'> + {getBalanceNumber(list.userData.earnings[1], list.tokenDecimal).toFixed(2)}</Text><Text fontSize='14px' color='#2d74c4'>{list.tokenSymbol}</Text></Flex>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(list.userData.earnings[0]) as any * eggPrice).toFixed(2)} + ${(getBalanceNumber(list.userData.earnings[1], list.tokenDecimal) as any * list.tokenPrice).toFixed(2)}</Text>
                <Text fontSize="14px" color='white'>(A) + (B)</Text>
              </div>
            </Flex>
          </Collapse>
        </Card>
      ))}
      {stakedNextGenList && stakedNextGenList.map((list, index) => (
        <Card style={{ backgroundColor: '#242542', marginBottom: '5px' }} onClick={() => handleExpandClick(`${list.pid}next`)}>
          <CardContent style={{ padding: 5, backgroundColor: '#242542' }}>
            <Flex justifyContent='space-between' alignItems='center' p={!ismobile ? '5px 10px' : '5px 0'}>
              <div>
                <Flex alignItems="center" justifyContent="center">
                  <img
                    src={`/images/farms/${nextgenImage[index]}.svg`}
                    alt={`${nextgenImage[index]}`}
                    width={35}
                    height={35}
                    style={{ margin: "0 5px" }}
                  />
                  <div>
                    <Text color="white">{list.tokenSymbol}</Text>
                    <Text fontSize="14px" color="#2d74c4" className="farm_type" style={{ minWidth: '100px' }}>NextGen</Text>
                  </div>
                </Flex>
              </div>
              <div>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(list.userData.earnings[0]) * list.tokenPrice).toFixed(2)}</Text>
                {/* <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button> */}
                {RenderDualClaimButton(list.poolAddress)}
              </div>
              <div>
                <Text color='white'>{list.lpSymbol === 'CNR' ? getBalanceNumber(list.userData.stakedBalance, 8).toFixed(2) : getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
              </div>
              <div>
                {!list.active ? <Text className='finished_farm'>{ismobile ? '' : 'Finished'}</Text> : <Text className='farming_farm'>{ismobile ? '' : 'Farming'}</Text>}
              </div>
            </Flex>
          </CardContent>
          <Collapse in={expandCollapse[`${list.pid}next`]} timeout="auto" unmountOnExit sx={{ backgroundColor: 'rgb(55, 55, 100)' }}>
            <Flex justifyContent='space-between' alignItems='center' p='5px 10px'>
              <div>
                <Text color="#2d74c4">APR:</Text>
                <Text color='white'>{nextgenApy[index].times(new BigNumber(100)).toNumber().toFixed(2)}%</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Staked Token:</Text>
                <Text color='white'>{list.lpSymbol === 'CNR' ? getBalanceNumber(list.userData.stakedBalance, 8).toFixed(2) : getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                <Text>${list.lpSymbol === 'CNR' ? (getBalanceNumber(list.userData.stakedBalance, 8) * nextgenLpWorth[index]).toFixed(2) : (getBalanceNumber(list.userData.stakedBalance) * nextgenLpWorth[index]).toFixed(2)}</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Rewards:</Text>
                <Flex justifyContent='center' alignItems='center'><Text fontSize="14px" color='white'>{getBalanceNumber(list.userData.earnings[0]).toFixed(2)}</Text><Text fontSize='14px' color='#2d74c4'>{list.tokenSymbol}</Text></Flex>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(list.userData.earnings[0]) * list.tokenPrice).toFixed(2)}</Text>
              </div>
            </Flex>
          </Collapse>
        </Card>
      ))}
    </Flex>
  )
}

export default MobileTable