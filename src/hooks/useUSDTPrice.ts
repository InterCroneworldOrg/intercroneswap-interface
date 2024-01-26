import { Currency, currencyEquals, JSBI, Price } from '@intercroneswap/v2-sdk'
import tokens from 'config/constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { PairState, usePairs } from './usePairs'

const { wbnb: WBNB, busd } = tokens

export default function useUSDTPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && currencyEquals(WBNB, wrapped) ? undefined : currency, chainId ? WBNB : undefined],
      [wrapped?.equals(busd) ? undefined : wrapped, busd],
      [chainId ? WBNB : undefined, busd],
    ],
    [chainId, currency, wrapped],
  )

  const [[ethPairState, ethPair], [busdPairState, busdPair], [busdEthPairState, busdEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }

    // handle weth/eth
    if (wrapped.equals(WBNB)) {
      if (busdPair) {
        const price = busdPair.priceOf(WBNB)
        return new Price(currency, busd, price.denominator, price.numerator)
      }
      return undefined
    }

    // handle usdt
    if (wrapped.equals(tokens.usdt)) {
      return new Price(tokens.usdt, tokens.usdt, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WBNB)
    const ethPairETHUSDTValue: JSBI =
      ethPairETHAmount && busdEthPair ? busdEthPair.priceOf(WBNB).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the usdt pair
    if (
      busdPairState === PairState.EXISTS &&
      busdPair &&
      busdPair.reserveOf(tokens.usdt).greaterThan(ethPairETHUSDTValue)
    ) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, tokens.usdt, price.denominator, price.numerator)
    }

    if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
      if (busdEthPair.reserveOf(tokens.usdt).greaterThan('0') && ethPair.reserveOf(WBNB).greaterThan('0')) {
        const ethUSDTPrice = busdEthPair.priceOf(tokens.usdt)
        const currencyEthPrice = ethPair.priceOf(WBNB)
        const usdtPrice = ethUSDTPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, tokens.usdt, usdtPrice.denominator, usdtPrice.numerator)
      }
    }

    return undefined
  }, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped])
}

export const useIcrUsdtPrice = (): Price | undefined => {
  return useUSDTPrice(tokens.icr)
}
