import { CurrencyAmount, JSBI, Price, TokenAmount } from '@intercroneswap/v2-sdk'
import tokens from 'config/constants/tokens'

export function MultiplyTokenAmount(tokenAmount: TokenAmount, multiplier: number): TokenAmount {
  return new TokenAmount(tokenAmount.token, JSBI.multiply(tokenAmount.raw, JSBI.BigInt(multiplier)))
}

export function DoubleTokenAmount(tokenAmount: TokenAmount): TokenAmount {
  return MultiplyTokenAmount(tokenAmount, 2)
}

export function GetAmountInBUSD(price?: Price, tokenAmount?: TokenAmount): CurrencyAmount | undefined {
  if (!price || !tokenAmount) {
    return undefined
  }
  if (tokenAmount.token === tokens.busd) {
    return tokenAmount
  }
  return price?.quote(tokenAmount)
}
