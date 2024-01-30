import { ChainId, Token, WETH } from '@intercroneswap/v2-sdk';
import { BACKEND_URL } from '.';

export function getTokensFromDefaults(symbols: string): [Token, Token] | undefined {
  const symbolsSplit = symbols.split('-');
  if (symbolsSplit.length !== 2) {
    return undefined;
  }
  const token0 = getTokenFromDefaults(symbolsSplit[0].toUpperCase());
  const token1 = getTokenFromDefaults(symbolsSplit[1].toUpperCase());
  return token0 && token1 ? [token0, token1] : undefined;
}

export let tokensFromApi: Token[] = [];

export const fetchTokens = async () => {
  const response = await fetch(`${BACKEND_URL}/tokens/all?chainId=207`, {
    method: 'GET',
    mode: 'cors',
  });
  if (response.status == 200) {
    const json = await response.json();
    if (json.data?.length > tokensFromApi.length) {
      tokensFromApi = json.data?.map((data: any) => {
        const token = new Token(data.chain_id, data.address, data.decimals, data.symbol, data.name);
        return token;
      });
    }
  }
};

fetchTokens();

export function getTokenFromDefaults(symbol: string): Token | undefined {
  let token: Token | undefined = symbol === 'VC' ? WETH[ChainId.MAINNET] : DefaultTokensMap[symbol];
  if (!token && tokensFromApi.length > 0) {
    token = tokensFromApi.find((token) => token.symbol === symbol);
  }
  return token;
}

export const VINU = new Token(ChainId.MAINNET, '0x00c1E515EA9579856304198EFb15f525A0bb50f6', 18, 'VINU', 'Vita Inu');
export const USDT = new Token(ChainId.MAINNET, '0xC0264277fcCa5FCfabd41a8bC01c1FcAF8383E41', 6, 'USDT', 'Tether');
export const BTC = new Token(ChainId.MAINNET, '0x69120197b77b51d32fFA5eAfe16b3d78115640c6', 8, 'BTC', 'Bitcoin');
export const ETH = new Token(ChainId.MAINNET, '0xDd4b9b3Ce03faAbA4a3839c8B5023b7792be6e2C', 18, 'ETH', 'Ethereum');

export const DefaultTokensMap: { [tokenSymbol: string]: Token } = {
  ['VINU']: VINU,
  ['USDT']: USDT,
  ['BTC']: BTC,
  ['ETH']: ETH,
};

const tokens: Token[] = [VINU, USDT, BTC, ETH];

export function getTokenByAddress(address: string): Token {
  return tokens.find((token) => token.address.toLowerCase() === address.toLowerCase()) ?? VINU;
}
