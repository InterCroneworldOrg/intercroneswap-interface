import { ETHER, JSBI, Percent, TokenAmount } from '@intercroneswap/v2-sdk';
import { useContext, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Text } from 'rebass';
import styled, { ThemeContext } from 'styled-components';
import { YEARLY_RATE } from '../../constants';
import { ICR, USDT } from '../../constants/tokens';
import { PairState, usePair } from '../../data/Reserves';
import { useTotalSupply } from '../../data/TotalSupply';

import { useActiveWeb3React } from '../../hooks';
import useUSDTPrice from '../../hooks/useUSDTPrice';
import { Dots } from '../../pages/Stake/styleds';
import { StakingInfo } from '../../state/stake/hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
// import { tryParseAmount } from '../../state/swap/hooks';
import { Divider, ExternalLink } from '../../theme';
import { getEtherscanLink } from '../../utils';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import { ButtonEmpty, ButtonPrimary } from '../Button';
import { LightCard } from '../Card';
import { AutoColumn } from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import { AutoRow } from '../Row';
import { Countdown } from './Countdown';

interface PoolCardProps {
  stakingInfo: StakingInfo;
  address: string;
  handleStake: (address: string, lpSupply?: TokenAmount, stakingInfo?: StakingInfo) => void;
  handleHarvest: (address: string) => void;
  toggleToken: boolean;
}

export const AutoRowToColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string;
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between';
}>`
  display: grid;
  width: 100%
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
    padding: 0;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  `}
`;

export const AutoColumnToRow = styled(AutoRow)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: grid;
    margin: .5rem 0;
    padding: 0;
    width: 100%;
    grid-auto-rows: auto;
    justify-content: space-between;
  `}
`;

const SpacedToCenteredAutoRow = styled(AutoRow)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: space-between;
  `}
`;

const RowBetweenToDiv = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding: 0 1rem;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: space-between;
    width: 100%;
    padding: 0;
    gap: 0;
  `}
`;

export const ResponsiveSizedTextNormal = styled(Text)`
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: .5rem;
  `}
`;

export const ResponsiveSizedTextMedium = styled(Text)`
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: .7rem;
  `}
`;

export default function PoolCard({ stakingInfo, address, toggleToken, handleStake, handleHarvest }: PoolCardProps) {
  const theme = useContext(ThemeContext);

  const token0 = stakingInfo.tokens[0];
  const token1 = stakingInfo.tokens[1];
  const isOneTokenICR = token0 === ICR || token1 === ICR;

  const currency0 = unwrappedToken(token0);
  const currency1 = unwrappedToken(token1);
  const { account, chainId } = useActiveWeb3React();
  const [showMore, setShowMore] = useState(false);
  const [pairState, pair] = usePair(currency0, currency1);
  // const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.token);

  const LPSupply = useTokenBalance(account ?? undefined, pair?.liquidityToken ?? undefined);
  const LPTotalSupply = useTotalSupply(pair?.liquidityToken);
  // We create a new tokanemaount as we get wrong pair from stakingInfo
  const totalStakedAmount = pair ? new TokenAmount(pair?.liquidityToken, stakingInfo.totalStakedAmount.raw) : undefined;
  const stakedAmount = pair ? new TokenAmount(pair?.liquidityToken, stakingInfo.stakedAmount.raw) : undefined;

  const ratePerYear = stakingInfo.rewardForDuration.multiply(YEARLY_RATE);

  const USDPrice = useUSDTPrice(ICR);

  const stakedInICR =
    !!pair &&
    isOneTokenICR &&
    !!LPTotalSupply &&
    !!LPSupply &&
    stakedAmount &&
    JSBI.greaterThan(LPTotalSupply?.raw, stakingInfo.stakedAmount.raw)
      ? pair?.getLiquidityValue(ICR, LPTotalSupply, stakedAmount, false)
      : undefined;

  const valueOfStakedAmountInUSDT = stakedInICR && USDPrice?.quote(stakedInICR);
  const valueOfEarnedAmountInUSDT = stakingInfo.earnedAmount && USDPrice?.quote(stakingInfo.earnedAmount);
  const totalStakedInICR =
    !!pair &&
    isOneTokenICR &&
    !!LPTotalSupply &&
    !!LPSupply &&
    totalStakedAmount &&
    JSBI.greaterThan(LPTotalSupply?.raw, stakingInfo.totalStakedAmount.raw)
      ? pair?.getLiquidityValue(ICR, LPTotalSupply, totalStakedAmount, false)
      : undefined;

  const valueOfTotalStakedAmountInUSDT = totalStakedInICR && USDPrice?.quote(totalStakedInICR);

  const apr = totalStakedInICR
    ? new Percent(ratePerYear.numerator, JSBI.multiply(totalStakedInICR.numerator, JSBI.BigInt(2)))
    : 0;

  return (
    <LightCard style={{ marginTop: '2px', margin: '0rem', padding: '1rem', background: theme.bg3 }}>
      <AutoRow justify="space-between" gap=".2rem">
        <AutoRowToColumn>
          <AutoRow>
            <CurrencyLogo currency={currency0} size="1.2rem" />
            &nbsp;
            <Text fontWeight={500} fontSize="1.2rem">
              {currency0?.symbol}&nbsp;/
            </Text>
            &nbsp;
            <CurrencyLogo currency={currency1} size="1.2rem" />
            &nbsp;
            <Text fontWeight={500} fontSize="1.2rem">
              {currency1?.symbol}
            </Text>
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
          <AutoRow gap="1rem">
            <ResponsiveSizedTextMedium fontWeight="0.7rem">Balance</ResponsiveSizedTextMedium>
            <ExternalLink
              style={{ textAlign: 'center', color: '#fff' }}
              href={`#/add/${currency0 === ETHER ? ETHER.symbol : token0?.address}/${
                currency1 === ETHER ? ETHER.symbol : token1?.address
              }`}
            >
              <ResponsiveSizedTextMedium fontWeight={400} style={{ textDecorationLine: 'underline' }}>
                Get LP
              </ResponsiveSizedTextMedium>
            </ExternalLink>
          </AutoRow>
          {pairState === PairState.EXISTS ? (
            <ResponsiveSizedTextNormal fontWeight="0.7rem" color={theme.primary3}>
              {LPSupply?.toSignificant(4)}
            </ResponsiveSizedTextNormal>
          ) : (
            <Dots></Dots>
          )}
        </AutoRowToColumn>
        <AutoRowToColumn gap="1px">
          <ResponsiveSizedTextMedium fontWeight="0.7rem">Total Staked</ResponsiveSizedTextMedium>
          {pairState === PairState.EXISTS ? (
            <>
              {toggleToken ? (
                <ResponsiveSizedTextNormal fontWeight="0.7rem" color={theme.primary3}>
                  {totalStakedInICR?.toSignificant(4)} <CurrencyLogo currency={ICR} size=".8rem" />
                </ResponsiveSizedTextNormal>
              ) : (
                <ResponsiveSizedTextNormal fontWeight="0.7rem" color={theme.primary3}>
                  {valueOfTotalStakedAmountInUSDT?.toFixed(2)} <CurrencyLogo currency={USDT} size=".8rem" />
                </ResponsiveSizedTextNormal>
              )}
            </>
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
        <AutoColumnToRow>
          <Divider />
          <SpacedToCenteredAutoRow gap=".3rem">
            <RowBetweenToDiv>
              <Countdown exactEnd={stakingInfo.periodFinish} />
            </RowBetweenToDiv>
            <RowBetweenToDiv>
              <ResponsiveSizedTextMedium fontWeight="0.7rem">Liquidity</ResponsiveSizedTextMedium>
              {toggleToken ? (
                <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.primary3}>
                  {stakedInICR?.toSignificant() ?? '-'} <CurrencyLogo currency={ICR} size=".8rem" />
                </ResponsiveSizedTextNormal>
              ) : (
                <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.primary3}>
                  {valueOfStakedAmountInUSDT?.toFixed(2) ?? '-'} <CurrencyLogo currency={USDT} size=".8rem" />
                </ResponsiveSizedTextNormal>
              )}
            </RowBetweenToDiv>
            <ExternalLink
              style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}
              href={chainId ? getEtherscanLink(chainId, address, 'address') : '#'}
            >
              <ResponsiveSizedTextMedium fontWeight="0.7rem">View Smart Contract</ResponsiveSizedTextMedium>
            </ExternalLink>
            <ExternalLink
              style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}
              href={chainId ? getEtherscanLink(chainId, stakingInfo.stakingRewardAddress ?? '', 'token') : '#'}
            >
              <ResponsiveSizedTextMedium fontWeight="0.7rem">View Token Info</ResponsiveSizedTextMedium>
            </ExternalLink>
          </SpacedToCenteredAutoRow>
        </AutoColumnToRow>
      )}
    </LightCard>
  );
}
