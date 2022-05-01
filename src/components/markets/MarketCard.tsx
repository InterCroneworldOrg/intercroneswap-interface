import { TYPE } from '../../theme';
import { Pair, Percent, Price, Token, TokenAmount } from '@intercroneswap/v2-sdk';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { LightCard } from '../Card';
import { AutoRow, PercentageDiv } from '../Row';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import CurrencyLogo from '../CurrencyLogo';
import useUSDTPrice from '../../hooks/useUSDTPrice';
import { DoubleTokenAmount, GetAmountInUSDT } from '../../utils/tokenAmountCalculations';

export interface MarketCardProps {
  pair: Pair;
  tokens?: [Token, Token];
  lastPrice?: Price;
  liquidity?: TokenAmount;
  dailyVolume?: TokenAmount;
  apy?: Percent;
  stakingAddress?: string;
}

export default function MarketCard({
  pair,
  stakingAddress,
}: // lastPrice,
// liquidity,
// dailyVolume,
// apy,
MarketCardProps) {
  const theme = useContext(ThemeContext);
  // const isMobile = window.innerWidth <= MEDIA_WIDTHS.upToMedium;

  const token0 = pair.token0;
  const token1 = pair.token1;

  const USDPrice = useUSDTPrice(token0);
  const USDPriceBackup = useUSDTPrice(token1);
  const lastPrice = USDPrice ?? USDPriceBackup;

  const liquidity = USDPrice
    ? GetAmountInUSDT(USDPrice, DoubleTokenAmount(pair.reserve0))
    : GetAmountInUSDT(USDPriceBackup, DoubleTokenAmount(pair.reserve1));

  const dailyVolume: TokenAmount | undefined = undefined;

  const apy: Percent | undefined = undefined;

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
      <AutoRow justify="start" gap=".2rem">
        <PercentageDiv style={{ width: '25%' }}>
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
        </PercentageDiv>
        <AutoRow style={{ width: '15%' }}>
          <TYPE.yellow>$ {lastPrice?.toFixed(2)}</TYPE.yellow>
        </AutoRow>
        <AutoRow style={{ width: '15%' }}>
          <TYPE.yellow>$ {liquidity?.toFixed(2)}</TYPE.yellow>
        </AutoRow>
        <AutoRow style={{ width: '15%' }}>
          <TYPE.yellow>$ {dailyVolume}</TYPE.yellow>
        </AutoRow>
        <AutoRow style={{ width: '12%' }}>
          <TYPE.yellow>{apy ? `${apy} %` : '-'}</TYPE.yellow>
        </AutoRow>
        <AutoRow style={{ width: '15%' }}>
          <TYPE.yellow>{stakingAddress ? 'Active' : 'Inactive'}</TYPE.yellow>
        </AutoRow>
      </AutoRow>
    </LightCard>
  );
}
