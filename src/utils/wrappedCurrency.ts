import { ChainId, Currency, CurrencyAmount, Token, Tron, WTRX } from '@intercroneswap/sdk-core';

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency?.isNative ? WTRX[chainId] : currency instanceof Token ? currency : undefined;
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined,
): CurrencyAmount<Token> | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined;
  return token && currencyAmount ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient) : undefined;
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WTRX[token.chainId])) return Tron.onChain(6);
  return token;
}
