import { Token } from '@intercroneswap/v2-sdk'
import tokens from 'config/constants/tokens'

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{}

export default SwapWarningTokens
