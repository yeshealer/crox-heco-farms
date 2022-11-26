import BigNumber from "bignumber.js";
import { ethers } from "ethers";

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account });
};

export const stake = async (
  masterChefContract,
  pid,
  amount,
  account,
  referral = "0x0000000000000000000000000000000000000000",
  decimal = 18
): Promise<any> => {
  return new Promise((resolve) => {
    masterChefContract.methods
      .deposit(
        pid,
        new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString(),
        referral
      )
      .send({ from: account })
      .on("transactionHash", (tx) => {
        resolve(tx);
      })
      .on("error", () => {
        resolve(null);
      })
  })
};

export const getDecimals = (pid) => {
  if (pid === 27) return 8
  return 18
}

export const nextStake = async (nextGenContract, amount, account, decimal = 18): Promise<any> => {
  return new Promise((resolve) => {
    nextGenContract.methods
      .deposit(new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString())
      .send({ from: account })
      .on("transactionHash", (tx) => {
        resolve(tx);
      })
      .on("error", () => {
        resolve(null);
      })
  });
};

export const grandStake = async (GrandContract, amount, account, decimal = 18): Promise<any> => {
  return new Promise((resolve) => {
    GrandContract.methods
      .deposit(new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString())
      .send({ from: account })
      .on("transactionHash", (tx) => {
        resolve(tx);
      })
      .on("error", () => {
        resolve(null);
      })
  });
};

export const unstake = async (
  masterChefContract,
  pid,
  amount,
  account,
  decimal = 18
): Promise<any> => {
  return new Promise((resolve) => {
    masterChefContract.methods
      .withdraw(
        pid,
        new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString()
      )
      .send({ from: account })
      .on("transactionHash", (tx) => {
        resolve(tx);
      })
      .on("error", () => {
        resolve(null);
      })
  });
};

export const nextUnstake = async (nextGenContract, amount, account, decimal): Promise<any> => {
  return new Promise((resolve) => {
    nextGenContract.methods
      .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString())
      .send({ from: account })
      .on("transactionHash", (tx) => {
        resolve(tx);
      })
      .on("error", () => {
        resolve(null);
      })
  });
};

export const grandUnstake = async (GrandContract, amount, account, decimal): Promise<any> => {
  return new Promise((resolve) => {
    GrandContract.methods
      .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString())
      .send({ from: account })
      .on("transactionHash", (tx) => {
        resolve(tx);
      })
      .on("error", () => {
        resolve(null);
      })
  });
};

export const prevunstake = async (masterChefContract, pid, amount, account): Promise<any> => {
  return new Promise((resolve) => {
    masterChefContract.methods
      .withdraw(pid, amount)
      .send({ from: account })
      .on("transactionHash", (tx) => {
        resolve(tx);
      })
  });
};

export const harvest = async (
  masterChefContract,
  pid,
  account,
  referral = "0x0000000000000000000000000000000000000000"
) => {
  return masterChefContract.methods
    .deposit(pid, "0", referral)
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const nextHarvest = async (nextGenContract, account) => {
  return nextGenContract.methods
    .withdraw("0")
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const grandHarvest = async (GrandContract, account) => {
  return GrandContract.methods
    .deposit("0")
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const xpadHarvest = async (XpadContract, account) => {
  return XpadContract.methods
    .claimTokens()
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const compound = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .compound(pid)
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};
