export interface Config {
    title: string;
    img: string;
    color: string;
    link?: string;
}
const networkList: Config[] = [
    {
        title: "BNB",
        img: "bsc",
        color: "#f0b90b",
        link: "https://app.croxswap.com"
    },
    {
        title: "HECO",
        img: 'heco',
        color: "#01943f",
        link: 'https://heco.croxswap.com'
    },
]

export default networkList;