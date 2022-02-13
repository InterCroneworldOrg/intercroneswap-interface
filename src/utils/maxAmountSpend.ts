import { Currency, CurrencyAmount, Tron } from '@intercroneswap/sdk-core';
import JSBI from 'jsbi';
import { MIN_ETH } from '../constants';

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount<Currency>): CurrencyAmount<Currency> | undefined {
  if (!currencyAmount) return undefined;
  if (currencyAmount.currency.isNative) {
    if (JSBI.greaterThan(currencyAmount.quotient, MIN_ETH)) {
      return CurrencyAmount.fromRawAmount(Tron.onChain(6), JSBI.subtract(currencyAmount.quotient, MIN_ETH));
    } else {
      return CurrencyAmount.fromRawAmount(Tron.onChain(6), JSBI.BigInt(0));
    }
  }
  return currencyAmount;
}
