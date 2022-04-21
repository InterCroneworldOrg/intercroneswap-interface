import { tokens } from "../config/constants/tokenLists/iswap-default.tokenlist.json";

const getTokenLogoURL = (address: string) => {
  const logoFromDefault = defaultTokenLogoURL(address);
  
  return logoFromDefault ? logoFromDefault : `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`
}

const defaultTokenLogoURL = (address: string) => {
  return tokens.find(token => token.address === address)?.logoURI
}

export default getTokenLogoURL
