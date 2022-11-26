import React from "react";
import { Flex, Text } from 'crox-new-uikit'
import BigNumber from 'bignumber.js';
import Button from '@mui/material/Button';
import { getBalanceNumber } from "utils/formatBalance";
import { usePriceCakeBusd } from "state/hooks";
import { useHarvest } from "hooks/useHarvest";

interface StakedPoolListProps {
    farmPid?: number;
    poolImage?: string;
    lpSymbol?: string;
    poolApy?: any;
    stakedBalance?: BigNumber;
    lpWorth?: number;
    earnings?: BigNumber;
    multiplier?: string
}

const StakedPoolList: React.FC<StakedPoolListProps> = ({
    farmPid,
    poolImage,
    lpSymbol,
    poolApy,
    stakedBalance,
    lpWorth,
    earnings,
    multiplier
}) => {
    const { onReward } = useHarvest(farmPid);
    const eggPrice = usePriceCakeBusd().toNumber();
    return (
        <tr>
            <td>
                <Flex alignItems="center" justifyContent="left" ml='10px'>
                    <img
                        src={`/images/farms/${poolImage}.svg`}
                        alt="crox"
                        width={35}
                        height={35}
                        style={{ margin: "0 5px" }}
                    />
                    <div>
                        {lpSymbol}
                        <Text fontSize="14px" color="#2d74c4" className="farm_type" style={{ minWidth: '80px' }}>Pool</Text>
                    </div>
                </Flex>
            </td>
            <td>
                {poolApy.times(new BigNumber(100)).toNumber().toFixed(2)}%
            </td>
            <td>
                <Text color='white'>{lpSymbol === 'CNR' ? getBalanceNumber(stakedBalance, 8).toFixed(2) : getBalanceNumber(stakedBalance).toFixed(2)}LP</Text>
                ${lpSymbol === 'CNR' ? (getBalanceNumber(stakedBalance, 8) * lpWorth).toFixed(2) : (getBalanceNumber(stakedBalance) * lpWorth).toFixed(2)}
            </td>
            <td>
                <Flex justifyContent='center' alignItems='center'><Text fontSize="14px" color='white'>{getBalanceNumber(earnings).toFixed(2)}</Text><Text fontSize='14px' color='#2d74c4'>{lpSymbol}</Text></Flex>
                <Text fontSize="14px">${(getBalanceNumber(earnings) * eggPrice).toFixed(2)}</Text>
            </td>
            <td>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(earnings) * eggPrice).toFixed(2)}</Text>
                <Button variant="contained" onClick={async () => onReward()} style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button>
            </td>
            <td>
                {multiplier === '0X' ? <Text className='finished_farm'>Finished</Text> : <Text className='farming_farm'>Farming</Text>}
            </td>
            <td>
                <Text color='white'>{lpSymbol === 'CNR' ? getBalanceNumber(stakedBalance, 8).toFixed(2) : getBalanceNumber(stakedBalance).toFixed(2)}{lpSymbol}</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
            </td>
        </tr>
    )
}

export default StakedPoolList