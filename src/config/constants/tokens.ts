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
  return symbol === 'FTM' ? WETH[parseInt(chainId, 10)] : DefaultTokensMap[symbol]
}

export const mainnetTokens = defineTokens({
  wftm: new Token(
    MAINNET,
    '0x23181F21DEa5936e24163FFABa4Ea3B316B57f3C',
    18,
    'WFTM',
    'Wrapped FTM',
    'https://fantom.foundation',
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
  usdt_b: new Token(
    MAINNET,
    '0x9B5F27f6ea9bBD753ce3793a07CbA3C74644330d',
    18,
    'USDT_b',
    'Tether',
    'www.intercroneswap.com',
  ),
  bnb: new Token(MAINNET, '0x185a4091027E2dB459a2433F85f894dC3013aeB5', 18, 'BNB', 'BNB', 'www.intercroneswap.com'),
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
  eth: new Token(MAINNET, '0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006', 8, 'ETH', 'Ethereum', 'www.intercroneswap.com'),
} as const)

export const testnetTokens = defineTokens({
  wftm: new Token(
    TESTNET,
    '0x1957d5e8496628D755A4b2151bcA03ecC379bdD6',
    18,
    'WFTM',
    'Wrapped Fantom',
    'https://www.fantom.foundation/',
  ),
  usdt: new Token(TESTNET, '0xAd280B60cA089625E9d38612710301852f879050', 18, 'USDT', 'Tether', ''),
  busd: new Token(
    TESTNET,
    '0xBe502C0f8C267e3C024B7B5fc8484BC3ec489DAE',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
  icr: new Token(TESTNET, '0xb518912759D86409e747fad19Dbad9FE681761C3', 18, 'ICR', 'Intercroneswap Token', ''),
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
  ['ICRT']: unserializedTokens.icr_t,
  ['ICRB']: unserializedTokens.icr_b,
  ['BTCB']: unserializedTokens.btc_b,
  ['USDTT']: unserializedTokens.usdt_t,
  ['USDTB']: unserializedTokens.usdt_b,
  ['ETH']: unserializedTokens.eth,
  ['CAKE']: unserializedTokens.cake,
  ['BNB']: unserializedTokens.bnb,
  ['MATIC']: unserializedTokens.matic,
  ['TRX']: unserializedTokens.tron,
  ['XRP']: unserializedTokens.xrp,
  ['AVAXB']: unserializedTokens.avax_b,
}

const tokenArray: Token[] = [
  unserializedTokens.icr_t,
  unserializedTokens.icr_b,
  unserializedTokens.btc_b,
  unserializedTokens.usdt_t,
  unserializedTokens.usdt_b,
  unserializedTokens.eth,
  unserializedTokens.cake,
  unserializedTokens.bnb,
  unserializedTokens.matic,
  unserializedTokens.tron,
  unserializedTokens.xrp,
  unserializedTokens.avax_b,
]

export function getTokenByAddress(address: string): Token {
  return tokenArray.find((token) => token.address.toLowerCase() === address.toLowerCase()) ?? unserializedTokens.icr_t
}

export default unserializedTokens
