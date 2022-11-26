import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { usePriceCakeBusd } from "state/hooks";
import { Button, Flex, Heading, Text } from "crox-uikit";
import useI18n from "hooks/useI18n";
import { useDualHarvest, useHarvest } from "hooks/useHarvest";
import { getBalanceNumber } from "utils/formatBalance";
import useMediaQuery from "@mui/material/useMediaQuery";
import styled from "styled-components";
import useDualStake from "hooks/useDualStake";

interface FarmCardActionsProps {
  earnings?: any;
  pid?: number;
  nextHarvestUntil?: number;
  isDualFarm?: boolean;
  firstSymbol: string;
  secondSymbol: string;
  removed?: boolean;
  harvestLockDay?: any;
  tokenDecimal: number;
  tokenPrice?: number;
  isWhalePool?: boolean;
  isShrimpPool?: boolean;
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`;

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  removed,
  firstSymbol,
  secondSymbol,
  earnings,
  pid,
  nextHarvestUntil,
  isDualFarm,
  tokenDecimal,
  tokenPrice,
  harvestLockDay,
  isWhalePool,
  isShrimpPool
}) => {
  const TranslateString = useI18n();
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useDualHarvest(pid);
  const { onDualStake } = useDualStake(pid);

  const calcStartTime = (diff) => {
    const second = Math.floor(diff % 60);
    const minutes = Math.floor((diff / 60) % 60);
    const hours = Math.floor((diff / 3600) % 24);
    const days = Math.floor(diff / 3600 / 24);

    return (
      (days > 0 ? `${days} : ` : "") +
      (hours >= 0 ? `${hours} : ` : "") +
      (minutes >= 0 ? `${minutes} : ` : "") +
      (second >= 0 ? `${second}` : "")
    );
  };

  const rawEarningsBalance1 = getBalanceNumber(
    !isDualFarm && !isWhalePool && !isShrimpPool
      ? new BigNumber(earnings[0]).times(
        10 ** (tokenDecimal ? 18 - tokenDecimal : 0)
      )
      : earnings[0]
  );
  const displayBalance1 = rawEarningsBalance1.toLocaleString();

  const rawEarningsBalance2 = getBalanceNumber(
    isDualFarm || isWhalePool || isShrimpPool
      ? new BigNumber(earnings[1]).times(
        10 ** (tokenDecimal ? 18 - tokenDecimal : 0)
      )
      : earnings[1],
    !isDualFarm && (isWhalePool || isShrimpPool) ? 8 : 18
  );
  const displayBalance2 = rawEarningsBalance2.toLocaleString();

  const today = new Date().getTime() / 1000;
  const [harvestlock, setHarvesLock] = useState("0");

  useEffect(() => {
    const timer = setInterval(() => {
      const today1 = new Date().getTime() / 1000;
      const harvestCalc = calcStartTime((nextHarvestUntil - today1));
      setHarvesLock(harvestCalc);
    }, 1000);
    return () => clearInterval(timer); // cleanup the timer
  }, [nextHarvestUntil, harvestLockDay]);

  const ismobile = useMediaQuery("(max-width: 600px)")

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="center" mt='3px'>
        {isDualFarm || isWhalePool || isShrimpPool ? (
          <>
            <Flex>
              <Text bold fontSize="15px" color="#2d74c4" mr='3px'>{firstSymbol}</Text>
              <Text bold fontSize="15px">Earned</Text>
            </Flex>
            <Text bold fontSize="18px">{displayBalance1}</Text>
            <Flex>
              <Text bold fontSize="15px" color="#2d74c4" mr='3px'>{secondSymbol}</Text>
              <Text bold fontSize="15px">Earned</Text>
            </Flex>
            <Text bold fontSize="18px">{displayBalance2}</Text>
          </>
        ) : (
          <>
            <Flex mt={removed || ismobile ? '5px' : '0'}>
              <Text bold fontSize="15px" color="#2d74c4" mr='3px'>{secondSymbol}</Text>
              <Text bold fontSize="15px">Earned</Text>
            </Flex>
            <Text bold fontSize="18px">{displayBalance1}</Text>
          </>
        )}
      </Flex>
      <BalanceAndCompound>
        {((rawEarningsBalance1 === 0 && rawEarningsBalance2 === 0) || pendingTx || today < nextHarvestUntil) ? (
          <Button disabled style={{borderRadius: '5px', height: '32px'}} className='approve_btn' mt={!isDualFarm && !isWhalePool && !isShrimpPool && !removed ? "20px" : "0"}>Claim Rewards</Button>
        ) : (
          <Button
            onClick={async () => {
              setPendingTx(true);
              await onReward();
              setPendingTx(false);
            }}
            style={{ height: "32px", borderRadius: "5px" }}
            mt={!isDualFarm && !isWhalePool && !isShrimpPool ? "20px" : "0"}
          >
            Claim Rewards
          </Button>
        )}
        {!removed && <Text fontSize="15px" bold>{harvestlock}</Text>}
      </BalanceAndCompound>
    </Flex>
  );
};

export default HarvestAction;
