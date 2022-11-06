import { ChainId, Token, WETH } from '@intercroneswap/v2-sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { CHAIN_ID } from './networks'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

const defineTokens = <T extends TokenList>(t: T) => t

export function getTokensFromDefaults(symbols: string): [Token, Token] | undefined {
  const symbolsSplit = symbols.split('-')
  if (symbolsSplit.length !== 2) {
    return undefined
  }
  const token0 = getTokenFromDefaults(symbolsSplit[0].toUpperCase())
  const token1 = getTokenFromDefaults(symbolsSplit[1].toUpperCase())
  return token0 && token1 ? [token0, token1] : undefined
}

export function getTokenFromDefaults(symbol: string): Token | undefined {
  const chainId = CHAIN_ID
  return symbol === 'BTT' ? WETH[parseInt(chainId, 10)] : DefaultTokensMap[symbol]
}

export const mainnetTokens = defineTokens({
  wbtt: new Token(
    MAINNET,
    '0x23181F21DEa5936e24163FFABa4Ea3B316B57f3C',
    18,
    'WBTT',
    'Wrapped BTT',
    'https://www.bittorrent.com',
  ),
  icr_t: new Token(
    MAINNET,
    '0x096C64d79A85C8FD2E963c4aBD9373301D2cf801',
    8,
    'ICR_t',
    'Intercrone',
    'www.intercroneswap.com',
  ),
  icr_b: new Token(
    MAINNET,
    '0x252CD063341a1A47933086b93f85417C09C54aec',
    8,
    'ICR_b',
    'Intercrone',
    'www.intercroneswap.com',
  ),
  btc_b: new Token(
    MAINNET,
    '0x1A7019909B10cdD2D8B0034293AD729f1C1F604e',
    18,
    'BTC_b',
    'Bitcoin',
    'www.intercroneswap.com',
  ),
  cake: new Token(
    MAINNET,
    '0x2Eb6d639621Da30f61458D160338cd90547aDe9f',
    18,
    'CAKE_b',
    'Pancakeswap',
    'www.intercroneswap.com',
  ),
  usdt_t: new Token(
    MAINNET,
    '0xdB28719F7f938507dBfe4f0eAe55668903D34a15',
    6,
    'USDT_t',
    'Tether',
    'www.intercroneswap.com',
  ),
  usdd_t: new Token(
    MAINNET,
    '0x17F235FD5974318E4E2a5e37919a209f7c37A6d1',
    18,
    'USDD_t',
    'Tether',
    'www.intercroneswap.com',
  ),
  usdc_e: new Token(
    MAINNET,
    '0xae17940943ba9440540940db0f1877f101d39e8b',
    6,
    'USDC_e',
    'USD Coin',
    'https://www.centre.io/',
  ),
  usdt_b: new Token(
    MAINNET,
    '0x9B5F27f6ea9bBD753ce3793a07CbA3C74644330d',
    18,
    'USDT_b',
    'Tether',
    'www.intercroneswap.com',
  ),
  eth: new Token(MAINNET, '0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006', 18, 'ETH', 'Ethereum', 'https://ethereum.org/'),
  bnb: new Token(MAINNET, '0x185a4091027E2dB459a2433F85f894dC3013aeB5', 18, 'BNB', 'BNB', 'https://www.binance.com/'),
  matic: new Token(
    MAINNET,
    '0x39A2ec2E3570aA234e49ffEC96F0684a352e3E0E',
    18,
    'MATIC',
    'MATIC_e',
    'www.intercroneswap.com',
  ),
  tron: new Token(MAINNET, '0xEdf53026aeA60f8F75FcA25f8830b7e2d6200662', 6, 'Tron', 'TRX', 'www.intercroneswap.com'),
  xrp: new Token(MAINNET, '0xF5DbB4e26C1946DFd5aD8cf2e1Cbda3510721bB8', 18, 'XRP', 'XRP_b', 'www.intercroneswap.com'),
  avax_b: new Token(
    MAINNET,
    '0x4CC2FC7373B491db83bE3feB5db622e0773420cf',
    18,
    'Avalance',
    'AVAX_b',
    'www.intercroneswap.com',
  ),
  jm: new Token(MAINNET, '0x388D819724dD6d71760A38F00dc01D310d879771', 8, 'JM', 'JustMoney', 'https://justmoney.io'),
} as const)

export const testnetTokens = defineTokens({
  wbnb: new Token(
    TESTNET,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.com/',
  ),
  cake: new Token(
    TESTNET,
    '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    18,
    'CAKE',
    'PancakeSwap Token',
    'https://pancakeswap.finance/',
  ),
  busd: new Token(
    TESTNET,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
  syrup: new Token(
    TESTNET,
    '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
    18,
    'SYRUP',
    'SyrupBar Token',
    'https://pancakeswap.finance/',
  ),
  bake: new Token(
    TESTNET,
    '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    18,
    'BAKE',
    'Bakeryswap Token',
    'https://www.bakeryswap.org/',
  ),
  icr: new Token(
    TESTNET,
    '0xb518912759D86409e747fad19Dbad9FE681761C3',
    18,
    'ICR',
    'Intercroneswap Token',
    'www.intercroneswap.com',
  ),
} as const)

const tokens = () => {
  const chainId = CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    }, {} as typeof testnetTokens & typeof mainnetTokens)
  }

  return mainnetTokens
}

const unserializedTokens = tokens()

type SerializedTokenList = Record<keyof typeof unserializedTokens, SerializedToken>

export const serializeTokens = () => {
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {} as SerializedTokenList)

  return serializedTokens
}

export const DefaultTokensMap: { [tokenSymbol: string]: Token } = {
  ICRT: unserializedTokens.icr_t,
  ICRB: unserializedTokens.icr_b,
  BTCB: unserializedTokens.btc_b,
  ETH: unserializedTokens.eth,
  USDTT: unserializedTokens.usdt_t,
  USDTB: unserializedTokens.usdt_b,
  USDDT: unserializedTokens.usdd_t,
  USDCE: unserializedTokens.usdc_e,
  CAKE: unserializedTokens.cake,
  BNB: unserializedTokens.bnb,
  MATIC: unserializedTokens.matic,
  TRX: unserializedTokens.tron,
  XRP: unserializedTokens.xrp,
  AVAXB: unserializedTokens.avax_b,
  JM: unserializedTokens.jm,
}

const tokenArray: Token[] = [
  unserializedTokens.icr_t,
  unserializedTokens.icr_b,
  unserializedTokens.btc_b,
  unserializedTokens.eth,
  unserializedTokens.usdt_t,
  unserializedTokens.usdt_b,
  unserializedTokens.usdd_t,
  unserializedTokens.usdc_e,
  unserializedTokens.cake,
  unserializedTokens.bnb,
  unserializedTokens.matic,
  unserializedTokens.tron,
  unserializedTokens.xrp,
  unserializedTokens.avax_b,
  unserializedTokens.jm,
]

export function getTokenByAddress(address: string): Token {
  return tokenArray.find((token) => token.address.toLowerCase() === address.toLowerCase()) ?? unserializedTokens.icr_t
}

export default unserializedTokens
