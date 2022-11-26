import { useEffect, useState } from 'react'

/*
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */
export const baseUrl = 'https://api.pancakeswap.com/api/v1';
const api = 'https://api.pancakeswap.info/api/v2/tokens';

/* eslint-disable camelcase */

export interface TradePair {
  swap_pair_contract: string
  base_symbol: string
  quote_symbol: string
  last_price: number
  base_volume_24_h: number
  quote_volume_24_h: number
}

export interface ApiStatResponse {
  update_at: string
  '24h_total_volume': number
  total_value_locked: number
  total_value_locked_all: number
  trade_pairs: {
    [key: string]: TradePair
  }
}

export const useGetStats = () => {
  const [data, setData] = useState<ApiStatResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/stat`)
        const responsedata: ApiStatResponse = await response.json()

        setData(responsedata)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export const useGetPriceData = () => {
  const [data, setData] = useState<any | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api)
        const res: any = await response.json()
        if (res.data) {
          const result = {}
          const keys = Object.keys(res.data)
          keys.forEach((key) => {
            const keyData = res.data[key]
            result[keyData.symbol] = String(keyData.price)
          })

          setData({
            prices: result,
            update_at: '',
          })
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export const useGetCNSPriceVsBnb = () => {
  const [price, setPrice] = useState<any | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/https://api.coingecko.com/api/v3/simple/price?ids=centric-cash&vs_currencies=bnb')
        const res: any = await response.json()

        if (res && res['centric-cash'] && res['centric-cash'].bnb) {
          setPrice(res['centric-cash'].bnb)
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [setPrice])

  return price
}

export const useGetCroxPrice = () => {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=croxswap&vs_currencies=usd');
        const res: any = await response.json();
        const croxPrice = res.croxswap.usd;

        if (croxPrice) {
          setPrice(croxPrice)
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [setPrice])

  return price
}

export const useGetBNBPrice = () => {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
        const res: any = await response.json();
        const croxPrice = res.binancecoin.usd;

        if (croxPrice) {
          setPrice(croxPrice)
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [setPrice])

  return price
}
