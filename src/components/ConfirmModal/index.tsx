import React from "react";
import { Modal, Text, Flex, Link, Button } from "crox-new-uikit";
import "./loader.css";
import "./iconAnimation.scss";

export interface ConfirmProps {
  value?: any
  tokenName?: string
  onDismiss?: () => void
  hecoinfoaddress?: any
  isWithdraw?: boolean
  icobuytoken?: any
}

export const ConfirmPendingModal: React.FC<ConfirmProps> = ({
  value,
  tokenName,
  onDismiss,
  isWithdraw,
  icobuytoken
}) => {
  const modalTitle = "Waiting for confirmation";
  return (
    <Modal title={modalTitle} onDismiss={onDismiss}>
      <div className="spinner" style={{ marginBottom: "20px" }}>
        <div className="head" />
      </div>
      {isWithdraw ? <Text color="white" style={{ textAlign: "center" }}>Withdrawing {value} {tokenName}</Text> : <Text color="white" style={{ textAlign: "center" }}><>{icobuytoken ? "Pledging" : "Staking"}</> {value} {tokenName}</Text>}
      <Text color="white" style={{ textAlign: "center" }}>Confirm this transaction in your wallet</Text>
    </Modal>
  );
};

export const ConfirmSubmitModal: React.FC<ConfirmProps> = ({
  onDismiss,
}) => {
  const bscAddress = localStorage.getItem("bscAddress")
  const modalTitle = "Transaction Submitted"
  return (
    <Modal title={modalTitle} onDismiss={onDismiss}>
      <Flex justifyContent="center" style={{ marginBottom: "20px" }}>
        <Link external href={`https://hecoinfo.com/tx/${bscAddress}`} bold={false} color="white">
          <Text color="#2d74c4" fontSize="20px">View on HecoInfo</Text>
        </Link>
      </Flex>
      <Button onClick={onDismiss} style={{ marginLeft: "36%" }}>Close</Button>
    </Modal>
  );
};

export const ConfirmDismissModal: React.FC<ConfirmProps> = ({
  onDismiss,
}) => {
  const modalTitle = "Error";
  return (
    <Modal title={modalTitle} onDismiss={onDismiss}>
      <div className="sa">
        <div className="sa-warning">
          <div className="sa-warning-body" />
          <div className="sa-warning-dot" />
        </div>
      </div>

      <Text style={{ textAlign: "center", marginBottom: "20px" }}>Transaction rejected</Text>
      <Button onClick={onDismiss} style={{ marginLeft: "34%" }}>Dismiss</Button>
    </Modal>
  );
};