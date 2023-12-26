import { Currency, currencyEquals, JSBI, Price } from '@intercroneswap/v2-sdk'
import tokens from 'config/constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { multiplyPriceByAmount } from 'utils/prices'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { PairState, usePairs } from './usePairs'

const { wvc: WBNB } = tokens
const { usdt } = tokens

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && currencyEquals(WBNB, wrapped) ? undefined : currency, chainId ? WBNB : undefined],
      [wrapped?.equals(usdt) ? undefined : wrapped, usdt],
      [chainId ? WBNB : undefined, usdt],
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
        return new Price(currency, usdt, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(usdt)) {
      return new Price(usdt, usdt, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WBNB)
    const ethPairETHBUSDValue: JSBI =
      ethPairETHAmount && busdEthPair ? busdEthPair.priceOf(WBNB).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (busdPairState === PairState.EXISTS && busdPair && busdPair.reserveOf(usdt).greaterThan(ethPairETHBUSDValue)) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, usdt, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
      if (busdEthPair.reserveOf(usdt).greaterThan('0') && ethPair.reserveOf(WBNB).greaterThan('0')) {
        const ethBusdPrice = busdEthPair.priceOf(usdt)
        const currencyEthPrice = ethPair.priceOf(WBNB)
        const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, usdt, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped])
}

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export function useBUSDPriceB(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && currencyEquals(WBNB, wrapped) ? undefined : currency, chainId ? WBNB : undefined],
      [wrapped?.equals(usdt) ? undefined : wrapped, usdt],
      [chainId ? WBNB : undefined, usdt],
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
        return new Price(currency, usdt, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(usdt)) {
      return new Price(usdt, usdt, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WBNB)
    const ethPairETHBUSDValue: JSBI =
      ethPairETHAmount && busdEthPair ? busdEthPair.priceOf(WBNB).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (busdPairState === PairState.EXISTS && busdPair && busdPair.reserveOf(usdt).greaterThan(ethPairETHBUSDValue)) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, usdt, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
      if (busdEthPair.reserveOf(usdt).greaterThan('0') && ethPair.reserveOf(WBNB).greaterThan('0')) {
        const ethBusdPrice = busdEthPair.priceOf(usdt)
        const currencyEthPrice = ethPair.priceOf(WBNB)
        const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, usdt, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped])
}

export const useCorrectBUSDPrice = (currency?: Currency): Price | undefined => {
  if (!currency) return undefined
  return currency.symbol.endsWith('_b') ? useBUSDPriceB(currency) : useBUSDPrice(currency)
}

export const useCakeBusdPrice = (): Price | undefined => {
  const cakeBusdPrice = useBUSDPrice(tokens.wvc)
  return cakeBusdPrice
}

export const useIcrBusdPrice = (): Price | undefined => {
  return useBUSDPrice(tokens.wvc)
}

export const useBUSDCurrencyAmount = (currency: Currency, amount: number): number | undefined => {
  const { chainId } = useActiveWeb3React()
  const busdPrice = useBUSDPrice(currency)
  const wrapped = wrappedCurrency(currency, chainId)
  if (busdPrice) {
    return multiplyPriceByAmount(busdPrice, amount, wrapped.decimals)
  }
  return undefined
}

export const useBUSDCakeAmount = (amount: number): number | undefined => {
  const cakeBusdPrice = useCakeBusdPrice()
  if (cakeBusdPrice) {
    return multiplyPriceByAmount(cakeBusdPrice, amount)
  }
  return undefined
}

export const useBNBBusdPrice = (): Price | undefined => {
  const bnbBusdPrice = useBUSDPrice(tokens.wvc)
  return bnbBusdPrice
}
