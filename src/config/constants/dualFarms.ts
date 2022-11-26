import contracts from "./contracts";
import { DualFarmConfig, QuoteToken } from "./types";

const farms: DualFarmConfig[] = [

  // {
  //   pid: 3,
  //   risk: 5,
  //   lpSymbol: "CROX-DUSD LP",
  //   lpType: "MDEX LP",
  //   poolAddress: {
  //     128: "0xed5ea55e742841d19a998fa99b1a34b4f29cb086",
  //   },
  //   lpAddresses: {
  //     128: "0x70c3d900AF641E9Bbc8679fC6E31A493ddedCA1b",
  //   },
  //   tokenSymbol: "DMT",
  //   tokenPrice: 0.00061,
  //   tokenAddresses: {
  //     128: "0x57A7BcdfAb1631ACA9d6E0f39959477182CfAe12",
  //   },
  //   tokenDecimal: 18,
  //   quoteTokenPrice: 0.09,
  //   quoteTokenSymbol: QuoteToken.CAKE,
  //   quoteTokenAdresses: contracts.cake,
  //   title: "",
  //   duration: 30,
  //   minStaking: 30,
  //   active: true,
  //   newPool: 1647254021000,
  //   isDualFarm: true,
  //   reward1: 20000,
  //   reward2: 1350000,
  //   showBackground: true,
  //   projectLink: "https://demeter.vip/#/",
  //   cgProjectID: "dmt-token",
  //   depositLink:
  //     "https://ht.mdex.com/#/add/0x9F5c80dc840f9cc60670a20c1e5d0fbD3E13B015/0x381785593F9BAcE15aF908ac108b5f538155Ff3e",
  // },
  {
    pid: 2,
    risk: 5,
    lpSymbol: "CROX-WNOW LP",
    lpType: "MDEX LP",
    poolAddress: {
      128: "0x6528dF3361d414ae84fcAa65DB6c4db242ba2830",
    },
    lpAddresses: {
      128: "0xB37967119F8db57f16A1a39fDFe9316FA7aC4a41",
    },
    tokenSymbol: "WNOW",
    tokenPrice: 0.04924,
    tokenAddresses: {
      128: "0x81c9309D8598fb863bbD337d35DCB6036bcD51Ae",
    },
    tokenDecimal: 18,
    quoteTokenPrice: 0.09,
    quoteTokenSymbol: QuoteToken.CAKE,
    quoteTokenAdresses: contracts.cake,
    title: "",
    duration: 90,
    minStaking: 30,
    active: true,
    newPool: 1644130449000,
    isDualFarm: true,
    reward1: 30000,
    reward2: 60000,
    showBackground: true,
    projectLink: "https://walletnow.net/",
    cgProjectID: "walletnow",
    depositLink:
      "https://ht.mdex.com/#/add/0x381785593F9BAcE15aF908ac108b5f538155Ff3e/0x81c9309D8598fb863bbD337d35DCB6036bcD51Ae",
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: "CROX-USDT LP",
    lpType: "MDEX LP",
    poolAddress: {
      128: "0x127b72729885c6b08FA39965B8d233DA86cfb95f",
    },
    lpAddresses: {
      128: "0x6a1086e9a3dbfdcb5c10250a80dedaf9dac2cf22",
    },
    tokenSymbol: "HUSD",
    tokenPrice: 1,
    tokenAddresses: {
      128: "0x0298c2b32eae4da002a15f36fdf7615bea3da047",
    },
    tokenDecimal: 8,
    quoteTokenPrice: 1,
    quoteTokenSymbol: QuoteToken.USDT,
    quoteTokenAdresses: contracts.usdt,
    title: "",
    duration: 90,
    minStaking: 30,
    active: true,
    newPool: 1645902884000,
    isDualFarm: true,
    reward1: 60000,
    reward2: 3000,
    showBackground: true,
    projectLink: "https://croxswap.com",
    cgProjectID: 'husd',
    depositLink:
      "https://ht.mdex.com/#/add/0x381785593F9BAcE15aF908ac108b5f538155Ff3e/0xa71EdC38d189767582C38A3145b5873052c3e47a",
  },

  {
    pid: -1,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      128: "0xa9b1a527f2e77b0ae670d61a997f3b3585ba0c1d"
    },
    lpAddresses: {
      128: "0x381785593F9BAcE15aF908ac108b5f538155Ff3e"
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.1,
    tokenAddresses: {
      128: "0x381785593F9BAcE15aF908ac108b5f538155Ff3e"
    },
    tokenDecimal: 18,
    quoteTokenSymbol: QuoteToken.WHT,
    quoteTokenAdresses: {
      128: "0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F"
    },
    title: "",
    duration: 90,
    newPool: 1645902884000,
    isDualFarm: false,
    active: true,
    reward2: 80000,
    showBackground: true,
    isTokenOnly: true,
    projectLink: 'https://croxswap.com',
    depositLink: 'https://exchange.croxswap.com'
  },
  // {
  //   pid: -2,
  //   risk: 5,
  //   lpSymbol: "CROX",
  //   lpType: "No Fees",
  //   poolAddress: {
  //     128: "0x4e85c6d33436c6e300beaa925a8f8f8ce2843bde"
  //   },
  //   lpAddresses: {
  //     128: "0x9F5c80dc840f9cc60670a20c1e5d0fbD3E13B015"
  //   },
  //   tokenSymbol: "DUSD",
  //   tokenPrice: 0.745,
  //   tokenAddresses: {
  //     128: "0x9F5c80dc840f9cc60670a20c1e5d0fbD3E13B015"
  //   },
  //   tokenDecimal: 18,
  //   quoteTokenSymbol: QuoteToken.WHT,
  //   quoteTokenAdresses: {
  //     128: "0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F"
  //   },
  //   title: "",
  //   duration: 30,
  //   newPool: 1646965960000,
  //   isDualFarm: false,
  //   active: true,
  //   reward2: 5100,
  //   showBackground: false,
  //   isTokenOnly: true,
  //   cgProjectID: 'demeter-usd',
  //   projectLink: 'https://demeter.xyz/#/',
  //   depositLink: 'https://exchange.croxswap.com'
  // }
];
export default farms;
