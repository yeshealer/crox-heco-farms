import contracts from "./contracts";
import { FarmConfig, QuoteToken } from "./types";

const farms: FarmConfig[] = [
  // {
  //   pid: 0,
  //   pidv1: 12,
  //   risk: 5,
  //   lpSymbol: "BNB-CROX LP",
  //   lpAddresses: {
  //     97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
  //     56: "0xE38e899cc99ddeA9737e06f0A22046d0CA904D70",
  //   },
  //   tokenSymbol: "CROX",
  //   tokenAddresses: {
  //     97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
  //     56: "0x2c094F5A7D1146BB93850f629501eB749f6Ed491",
  //   },
  //   quoteTokenSymbol: QuoteToken.BNB,
  //   quoteTokenAdresses: contracts.wbnb,
  //   title: "",
  // },
  // {
  //   pid: 4,
  //   pidv1: 16,
  //   risk: 2,
  //   lpSymbol: "BNB-BUSD LP",
  //   lpAddresses: {
  //     97: "",
  //     56: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
  //   },
  //   tokenSymbol: "BNB",
  //   tokenAddresses: contracts.wbnb,
  //   quoteTokenSymbol: QuoteToken.BUSD,
  //   quoteTokenAdresses: contracts.busd,
  //   title: "",
  // }
];

export default farms;
