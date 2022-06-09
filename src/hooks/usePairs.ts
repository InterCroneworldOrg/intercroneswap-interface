import { Token, TokenAmount, Pair, Currency, JSBI, ChainId } from '@intercroneswap/v2-sdk'
import { useMemo } from 'react'
import IPancakePairABI from 'config/abi/IPancakePair.json'
import { Interface } from '@ethersproject/abi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import useInterval from './useInterval'
import { time } from 'console'
import { chain } from 'lodash'

const PAIR_INTERFACE = new Interface(IPancakePairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
      }),
    [tokens],
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString())),
      ]
    })
  }, [results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}

export function useDbPairs(pairInfos: any[]): Pair[] | null {
  const { chainId } = useActiveWeb3React()

  console.log(pairInfos)

  return useMemo(() => {
    return pairInfos.map((pairInfo) => {
      const tokenAInfo = pairInfo.TokenAmount0
      const tokenBInfo = pairInfo.TokenAmount1
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
      return new Pair(tokenAmountA, tokenAmountB)
    })
  }, [pairInfos, chainId])
}
