import { Currency, Token } from '@intercroneswap/sdk-core';

export function currencyId(currency: Currency): string {
  if (currency.isNative) return 'TRX';
  if (currency instanceof Token) return currency.address;
  throw new Error('invalid currency');
}
