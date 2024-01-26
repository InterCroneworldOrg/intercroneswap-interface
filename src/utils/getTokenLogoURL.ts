// ./src/utils/getTokenLogoURL.ts
import defaultTokenListJson from '../config/constants/tokenLists/iswap-default.tokenlist.json'

interface Token {
  symbol: string
  name: string
  address: string
  chainId: number
  decimals: number
  logoURI: string
}

const defaultTokenList: { tokens: Token[] } = defaultTokenListJson

const getTokenLogoURL = (address: string) => {
  const logoFromDefault = defaultTokenLogoURL(address)

  return logoFromDefault || `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`
}

const defaultTokenLogoURL = (address: string) => {
  return defaultTokenList.tokens.find((token) => token.address === address)?.logoURI
}

export default getTokenLogoURL
