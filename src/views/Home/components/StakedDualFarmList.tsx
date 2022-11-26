import React from "react";
import { Flex, Text } from 'crox-new-uikit'
import BigNumber from 'bignumber.js';
import Button from '@mui/material/Button';
import { getBalanceNumber } from "utils/formatBalance";
import { useGetCroxPrice } from "hooks/api";
import { usePriceCakeBusd } from "state/hooks";
import { useDualHarvest } from "hooks/useHarvest";

interface StakedDualFarmListProps {
    farmAddress?: string;
    farmImage?: string;
    lpSymbol?: string;
    farmApy?: any;
    stakedBalance?: BigNumber;
    lpWorth?: number;
    earnings?: BigNumber;
    active?: boolean;
    tokenPrice?: number;
    tokenSymbol?: string;
    tokenDecimal?: number;
}

const StakedDualFarmList: React.FC<StakedDualFarmListProps> = ({
    farmAddress,
    farmImage,
    lpSymbol,
    farmApy,
    stakedBalance,
    lpWorth,
    earnings,
    active,
    tokenPrice,
    tokenSymbol,
    tokenDecimal
}) => {
    const { onReward } = useDualHarvest(farmAddress);
    const eggPrice = useGetCroxPrice();
    return (
        <tr>
            <td>
                <Flex alignItems="center" justifyContent="left" ml='10px'>
                    <img
                        src={`/images/farms/${farmImage.toLowerCase()}.svg`}
                        alt="crox"
                        width={35}
                        height={35}
                        style={{ margin: "0 5px" }}
                    />
                    <div>
                        {lpSymbol}
                        <Text fontSize="14px" color="#2d74c4" className="farm_type">DualFarm</Text>
                    </div>
                </Flex>
            </td>
            <td>
                {farmApy.times(new BigNumber(100)).toNumber() > 100000 ? '100000'.toLocaleString() : farmApy.times(new BigNumber(100)).toNumber().toFixed(2)}%
            </td>
            <td>
                <Text color='white'>{getBalanceNumber(stakedBalance).toFixed(2)}LP</Text>
                ${(getBalanceNumber(stakedBalance) * lpWorth).toFixed(2)}
            </td>
            <td>
                <Flex justifyContent='center' alignItems='center'><Text fontSize="14px" color='white'>{getBalanceNumber(earnings[0]).toFixed(2)}</Text><Text fontSize="14px" color='#2d74c4'>{' '}CROX</Text><Text fontSize='14px' color='white'> + {getBalanceNumber(earnings[1], tokenDecimal).toFixed(2)}</Text><Text fontSize='14px' color='#2d74c4'>{' '}{tokenSymbol}</Text></Flex>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(earnings[0]) * eggPrice).toFixed(2)} + ${(getBalanceNumber(earnings[1], tokenDecimal) * tokenPrice).toFixed(2)}</Text>
                <Text fontSize="14px" color='white'>(A) + (B)</Text>
            </td>
            <td>
                <Text fontSize="14px" color='white'>${((getBalanceNumber(earnings[0]) * eggPrice) + (getBalanceNumber(earnings[1]) * tokenPrice)).toFixed(2)}</Text>
                {(earnings && (getBalanceNumber(earnings) * eggPrice) !== 0) ? <Button variant="contained" onClick={() => onReward()} style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button> : <Button variant="contained" style={{ padding: '0px 12px', color: 'grey' }} disabled>Claimed</Button>}
            </td>
            <td>
                {!active ? <Text className='finished_farm'>Finished</Text> : <Text className='farming_farm'>Farming</Text>}
            </td>
            <td>
                <Text color='white'>{getBalanceNumber(stakedBalance).toFixed(2)}{' '}LP</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
            </td>
        </tr>
    )
}

export default StakedDualFarmList