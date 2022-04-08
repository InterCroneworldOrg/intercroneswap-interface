import { ETHER, JSBI, Percent, TokenAmount, ZERO } from '@intercroneswap/v2-sdk';
import { useContext, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { ThemeContext } from 'styled-components';
import { YEARLY_RATE } from '../../constants';
import { ICR, USDT } from '../../constants/tokens';
import { PairState, usePair } from '../../data/Reserves';
import { useTotalSupply } from '../../data/TotalSupply';

import { useActiveWeb3React } from '../../hooks';
import useUSDTPrice from '../../hooks/useUSDTPrice';
import { Dots } from '../../pages/Stake/styleds';
import { StakingInfo } from '../../state/stake/hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { ExternalLink, TYPE } from '../../theme';
import { isOneTokenWETH, unwrappedToken } from '../../utils/wrappedCurrency';
import { ButtonEmpty, ButtonPrimary } from '../Button';
import { LightCard } from '../Card';
import { AutoColumn } from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import { AutoRow } from '../Row';
import DetailsDropdown from './DetailsDropdown';
import { AutoRowToColumn, ResponsiveSizedTextMedium, ResponsiveSizedTextNormal } from './styleds';

interface PoolCardProps {
  stakingInfo: StakingInfo;
  address: string;
  handleStake: (address: string, lpSupply?: TokenAmount, stakingInfo?: StakingInfo) => void;
  handleHarvest: (address: string) => void;
  toggleToken: boolean;
}

export default function PoolCard({ stakingInfo, address, toggleToken, handleStake, handleHarvest }: PoolCardProps) {
  const theme = useContext(ThemeContext);
  const { account } = useActiveWeb3React();

  const token0 = stakingInfo.tokens[0];
  const token1 = stakingInfo.tokens[1];
  const isOneTokenICR = token0 === ICR || token1 === ICR;
  const [isWETH, weth] = isOneTokenWETH(token0, token1);

  const currency0 = unwrappedToken(token0);
  const currency1 = unwrappedToken(token1);
  const [showMore, setShowMore] = useState(false);
  const [pairState, pair] = usePair(currency0, currency1);

  const LPSupply = useTokenBalance(account ?? undefined, pair?.liquidityToken ?? undefined);
  const LPTotalSupply = useTotalSupply(pair?.liquidityToken);

  // We create a new tokenAmaount as we get wrong pair from stakingInfo
  const totalStakedAmount = pair ? new TokenAmount(pair?.liquidityToken, stakingInfo.totalStakedAmount.raw) : undefined;
  const stakedAmount = pair ? new TokenAmount(pair?.liquidityToken, stakingInfo.stakedAmount.raw) : undefined;

  const USDPrice = useUSDTPrice(ICR);
  const USDPriceTRX = useUSDTPrice(weth);
  const ratePerYear = stakingInfo.rewardForDuration.multiply(YEARLY_RATE);
  const ratePerYearUSDT = ratePerYear && USDPrice?.quote(stakingInfo.rewardForDuration).multiply(YEARLY_RATE);

  // Check if the actual Token is ICR or WETH based
  const stakedInToken =
    !!pair &&
    !!LPTotalSupply &&
    !!LPSupply &&
    stakedAmount &&
    JSBI.greaterThan(LPTotalSupply?.raw, stakingInfo.stakedAmount.raw)
      ? isOneTokenICR
        ? pair?.getLiquidityValue(ICR, LPTotalSupply, stakedAmount, false)
        : isWETH && weth
        ? pair?.getLiquidityValue(weth, LPTotalSupply, stakedAmount, false)
        : undefined
      : undefined;

  const totalStakedInToken =
    !!pair &&
    !!LPTotalSupply &&
    !!LPSupply &&
    totalStakedAmount &&
    JSBI.greaterThan(LPTotalSupply?.raw, stakingInfo.totalStakedAmount.raw)
      ? isOneTokenICR
        ? pair?.getLiquidityValue(ICR, LPTotalSupply, totalStakedAmount, false)
        : isWETH && weth
        ? pair?.getLiquidityValue(weth, LPTotalSupply, totalStakedAmount, false)
        : undefined
      : undefined;

  const valueOfTotalStakedAmountInUSDT = totalStakedInToken
    ? isOneTokenICR
      ? USDPrice?.quote(totalStakedInToken)
      : USDPriceTRX?.quote(totalStakedInToken)
    : undefined;
  const valueOfEarnedAmountInUSDT = stakingInfo.earnedAmount && USDPrice?.quote(stakingInfo.earnedAmount);

  const apr =
    ratePerYearUSDT &&
    valueOfTotalStakedAmountInUSDT &&
    JSBI.greaterThan(valueOfTotalStakedAmountInUSDT.numerator, ZERO)
      ? new Percent(ratePerYearUSDT.numerator, JSBI.multiply(valueOfTotalStakedAmountInUSDT.numerator, JSBI.BigInt(2)))
      : 0;

  return (
    <LightCard
      style={{
        marginTop: '2px',
        margin: '0rem',
        padding: '1rem',
        background: theme.bg3,
      }}
    >
      <AutoRow justify="space-between" gap=".2rem">
        <AutoRowToColumn>
          <AutoRow>
            <CurrencyLogo currency={currency0} size="1.2rem" />
            &nbsp;
            <TYPE.white fontWeight={500} fontSize="1.2rem">
              {currency0?.symbol}&nbsp;/
            </TYPE.white>
            &nbsp;
            <CurrencyLogo currency={currency1} size="1.2rem" />
            &nbsp;
            <TYPE.white fontWeight={500} fontSize="1.2rem">
              {currency1?.symbol}
            </TYPE.white>
          </AutoRow>
        </AutoRowToColumn>
        <AutoRowToColumn gap="0.5rem">
          <ResponsiveSizedTextMedium fontWeight="1.3rem">Ends on</ResponsiveSizedTextMedium>
          <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.primary3}>
            {stakingInfo.periodFinish?.toLocaleString() || 'Not available yet'}
          </ResponsiveSizedTextNormal>
        </AutoRowToColumn>
        <AutoRowToColumn gap="1px">
          <ResponsiveSizedTextMedium fontWeight="1.3rem">Earned / APY</ResponsiveSizedTextMedium>
          {toggleToken ? (
            <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.primary3}>
              {stakingInfo.earnedAmount.toSignificant()} <CurrencyLogo currency={ICR} size=".8rem" />/ {apr.toFixed(2)}{' '}
              %
            </ResponsiveSizedTextNormal>
          ) : (
            <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.primary3}>
              {valueOfEarnedAmountInUSDT?.toFixed(2)} <CurrencyLogo currency={USDT} size=".8rem" />/ {apr.toFixed(2)} %
            </ResponsiveSizedTextNormal>
          )}
        </AutoRowToColumn>
        <AutoRowToColumn gap="1px">
          <ResponsiveSizedTextMedium fontWeight="0.7rem">Balance</ResponsiveSizedTextMedium>
          <ExternalLink
            style={{ textAlign: 'left', color: '#fff' }}
            href={`#/add/${currency0 === ETHER ? ETHER.symbol : token0?.address}/${
              currency1 === ETHER ? ETHER.symbol : token1?.address
            }`}
          >
            <ResponsiveSizedTextMedium fontWeight={400} style={{ textDecorationLine: 'underline' }}>
              Get LP
            </ResponsiveSizedTextMedium>
          </ExternalLink>
          {pairState === PairState.EXISTS ? (
            <ResponsiveSizedTextNormal fontWeight="0.7rem" color={theme.primary3}>
              {LPSupply?.toSignificant(4)}
            </ResponsiveSizedTextNormal>
          ) : (
            <Dots></Dots>
          )}
        </AutoRowToColumn>
        <AutoColumn justify="center" style={{ width: '25rem' }} gap="1rem">
          <AutoRow gap=".1rem">
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              width="48%"
              style={{ color: '#000' }}
              onClick={() => handleHarvest(address)}
            >
              <AutoColumn>
                <ResponsiveSizedTextMedium fontWeight="0.8rem">Harvest</ResponsiveSizedTextMedium>
                <ResponsiveSizedTextNormal fontWeight="0.5rem">
                  {stakingInfo.earnedAmount?.greaterThan(0)
                    ? stakingInfo.earnedAmount?.toSignificant(4)
                    : 'Nothing to Harvest'}
                </ResponsiveSizedTextNormal>
              </AutoColumn>
            </ButtonPrimary>
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              width="48%"
              style={{ color: '#000' }}
              onClick={() => handleStake(address, LPSupply, stakingInfo)}
            >
              <AutoColumn>
                <ResponsiveSizedTextMedium fontWeight="0.7rem">Stake</ResponsiveSizedTextMedium>
                {pairState === PairState.EXISTS ? (
                  <ResponsiveSizedTextNormal fontWeight="0.5rem">
                    {LPSupply?.greaterThan(0) ? LPSupply?.toSignificant(4) : 'No liquidity'}
                  </ResponsiveSizedTextNormal>
                ) : (
                  <Dots></Dots>
                )}
              </AutoColumn>
            </ButtonPrimary>
          </AutoRow>
          <ButtonEmpty padding="0px" borderRadius="6" width="2rem" onClick={() => setShowMore(!showMore)}>
            {showMore ? (
              <>
                {/* {' '}
                  Manage */}
                <ChevronUp size="20" style={{ marginLeft: '0px', color: '#fff' }} />
              </>
            ) : (
              <>
                {/* Manage */}
                <ChevronDown size="20" style={{ marginLeft: '0px', color: '#fff' }} />
              </>
            )}
          </ButtonEmpty>
        </AutoColumn>
      </AutoRow>

      {showMore && (
        <DetailsDropdown
          stakingInfo={stakingInfo}
          stakedAmount={stakedInToken}
          totalStakedAmount={totalStakedInToken}
          pairState={pairState}
          address={address}
          toggleToken={toggleToken}
        />
      )}
    </LightCard>
  );
}
