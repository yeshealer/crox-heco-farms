import React from "react";
import { Flex, Text } from 'crox-new-uikit'
import BigNumber from 'bignumber.js';
import { getBalanceNumber } from "utils/formatBalance";
import { usePriceCakeBusd } from "state/hooks";
import Button from '@mui/material/Button';
import { useHarvest } from "hooks/useHarvest";

interface StakedFarmListProps {
    farmPid?: number;
    farmImage?: string;
    lpSymbol?: string;
    farmApy?: any;
    stakedBalance?: BigNumber;
    lpWorth?: number;
    earnings?: BigNumber;
    multiplier?: string
}

const StakedFarmList: React.FC<StakedFarmListProps> = ({
    farmPid,
    farmImage,
    lpSymbol,
    farmApy,
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
                        src={`/images/farms/${farmImage}.svg`}
                        alt="crox"
                        width={35}
                        height={35}
                        style={{ margin: "0 5px" }}
                    />
                    <div>
                        {lpSymbol}
                        <Text fontSize="14px" color="#2d74c4" className="farm_type">Farm</Text>
                    </div>
                </Flex>
            </td>
            <td>
                {farmApy.times(new BigNumber(100)).toNumber().toFixed(2)}%
            </td>
            <td>
                <Text color='white'>{getBalanceNumber(stakedBalance).toFixed(2)}LP</Text>
                ${(getBalanceNumber(stakedBalance) * lpWorth).toFixed(2)}
            </td>
            <td>
                <Flex alignItems='center' justifyContent='center'><Text fontSize="14px" color='white' >{getBalanceNumber(earnings).toFixed(2)}</Text><Text fontSize="14px" color='#2d74c4'>CROX</Text></Flex>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(earnings) * eggPrice).toFixed(2)}</Text>
            </td>
            <td>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(earnings) * eggPrice).toFixed(2)}</Text>
                {(earnings && (getBalanceNumber(earnings) * eggPrice) !== 0) ? <Button variant="contained" onClick={() => onReward()} style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button> : <Button variant="contained" style={{ padding: '0px 12px', color: 'grey' }} disabled>Claimed</Button>}
            </td>
            <td>
                {multiplier === '0X' ? <Text className='finished_farm'>Finished</Text> : <Text className='farming_farm'>Farming</Text>}
            </td>
            <td>
                <Text color='white'>{getBalanceNumber(stakedBalance).toFixed(2)}LP</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
            </td>
        </tr>
    )
}

export default StakedFarmList