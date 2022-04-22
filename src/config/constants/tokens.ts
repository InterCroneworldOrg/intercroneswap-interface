import { ChainId, Token } from '@intercroneswap/v2-sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { CHAIN_ID } from './networks'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

const defineTokens = <T extends TokenList>(t: T) => t

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
    'ICR_t',
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
    18,
    'USDT_t',
    'Tether',
    'www.intercroneswap.com',
  ),
  eth: new Token(MAINNET, '0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006', 8, 'ETH', 'Ethereum', 'www.intercroneswap.com'),
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
  ICR: new Token(TESTNET, '0xb518912759D86409e747fad19Dbad9FE681761C3', 18, 'ICR', 'Intercroneswap Token', ''),
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

export default unserializedTokens
