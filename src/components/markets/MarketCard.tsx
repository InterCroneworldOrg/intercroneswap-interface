import { TYPE } from '../../theme';
import { Percent, Price, Token, TokenAmount } from '@intercroneswap/v2-sdk';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { LightCard } from '../Card';
import { AutoRow, RowFixed } from '../Row';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import CurrencyLogo from '../CurrencyLogo';

export interface MarketCardProps {
  tokens: [Token, Token];
  lastPrice: Price;
  liquidity: TokenAmount;
  dailyVolume: TokenAmount;
  apy?: Percent;
  stakingAddress?: string;
}

export default function MarketCard({
  tokens,
  lastPrice,
  liquidity,
  dailyVolume,
  apy,
  stakingAddress,
}: MarketCardProps) {
  const theme = useContext(ThemeContext);
  // const isMobile = window.innerWidth <= MEDIA_WIDTHS.upToMedium;

  const [token0, token1] = tokens;

  const currency0 = unwrappedToken(token0);
  const currency1 = unwrappedToken(token1);

  return (
    <LightCard
      style={{
        marginTop: '2px',
        margin: '0rem',
        padding: '1rem',
        background: theme.bg3,
      }}
    >
      <AutoRow>
        <RowFixed width="25%">
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
        </RowFixed>
        <TYPE.yellow width="15%">$ {lastPrice.toFixed(2)}</TYPE.yellow>
        <TYPE.yellow width="15%">$ {liquidity.toFixed(2)}</TYPE.yellow>
        <TYPE.yellow width="15%">$ {dailyVolume.toFixed(2)}</TYPE.yellow>
        <TYPE.yellow width="15%">{apy ? `${apy.toFixed(2)} %` : '-'}</TYPE.yellow>
        <TYPE.yellow width="15%">{stakingAddress ? 'Active' : 'Inactive'}</TYPE.yellow>
      </AutoRow>
    </LightCard>
  );
}
