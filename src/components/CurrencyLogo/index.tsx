import { Currency, ETHER, Token } from '@intercroneswap/v2-sdk';
import { useMemo } from 'react';
import styled from 'styled-components';

import EthereumLogo from '../../assets/images/ethereum-logo.png';
import useHttpLocations from '../../hooks/useHttpLocations';
import { WrappedTokenInfo } from '../../state/lists/hooks';
import Logo from '../Logo';
import { ethAddress } from '@intercroneswap/java-tron-provider';
import { useAllLists } from '../../state/lists/hooks';
import { TokenList } from '@intercroneswap/token-lists';

const coinTopFormats = ['png', 'jpeg', 'jpg'];

const getTokenLogoURL = (address: string, allTokens: TokenList[]): string[] => {
  const default_list_logo = allTokens
    .flatMap((tokens) => tokens.tokens)
    .find((token) => token.address.toLowerCase() === address.toLowerCase())?.logoURI;
  const coin_top_main_url = `https://coin.top/production/upload/logo/${ethAddress.toTron(address)}.`;
  const allCoinTopFormats = coinTopFormats.map((format) => `${coin_top_main_url}${format}`);
  return default_list_logo ? [default_list_logo] : allCoinTopFormats;
};

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`;

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`;

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined);
  const allTokens = useAllLists();

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...getTokenLogoURL(currency.address, allTokens)];
      }

      return [...getTokenLogoURL(currency.address, allTokens)];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />;
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />;
}
