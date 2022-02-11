import { ChainId, Currency, CurrencyAmount, ETHER, Token, WETH } from '@intercroneswap/sdk-core';

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency === ETHER ? WETH[chainId] : currency instanceof Token ? currency : undefined;
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined,
): CurrencyAmount<Token> | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined;
  return token && currencyAmount ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient) : undefined;
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WETH[token.chainId])) return ETHER;
  return token;
}
