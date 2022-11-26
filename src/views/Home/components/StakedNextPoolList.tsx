import React from "react";
import { Flex, Text } from 'crox-new-uikit'
import BigNumber from 'bignumber.js';
import Button from '@mui/material/Button';
import { useGetCroxPrice } from "hooks/api";
import { getBalanceNumber } from "../../../utils/formatBalance";
import { usePriceCakeBusd } from "../../../state/hooks";
import { useDualHarvest } from "../../../hooks/useHarvest";

interface StakedNextPoolListProps {
    farmAddress?: string;
    nextgenImage?: string;
    lpSymbol?: string;
    nextgenApy?: any;
    stakedBalance?: BigNumber;
    earnings?: BigNumber;
    active?: boolean;
    tokenPrice?: number;
    tokenSymbol?: string;
}

const StakedNextPoolList: React.FC<StakedNextPoolListProps> = ({
    farmAddress,
    nextgenImage,
    lpSymbol,
    nextgenApy,
    stakedBalance,
    earnings,
    active,
    tokenPrice,
    tokenSymbol
}) => {
    const { onReward } = useDualHarvest(farmAddress);
    return (
        <tr>
            <td>
                <Flex alignItems="center" justifyContent="left" ml='10px'>
                    <img
                        src={`/images/farms/${nextgenImage.toLowerCase()}.svg`}
                        alt="crox"
                        width={35}
                        height={35}
                        style={{ margin: "0 5px" }}
                    />
                    <div>
                        {tokenSymbol}
                        <Text fontSize="14px" color="#2d74c4" className="farm_type" style={{ minWidth: '80px' }}>NextGen</Text>
                    </div>
                </Flex>
            </td>
            <td>
                {nextgenApy.times(new BigNumber(100)).toNumber().toFixed(2) > 100000 ? '100000'.toLocaleString() : nextgenApy.times(new BigNumber(100)).toNumber().toFixed(2)}%
            </td>
            <td>
                <Text color='white'>{lpSymbol === 'CNR' ? getBalanceNumber(stakedBalance, 8).toFixed(2) : getBalanceNumber(stakedBalance).toFixed(2)}LP</Text>
                ${lpSymbol === 'CNR' ? (getBalanceNumber(stakedBalance, 8) * tokenPrice).toFixed(2) : (getBalanceNumber(stakedBalance) * tokenPrice).toFixed(2)}
            </td>
            <td>
                <Flex justifyContent='center' alignItems='center'><Text fontSize="14px" color='white'>{tokenSymbol === 'CNR' ? getBalanceNumber(earnings[0], 8).toFixed(2) : getBalanceNumber(earnings[0]).toFixed(2)}</Text><Text fontSize='14px' color='#2d74c4'>{' '}{tokenSymbol}</Text></Flex>
                <Text fontSize="14px" color='white'>${tokenSymbol === 'CNR' ? (getBalanceNumber(earnings[0], 8) * tokenPrice).toFixed(2) : (getBalanceNumber(earnings[0]) * tokenPrice).toFixed(2)}</Text>
            </td>
            <td>
                <Text fontSize="14px" color='white'>${tokenSymbol === 'CNR' ? (getBalanceNumber(earnings[0], 8) * tokenPrice).toFixed(2) : (getBalanceNumber(earnings[0]) * tokenPrice).toFixed(2)}</Text>
                <Button variant="contained" onClick={() => onReward()} style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button>
            </td>
            <td>
                {!active ? <Text className='finished_farm'>Finished</Text> : <Text className='farming_farm'>Farming</Text>}
            </td>
            <td>
                <Text color='white'>{lpSymbol === 'CNR' ? getBalanceNumber(stakedBalance, 8).toFixed(2) : getBalanceNumber(stakedBalance).toFixed(2)}{' '}{lpSymbol}</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
            </td>
        </tr>
    )
}

export default StakedNextPoolList