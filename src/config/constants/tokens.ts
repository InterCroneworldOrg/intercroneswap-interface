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

  return symbol === 'VC' ? WETH[parseInt(chainId, 10)] : DefaultTokensMap.get(symbol)
}

export const mainnetTokens = defineTokens({
  wvc: new Token(MAINNET, '0xd43a817DAb05960B2473CE1E1718612bE44923fD', 18, 'WVC', 'Wrapped VC', ''),
  vinu: new Token(
    MAINNET,
    '0x00c1E515EA9579856304198EFb15f525A0bb50f6',
    18,
    'VINU',
    'Vita Inu',
    'www.intercroneswap.com',
  ),
  btc: new Token(MAINNET, '0x69120197b77b51d32fFA5eAfe16b3d78115640c6', 8, 'BTC', 'Bitcoin', 'www.intercroneswap.com'),
  usdt: new Token(MAINNET, '0xC0264277fcCa5FCfabd41a8bC01c1FcAF8383E41', 6, 'USDT', 'Tether', 'www.intercroneswap.com'),
  eth: new Token(MAINNET, '0xDd4b9b3Ce03faAbA4a3839c8B5023b7792be6e2C', 18, 'ETH', 'Ethereum', 'https://ethereum.org/'),
} as const)

export const testnetTokens = defineTokens({
  wvc: new Token(TESTNET, '0x0104Cb33aB69540FF6b60c9B859D78718E99155a', 18, 'WVC', 'Wrapped VC', ''),
  cht: new Token(TESTNET, '0xe7BedACd65Eac6b8c0c8a3aD404336DAE7A044c2', 18, 'CHT', 'Cheetah token', ''),
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

export const DefaultTokensMap: Map<string, Token> = new Map(
  Object.values(unserializedTokens).map((token) => {
    const symbol = token.symbol?.replaceAll('_', '').toUpperCase()
    return [symbol, token]
  }),
)
const tokenArray: Token[] = Object.values(mainnetTokens)

export function getTokenByAddress(address: string): Token {
  return tokenArray.find((token) => token.address.toLowerCase() === address.toLowerCase()) ?? unserializedTokens.wvc
}

export default unserializedTokens
