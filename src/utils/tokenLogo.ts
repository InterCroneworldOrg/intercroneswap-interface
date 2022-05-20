import { TokenList } from '@intercroneswap/token-lists';
import { ethAddress } from '@intercroneswap/java-tron-provider';

const coinTopFormats = ['png', 'jpeg', 'jpg'];

export const getTokenLogoURL = (address: string, allTokens: TokenList[]): string[] => {
  const default_list_logo = allTokens
    .flatMap((tokens) => tokens.tokens)
    .find((token) => token.address.toLowerCase() === address.toLowerCase())?.logoURI;
  const coin_top_main_url = `https://coin.top/production/upload/logo/${ethAddress.toTron(address)}.`;
  const allCoinTopFormats = coinTopFormats.map((format) => `${coin_top_main_url}${format}`);
  return default_list_logo ? [default_list_logo] : allCoinTopFormats;
};
