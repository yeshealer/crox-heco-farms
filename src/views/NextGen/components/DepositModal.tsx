import BigNumber from "bignumber.js";
import styled from "styled-components";
import React, { useCallback, useMemo, useState } from "react";
import { Button, Modal, Text, Flex, useModal } from "crox-new-uikit";
import ModalActions from "components/ModalActions";
import TokenInput from "components/TokenInput";
import { ConfirmPendingModal, ConfirmSubmitModal, ConfirmDismissModal } from 'components/ConfirmModal'
import useI18n from "hooks/useI18n";
import { getFullDisplayBalance } from "utils/formatBalance";

interface DepositModalProps {
  stakedBalance?: BigNumber;
  max: BigNumber;
  onConfirm: (amount: string, decimal?: number) => void;
  onDismiss?: () => void;
  tokenName?: string;
  depositFeeBP?: number;
  minFirstDeposit?: number;
  isDualFarm?: boolean;
  depositLink?: any
  tokenDecimal?: number
  isShrimpPool?: boolean
  isWhalePool?: boolean
  maxstakedBalance?: number
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = "",
  depositFeeBP = 0,
  depositLink,
  minFirstDeposit,
  stakedBalance,
  isDualFarm,
  tokenDecimal,
  isWhalePool,
  isShrimpPool,
  maxstakedBalance
}) => {
  const [val, setVal] = useState("");
  const isDeposit = true;
  const [pendingTx, setPendingTx] = useState(false);
  const TranslateString = useI18n();

  const isCroxPool = useMemo(() => {
    return tokenName === "CROX" && !isDualFarm ? true : false;
  }, [tokenName, isDualFarm]);

  const fullBalance = useMemo(() => {
    return new BigNumber(getFullDisplayBalance(max));
  }, [max]);

  const stakedChangedBalance = useMemo(() => {
    return new BigNumber(getFullDisplayBalance(stakedBalance));
  }, [stakedBalance]);

  const availableBalance = useMemo(() => {
    const maxLimit = new BigNumber(maxstakedBalance)
    return fullBalance.plus(stakedChangedBalance).isLessThan(maxLimit)
      ? fullBalance
      : maxLimit.minus(stakedChangedBalance);
  }, [stakedChangedBalance, fullBalance, maxstakedBalance]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const RE = /^\d*\.?\d{0,18}$/
      if (RE.test(e.currentTarget.value)) {
        setVal(e.currentTarget.value);
      }
    },
    [setVal]
  );

  const onConfirmResult = (res) => {
    if (res === null) {
      return onConfirmDismiss()
    }
    localStorage.setItem("bscAddress", res);
    return onConfirmSubmit()
  }

  const [onConfirmPending] = useModal(<ConfirmPendingModal value={val} tokenName={tokenName} />)
  const [onConfirmDismiss] = useModal(<ConfirmDismissModal />)
  const [onConfirmSubmit] = useModal(<ConfirmSubmitModal value={val} tokenName={tokenName} />)

  const handleSelectMax = useCallback(() => {
    setVal(String(isCroxPool ? availableBalance.toFixed() : fullBalance.toFixed()));
  }, [availableBalance, fullBalance, isCroxPool, setVal]);

  const disableConfirm = () => {
    if (pendingTx) return true;
    if (minFirstDeposit && !isDualFarm && !isWhalePool && !isShrimpPool) return new BigNumber(val).isLessThan(new BigNumber(minFirstDeposit));
    return isCroxPool ? new BigNumber(val).isGreaterThan(availableBalance) : new BigNumber(val).isGreaterThan(fullBalance);
  };

  return (
    <Modal
      title={`${TranslateString(316, "Deposit")} ${tokenName} Tokens`}
      onDismiss={onDismiss}
    >
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance.toFixed()}
        symbol={tokenName}
        depositFeeBP={depositFeeBP}
        depositLink={depositLink}
        isDeposit={isDeposit}
      />
      {
        tokenName && (tokenName === "CLA-USDT LP") && isDualFarm &&
        <Text color="primary" fontSize="14px"
          style={{ marginTop: "1rem", textAlign: "center" }}>Minimum Stake Limit: $3000</Text>
      }

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, "Cancel")}
        </Button>
        <Button
          disabled={disableConfirm()}
          onClick={async () => {
            setPendingTx(true)
            onConfirmPending()
            const res = await onConfirm(val);
            setPendingTx(false)
            onDismiss()
            onConfirmResult(res)
          }}
        >
          {pendingTx
            ? TranslateString(488, "Pending Confirmation")
            : TranslateString(464, "Confirm")}
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default DepositModal;
