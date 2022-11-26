import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { usePriceCakeBusd } from "state/hooks";
import { Button, Flex, Text } from "crox-uikit";
import useI18n from "hooks/useI18n";
import { useHarvest } from "hooks/useHarvest";
import { getBalanceNumber } from "utils/formatBalance";
import styled from "styled-components";
import useStake from "../../../../hooks/useStake";

interface FarmCardActionsProps {
  earnings?: BigNumber;
  pid?: number;
  nextHarvestUntil?: number;
  yourStakedBalance?: any;
}

const BalanceAndCompound = styled.div`
  display: flex;
  flex-direction: column;
`;

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  earnings,
  pid,
  nextHarvestUntil,
  yourStakedBalance
}) => {
  const TranslateString = useI18n();
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useHarvest(pid);
  const { onStake } = useStake(pid);

  const rawEarningsBalance = getBalanceNumber(earnings);
  const displayBalance = rawEarningsBalance.toLocaleString();

  const today = new Date().getTime() / 1000;
  const cakePriceUsd = usePriceCakeBusd();
  const croxEarnedUsd1 = cakePriceUsd.multipliedBy(rawEarningsBalance);

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection='column' mt='3px'>
        <Flex>
          <Text
            textTransform="uppercase"
            color="#2d74c4"
            fontSize="15px"
            pr="3px"
            bold
          >
            CROX
          </Text>
          <Text textTransform="uppercase" fontSize="15px" bold>
            {TranslateString(999, "Earned")}
          </Text>
        </Flex>
        <Text>
          <Text fontSize="18px" bold>{displayBalance}</Text>
          <Text textTransform="uppercase" fontSize="18px" bold>${croxEarnedUsd1.toFixed(3)}</Text>
        </Text>
      </Flex>

      <BalanceAndCompound>
        {pid === -1 ? (
          <Button
            disabled={rawEarningsBalance === 0 || pendingTx}
            size="sm"
            variant="secondary"
            onClick={async () => {
              setPendingTx(true);
              await onStake(rawEarningsBalance.toString());
              setPendingTx(false);
            }}
            mb='5px'
            style={{ borderRadius: '5px', borderColor: '#2d74c4', color: '#2d74c4' }}
          >
            {TranslateString(999, "Compound")}
          </Button>
        ) : null}
        {(rawEarningsBalance === 0 || pendingTx || today < nextHarvestUntil) ? (
          <Button disabled className='approve_btn' style={{ borderRadius: '5px', height: '32px', width: 'auto' }}>Harvest</Button>
        ) : (
          <Button
            onClick={async () => {
              setPendingTx(true);
              await onReward();
              setPendingTx(false);
            }}
            style={{ borderRadius: "5px", height: '32px', width: 'auto', backgroundColor: '#2d74c4' }}
          >
            Harvest
          </Button>
        )}
      </BalanceAndCompound>
    </Flex>
  );
};

export default HarvestAction;
