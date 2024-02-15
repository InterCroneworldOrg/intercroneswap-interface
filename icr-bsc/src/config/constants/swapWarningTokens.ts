import { Token } from '@intercroneswap/v2-sdk'
import tokens from 'config/constants/tokens'

const { bondly, safemoon, itam, ccar, bttold } = tokens

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{
  safemoon,
  bondly,
  itam,
  ccar,
  bttold,
}

export default SwapWarningTokens
