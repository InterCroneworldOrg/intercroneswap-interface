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

const fetchBackendUrl = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return BACKEND_URL;
};

const setBackendUrl = async () => {
  url = await fetchBackendUrl();
};

let url = '';

(async () => {
  await setBackendUrl();
  console.log('url check :- ', url);
})();
export const fetchTokens = async () => {
  const response = await fetch(`${url}/tokens/all?chainId=11111`, {
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
  let token: Token | undefined = symbol === 'TRX' ? WETH[ChainId.MAINNET] : DefaultTokensMap[symbol];
  if (!token && tokensFromApi.length > 0) {
    token = tokensFromApi.find((token) => token.symbol === symbol);
  }
  return token;
}

export const PLZ = new Token(ChainId.MAINNET, '0xF51616FA89A8D63DA1BE20D8EA2C1D0A383FACEF', 8, 'PLZ', 'Plaentz');
export const ICR = new Token(ChainId.MAINNET, '0x6C50DDDAECA053249582D7F823BCC8299B3FB293', 8, 'ICR', 'Intercrone');
export const USDT = new Token(ChainId.MAINNET, '0xA614F803B6FD780986A42C78EC9C7F77E6DED13C', 6, 'USDT', 'Tether');
export const BTT = new Token(ChainId.MAINNET, '0x032017411F4663B317FE77C257D28D5CD1B26E3D', 18, 'BTT', 'BitTorrent');
export const MEOX = new Token(ChainId.MAINNET, '0xA481DC6C5E0A964523E5059F930EE5BA6B4E479C', 18, 'MEOX', 'Metronix');
export const BTC = new Token(ChainId.MAINNET, '0x84716914C0FDF7110A44030D04D0C4923504D9CC', 8, 'BTC', 'Bitcoin');
export const ETHOLD = new Token(
  ChainId.MAINNET,
  '0x53908308F4AA220FB10D778B5D1B34489CD6EDFC',
  18,
  'ETHOLD',
  'Ethereum',
);
export const ETH = new Token(ChainId.MAINNET, '0xA7A572F6D8B4CA291B9353CF26580ABED74F3E31', 18, 'ETH', 'Ethereum');
export const USDJ = new Token(
  ChainId.MAINNET,
  '0x834295921A488D9D42B4B3021ED1A3C39FB0F03E',
  18,
  'USDJ ',
  'JUST Stablecoin',
);
export const TUSD = new Token(ChainId.MAINNET, '0xCEBDE71077B830B958C8DA17BCDDEEB85D0BCF25', 18, 'TUSD ', 'TrueUSD');
export const USDC = new Token(ChainId.MAINNET, '0x3487B63D30B5B2C87FB7FFA8BCFADE38EAAC1ABE', 6, 'USDC ', 'USD Coin');
export const USDD = new Token(ChainId.MAINNET, '0x94F24E992CA04B49C6F2A2753076EF8938ED4DAA', 18, 'USDD ', 'USDD Coin');
export const WIN = new Token(ChainId.MAINNET, '0x74472E7D35395A6B5ADD427EECB7F4B62AD2B071', 6, 'WIN ', 'WINK');
export const SST = new Token(
  ChainId.MAINNET,
  '0x0EFAC3802727C5F873B887E8119FE895B5156577',
  8,
  'SST ',
  'SocialSwapToken',
);
export const JM = new Token(
  ChainId.MAINNET,
  '0xD3D54671FCA80648A5886F990FD40117F94D247F',
  8,
  'JM ',
  'J U S T M O N E Y',
);
export const JST = new Token(ChainId.MAINNET, '0x18FD0626DAF3AF02389AEF3ED87DB9C33F638FFA', 18, 'JST ', 'JUST GOV');
export const NFT = new Token(ChainId.MAINNET, '0x3DFE637B2B9AE4190A458B5F3EFC1969AFE27819', 6, 'NFT ', 'APENFT');
export const SUN = new Token(ChainId.MAINNET, '0xB4A428AB7092C2F1395F376CE297033B3BB446C1', 18, 'SUN ', 'SUN');
export const WBTT = new Token(ChainId.MAINNET, '0x6A6337AE47A09AEA0BBD4FAEB23CA94349C7B774', 6, 'WBTT ', 'Wrapped BTT');
export const LTC = new Token(ChainId.MAINNET, '0xA54BD6077B2EB012D92D9563FF15D2199D8123DE', 8, 'LTC ', 'Litecoin');
export const HT = new Token(ChainId.MAINNET, '0x2C036253E0C053188C621B81B7CD40A99B828400', 18, 'HT ', 'HuobiToken');
export const KLV = new Token(ChainId.MAINNET, '0xD8B8089856CED3038601CBEB1E3F765CABC12A41', 6, 'KLV ', 'Klever');
export const Doge = new Token(ChainId.MAINNET, '0x53A58D995EF4937017A8AB47722186A12A27905E', 8, 'Doge ', 'Dogecoin');
export const TURU = new Token(ChainId.MAINNET, '0x6471F94B57853C253273275FD695606AFF44CD8F', 8, 'turu ', 'turu');
export const BBT = new Token(ChainId.MAINNET, '0x4CD9F886FCFD6BBDB234954B817F47BD49B6667C', 8, 'BBT', 'BabyTuru');
export const BCC = new Token(
  ChainId.MAINNET,
  '0xECD5F1B3AD33FDF1022DA2EA77802951DC07633C',
  18,
  'BCC',
  'Baby Coconut Chicken',
);
export const COME = new Token(
  ChainId.MAINNET,
  '0xEA98A5047A37DD4B10F331ADB17B55AAFA682F19',
  18,
  'COME',
  'CommunityEarth',
);

export const DefaultTokensMap: { [tokenSymbol: string]: Token } = {
  ['ICR']: ICR,
  ['USDT']: USDT,
  ['USDD']: USDD,
  ['ETH']: ETH,
  ['ETHOLD']: ETHOLD,
  ['BTT']: BTT,
  ['MEOX']: MEOX,
  ['BTC']: BTC,
  ['USDJ']: USDJ,
  ['TUSD']: TUSD,
  ['USDC']: USDC,
  ['WIN']: WIN,
  ['JM']: JM,
  ['JST']: JST,
  ['NFT']: NFT,
  ['SUN']: SUN,
  ['WBTT']: WBTT,
  ['LTC']: LTC,
  ['HT']: HT,
  ['KLV']: KLV,
  ['DOGE']: Doge,
  ['TURU']: TURU,
  ['turu']: TURU,
  ['BBT']: BBT,
  ['BCC']: BCC,
  ['COME']: COME,
  ['SST']: SST,
  ['PLZ']: PLZ,
};

const tokens: Token[] = [
  ICR,
  USDT,
  USDD,
  ETHOLD,
  ETH,
  BTT,
  MEOX,
  USDJ,
  TUSD,
  USDC,
  WIN,
  JM,
  JST,
  NFT,
  SUN,
  WBTT,
  LTC,
  KLV,
  Doge,
  TURU,
  SST,
  BBT,
  COME,
  PLZ,
];

export function getTokenByAddress(address: string): Token {
  return tokens.find((token) => token.address.toLowerCase() === address.toLowerCase()) ?? ICR;
}
