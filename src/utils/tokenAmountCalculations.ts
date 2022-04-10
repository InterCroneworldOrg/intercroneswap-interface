import { JSBI, TokenAmount } from '@intercroneswap/v2-sdk';

export function MultiplyTokenAmount(tokenAmount: TokenAmount, multiplier: number): TokenAmount {
  return new TokenAmount(tokenAmount.token, JSBI.multiply(tokenAmount.raw, JSBI.BigInt(multiplier)));
}

export function DoubleTokenAmount(tokenAmount: TokenAmount): TokenAmount {
  return MultiplyTokenAmount(tokenAmount, 2);
}
