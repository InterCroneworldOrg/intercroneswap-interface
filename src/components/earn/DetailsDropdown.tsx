import { TokenAmount } from '@intercroneswap/v2-sdk';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { BUSD } from '../../constants/tokens';
import { PairState } from 'hooks/usePairs'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { StakingInfo } from '../../state/stake/hooks';
import { Divider } from '../../theme';
import { LinkExternal} from '@pancakeswap/uikit'
import { getBscScanLink } from '../../utils';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import { CurrencyLogo } from 'components/Logo'
import { Dots } from '../swap/styleds';
import { Countdown } from './Countdown';
import {
  AutoColumnToRow,
  SpacedToCenteredAutoRow,
  RowBetweenToDiv,
  ResponsiveSizedTextMedium,
  ResponsiveSizedTextNormal,
} from './styleds';

interface DetailsDropDownParams {
  stakingInfo: StakingInfo;
  toggleToken: boolean;
  address: string;
  pairState: PairState;
  stakedAmount: TokenAmount | undefined;
  totalStakedAmount: TokenAmount | undefined;
}

export default function DetailsDropdown({
  stakingInfo,
  toggleToken,
  address,
  pairState,
  stakedAmount,
  totalStakedAmount,
}: DetailsDropDownParams) {
  const theme = useContext(ThemeContext);
  const { chainId } = useActiveWeb3React();

  const currency = stakedAmount ? unwrappedToken(stakedAmount?.token) : undefined;
  const USDPrice = useBUSDPrice(stakedAmount?.token);
  const valueOfStakedAmountInBUSD = stakedAmount && USDPrice?.quote(stakedAmount);
  const valueOfTotalStakedAmountInBUSD = totalStakedAmount && USDPrice?.quote(totalStakedAmount);

  return (
    <AutoColumnToRow>
      <Divider />
      <SpacedToCenteredAutoRow gap=".3rem">
        <RowBetweenToDiv>
          <Countdown exactEnd={stakingInfo.periodFinish} durationDays={stakingInfo.rewardDuration} />
        </RowBetweenToDiv>
        <RowBetweenToDiv>
          <ResponsiveSizedTextMedium fontWeight="0.7rem">Staked</ResponsiveSizedTextMedium>
          {toggleToken ? (
            <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.primary3}>
              {stakedAmount?.toSignificant() ?? '-'} <CurrencyLogo currency={currency} size=".8rem" />
            </ResponsiveSizedTextNormal>
          ) : (
            <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.primary3}>
              {valueOfStakedAmountInBUSD?.toFixed(2) ?? '-'} <CurrencyLogo currency={BUSD} size=".8rem" />
            </ResponsiveSizedTextNormal>
          )}
        </RowBetweenToDiv>
        <RowBetweenToDiv>
          <ResponsiveSizedTextMedium fontWeight="0.7rem">Total Staked</ResponsiveSizedTextMedium>
          {pairState === PairState.EXISTS ? (
            <>
              {toggleToken ? (
                <ResponsiveSizedTextNormal fontWeight="0.7rem" color={theme.primary3}>
                  {totalStakedAmount?.toSignificant(4)} <CurrencyLogo currency={currency} size=".8rem" />
                </ResponsiveSizedTextNormal>
              ) : (
                <ResponsiveSizedTextNormal fontWeight="0.7rem" color={theme.primary3}>
                  {valueOfTotalStakedAmountInBUSD?.toFixed(2)} <CurrencyLogo currency={BUSD} size=".8rem" />
                </ResponsiveSizedTextNormal>
              )}
            </>
          ) : (
            <Dots></Dots>
          )}
        </RowBetweenToDiv>
        <LinkExternal
          style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}
          href={chainId ? getBscScanLink(address, 'address', chainId) : '#'}
        >
          <ResponsiveSizedTextMedium fontWeight="0.7rem">View Smart Contract</ResponsiveSizedTextMedium>
        </LinkExternal>
        <LinkExternal
          style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}
          href={chainId ? getBscScanLink(stakingInfo.rewardForDuration.token.address, 'token', chainId) : '#'}
        >
          <ResponsiveSizedTextMedium fontWeight="0.7rem">View Token Info</ResponsiveSizedTextMedium>
        </LinkExternal>
      </SpacedToCenteredAutoRow>
    </AutoColumnToRow>
  );
}
