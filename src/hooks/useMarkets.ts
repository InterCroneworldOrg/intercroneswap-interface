import { Pair, TokenAmount, JSBI, Token } from '@intercroneswap/v2-sdk'
import { useMemo } from 'react'
import useActiveWeb3React from './useActiveWeb3React'

export interface MarketInfo {
  pair: Pair
  usdAmount: string
}

export function useMarkets(marketInfos: any[]): MarketInfo[] | null {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    return marketInfos.map((marketInfo) => {
      const tokenAInfo = marketInfo.pair.tokenAmount0
      const tokenBInfo = marketInfo.pair.tokenAmount1
      const tokenA = new Token(
        tokenAInfo.chain_id,
        tokenAInfo.address,
        tokenAInfo.decimals,
        tokenAInfo.symbol,
        tokenAInfo.name,
      )
      const tokenB = new Token(
        tokenBInfo.chain_id,
        tokenBInfo.address,
        tokenBInfo.decimals,
        tokenBInfo.symbol,
        tokenBInfo.name,
      )

      const tokenAmountA = new TokenAmount(tokenA, JSBI.BigInt(tokenAInfo.numerator))
      const tokenAmountB = new TokenAmount(tokenB, JSBI.BigInt(tokenBInfo.numerator))
      const pair = new Pair(tokenAmountA, tokenAmountB)
      return {pair, usdAmount: marketInfo.usdAmount}
    })
  }, [marketInfos, chainId])
}
