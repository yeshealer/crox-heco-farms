export interface Config {
    address: string;
    network: string;
}

/* support network ===> eth, bsc, xdai, matic, ftm, okt, heco, avax, op, arb, celo, movr, cro, boba, metis, btt, aurora, mobm, sbch */

const walletList: Config[] = [
    {
        address: "0xc18a7e22b019dbcaf35554d9e88f6b0cf6ec4d22",
        network: "bsc",
    },
    {
        address: "0x04dfae6a2ebafc38a50ea2e5765a0fa5d98e2db0",
        network: "heco",
    },
]

export default walletList;