import { ExternalLink, TYPE } from '../../theme';
import { ChainId, Percent, Token } from '@intercroneswap/v2-sdk';
import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { LightCard } from '../Card';
import { AutoRow } from '../Row';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import CurrencyLogo from '../CurrencyLogo';
import { currencyFormatter, getEtherscanLink } from '../../utils';
import { useWeb3React } from '@web3-react/core';

export interface MarketCardProps {
  pairAddress: string;
  tokens: [Token, Token];
  liquidity: number;
  dailyVolume: number;
  apy?: Percent;
  stakingAddress?: string;
}

const MobileHidden = styled(AutoRow)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`;

export default function MarketCard({
  tokens,
  pairAddress,
  stakingAddress,
  liquidity,
  dailyVolume,
}: // apy,
MarketCardProps) {
  const theme = useContext(ThemeContext);
  // const isMobile = window.innerWidth <= MEDIA_WIDTHS.upToMedium;
  const { chainId } = useWeb3React();

  const [token0, token1] = tokens;

  // const liquidity = USDPrice
  //   ? GetAmountInUSDT(USDPrice, DoubleTokenAmount(pair.reserve0))
  //   : GetAmountInUSDT(USDPriceBackup, DoubleTokenAmount(pair.reserve1));

  // const dailyVolume: TokenAmount | undefined = undefined;

  const apy: Percent | undefined = undefined;

  const currency0 = unwrappedToken(token0);
  const currency1 = unwrappedToken(token1);

  return (
    <LightCard
      style={{
        marginTop: '2px',
        margin: '0rem',
        padding: '1rem 3rem',
        background: theme.bg3,
      }}
    >
      <AutoRow justify="start" gap=".2rem">
        <ExternalLink
          style={{ width: '30%', display: 'flex' }}
          href={getEtherscanLink(chainId ?? ChainId.MAINNET, pairAddress, 'contract')}
        >
          <CurrencyLogo currency={currency0} size="1.2rem" />
          &nbsp;
          <TYPE.white fontWeight={500} fontSize="1rem">
            {currency0?.symbol}&nbsp;/
          </TYPE.white>
          &nbsp;
          <CurrencyLogo currency={currency1} size="1.2rem" />
          &nbsp;
          <TYPE.white fontWeight={500} fontSize="1rem">
            {currency1?.symbol}
          </TYPE.white>
        </ExternalLink>
        <AutoRow style={{ width: '15%' }}>
          <TYPE.yellow>{currencyFormatter.format(liquidity)}</TYPE.yellow>
        </AutoRow>
        <MobileHidden style={{ width: '15%' }}>
          <TYPE.yellow>{dailyVolume ? `$ ${dailyVolume}` : '-'}</TYPE.yellow>
        </MobileHidden>
        <MobileHidden style={{ width: '15%' }}>
          <TYPE.yellow>{apy ? `${apy} %` : '-'}</TYPE.yellow>
        </MobileHidden>
        <MobileHidden style={{ width: '15%' }}>
          <TYPE.yellow>{stakingAddress ? 'Active' : 'Inactive'}</TYPE.yellow>
        </MobileHidden>
      </AutoRow>
    </LightCard>
  );
}
