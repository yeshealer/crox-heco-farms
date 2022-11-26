import React, { useEffect, useRef } from "react";
import { Text, Flex } from "crox-new-uikit";
import axios from "axios";
import { usePriceCakeBusd } from "state/hooks";
import styled from "styled-components"
import walletList from './walletList'
import './croxBalance.css'

const Container = styled.div`
    margin: auto;
    width: 100%;
    max-width: 100%;
    background: ${({ theme }) => (theme.isDark ? 'radial-gradient(at center, #0f1c3c, #121827)' : 'radial-gradient(at center, #ffeddd, #ffffff)')};
    ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
    margin: auto;
    }
`

const Page = styled(Container)`
    min-height: calc(100vh - 64px);
    padding: 12px;
`

const MiddlePage = styled.div`
    margin: auto;
`

const TableHeaderText = styled(Text)`
    padding: 5px 10px;
    background-color: #1D8CF8
`

const CroxBalance: React.FC = () => {
    const cakePrice = usePriceCakeBusd()
    const croxBalance = useRef([])
    useEffect(() => {
        walletList.map(async (entry) => {
            const walletInfo = await axios.get(`https://openapi.debank.com/v1/user/token_list?id=${entry.address}&chain_id=${entry.network}&is_all=true`)
            console.log(walletInfo.data)
            const walletBalance = (walletInfo.data) as any
            for (let i = 0; i < walletBalance.length; i++) {
                if (walletBalance[i].symbol === 'CROX') {
                    croxBalance.current.push(walletBalance[i])
                }
            }
        })
    }, [])
    return (
        <Page>
            <MiddlePage>
                <Flex justifyContent='center' mt='32vh'>
                    <table>
                        <thead className='table_header'>
                            <tr>
                                <th>
                                    Router
                                </th>
                                <th>
                                    Network
                                </th>
                                <th>
                                    TokenSymbol
                                </th>
                                <th>
                                    TokenAddress
                                </th>
                                <th>
                                    TokenPrice
                                </th>
                                <th>
                                    Amount
                                </th>
                                <th>
                                    USDValue
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table_body">
                            {croxBalance.current.map((entry, index) => {
                                return (
                                    <tr>
                                        <td>
                                            <Text>{walletList[index].address}</Text>
                                        </td>
                                        <td>
                                            <Flex>
                                                <img
                                                    src={`/images/network/${walletList[index].network}_net.svg`}
                                                    alt={walletList[index].network}
                                                    width={25}
                                                    height={25}
                                                />
                                                <Text ml="5px">{walletList[index].network.toUpperCase()}</Text>
                                            </Flex>
                                        </td>
                                        <td>
                                            <Flex alignItems="center" justifyContent="center">
                                                <img
                                                    src="/images/farms/crox.svg"
                                                    alt="crox"
                                                    width={35}
                                                    height={35}
                                                    style={{ margin: "0 5px" }}
                                                />
                                                CROX
                                            </Flex>
                                        </td>
                                        <td>
                                            <Text>{entry.id}</Text>
                                        </td>
                                        <td>
                                            <Text>{cakePrice.toFixed(3)}</Text>
                                        </td>
                                        <td>
                                            <Text>{entry.amount.toFixed(2)}</Text>
                                        </td>
                                        <td>
                                            <Text>${(Number(cakePrice) * entry.amount).toFixed(2)}</Text>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Flex>
            </MiddlePage>
        </Page>
    )
}

export default CroxBalance;
