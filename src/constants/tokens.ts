import { ChainId, Token, WETH } from '@intercroneswap/v2-sdk';

export function getTokensFromDefaults(symbols: string): [Token, Token] | undefined {
  const symbolsSplit = symbols.split('-');
  if (symbolsSplit.length !== 2) {
    return undefined;
  }
  const token0 = getTokenFromDefaults(symbolsSplit[0].toUpperCase());
  const token1 = getTokenFromDefaults(symbolsSplit[1].toUpperCase());
  return token0 && token1 ? [token0, token1] : undefined;
}

export function getTokenFromDefaults(symbol: string): Token | undefined {
  return symbol === 'TRX' ? WETH[ChainId.MAINNET] : DefaultTokensMap[symbol];
}

export const ICR = new Token(ChainId.MAINNET, '0x6c50dddaeca053249582d7f823bcc8299b3fb293', 8, 'ICR', 'Intercrone');
export const USDT = new Token(ChainId.MAINNET, '0xA614F803B6FD780986A42C78EC9C7F77E6DED13C', 6, 'USDT', 'Tether');
export const BTT = new Token(ChainId.MAINNET, '0x032017411F4663B317FE77C257D28D5CD1B26E3D', 18, 'BTT', 'BitTorrent');
export const MEOX = new Token(ChainId.MAINNET, '0xA481DC6C5E0A964523E5059F930EE5BA6B4E479C', 18, 'MEOX ', 'Metronix');
export const BTC = new Token(ChainId.MAINNET, '0x84716914C0FDF7110A44030D04D0C4923504D9CC', 8, 'BTC ', 'Bitcoin');
export const ETH = new Token(ChainId.MAINNET, '0x53908308F4AA220FB10D778B5D1B34489CD6EDFC', 18, 'ETH ', 'Ethereum');
export const USDJ = new Token(
  ChainId.MAINNET,
  '0x834295921A488D9D42B4B3021ED1A3C39FB0F03E',
  18,
  'USDJ ',
  'JUST Stablecoin',
);
export const TUSD = new Token(ChainId.MAINNET, '0xCEBDE71077B830B958C8DA17BCDDEEB85D0BCF25', 18, 'TUSD ', 'TrueUSD');
export const USDC = new Token(ChainId.MAINNET, '0x3487B63D30B5B2C87FB7FFA8BCFADE38EAAC1ABE', 6, 'USDC ', 'USD Coin');
export const WIN = new Token(ChainId.MAINNET, '0x74472E7D35395A6B5ADD427EECB7F4B62AD2B071', 6, 'WIN ', 'WINK');
export const LIVE = new Token(ChainId.MAINNET, '0xD829659F0F7661F29F12F07A5BE33C13B6C9DD59', 6, 'LIVE ', 'TRONbetLive');
export const DICE = new Token(ChainId.MAINNET, '0x6CE0632A762689A207B9CCE915E93AA9596816CA', 6, 'DICE ', 'TRONbetDice');
export const EightEightEight = new Token(
  ChainId.MAINNET,
  '0x7818637395075A1AAA82927801DAB4117B99FC3F',
  6,
  '888 ',
  '888Tron',
);
export const SafeMoney = new Token(
  ChainId.MAINNET,
  '0x8605CAE8C40545D2184D59550918185F44D9EA0D',
  8,
  'SafeMoney ',
  'SafeMoney',
);
export const JM = new Token(
  ChainId.MAINNET,
  '0xBC3BDCCEEB47790E2099C76A116A1920375329E7',
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
export const TURU = new Token(ChainId.MAINNET, '0x6471f94b57853c253273275fd695606aff44cd8f', 8, 'turu ', 'turu');
export const BBT = new Token(ChainId.MAINNET, '0x4cd9f886fcfd6bbdb234954b817f47bd49b6667c', 8, 'BBT', 'BabyTuru');

export const DefaultTokensMap: { [tokenSymbol: string]: Token } = {
  ['ICR']: ICR,
  ['USDT']: USDT,
  ['ETH']: ETH,
  ['BTT']: BTT,
  ['MEOX']: MEOX,
  ['BTC']: BTC,
  ['USDJ']: USDJ,
  ['TUSD']: TUSD,
  ['USDC']: USDC,
  ['WIN']: WIN,
  ['LIVE']: LIVE,
  ['DICE']: DICE,
  ['888']: EightEightEight,
  ['SAFEMONEY']: SafeMoney,
  ['JM']: JM,
  ['JST']: JST,
  ['NFT']: NFT,
  ['SUN']: SUN,
  ['WBTT']: WBTT,
  ['LTC']: HT,
  ['KLV']: KLV,
  ['DOGE']: Doge,
  ['TURU']: TURU,
  ['BBT']: BBT,
};

const tokens: Token[] = [
  ICR,
  USDT,
  ETH,
  BTT,
  MEOX,
  USDJ,
  TUSD,
  USDC,
  WIN,
  LIVE,
  DICE,
  EightEightEight,
  SafeMoney,
  JM,
  JST,
  NFT,
  SUN,
  WBTT,
  LTC,
  KLV,
  Doge,
  TURU,
  BBT,
];

export function getTokenByAddress(address: string): Token {
  return tokens.find((token) => token.address.toLowerCase() === address.toLowerCase()) ?? ICR;
}
