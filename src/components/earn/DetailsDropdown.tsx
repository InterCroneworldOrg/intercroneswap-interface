import { TokenAmount } from '@intercroneswap/v2-sdk'
import { useContext } from 'react'
import { Link } from '@pancakeswap/uikit'
import { ThemeContext } from 'styled-components'
import { PairState } from 'hooks/usePairs'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { CurrencyLogo } from 'components/Logo'
import tokens from 'config/constants/tokens'
import { StakingInfo } from '../../state/stake/hooks'
import { Divider } from '../../theme'
import { getBscScanLink } from '../../utils'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { Dots } from '../swap/styleds'
import { Countdown } from './Countdown'

import {
  AutoColumnToRow,
  SpacedToCenteredAutoRow,
  RowBetweenToDiv,
  ResponsiveSizedTextMedium,
  ResponsiveSizedTextNormal,
} from './styleds'
import { breakpointMap } from '../../../packages/uikit/src/theme/base'

interface DetailsDropDownParams {
  stakingInfo: StakingInfo
  toggleToken: boolean
  address: string
  pairState: PairState
  stakedAmount: TokenAmount | undefined
  totalStakedAmount: TokenAmount | undefined
}

const { busd: BUSD } = tokens

export default function DetailsDropdown({
  stakingInfo,
  toggleToken,
  address,
  pairState,
  stakedAmount,
  totalStakedAmount,
}: DetailsDropDownParams) {
  const theme = useContext(ThemeContext)
  const { chainId } = useActiveWeb3React()
  const isMobile = window.innerWidth <= breakpointMap.sm

  const currency = stakedAmount ? unwrappedToken(stakedAmount?.token) : undefined
  const USDPrice = useBUSDPrice(stakedAmount?.token)
  const valueOfStakedAmountInBUSD = stakedAmount && USDPrice?.quote(stakedAmount)
  const valueOfTotalStakedAmountInBUSD = totalStakedAmount && USDPrice?.quote(totalStakedAmount)

  return (
    <AutoColumnToRow>
      {!isMobile && <Divider />}
      <SpacedToCenteredAutoRow gap=".3rem">
        {stakingInfo.fee > 0 ? (
          <RowBetweenToDiv>
            <ResponsiveSizedTextMedium>Fee {stakingInfo.fee} %</ResponsiveSizedTextMedium>
          </RowBetweenToDiv>
        ) : undefined}
        <RowBetweenToDiv>
          <Countdown exactEnd={stakingInfo.periodFinish} durationDays={stakingInfo.rewardDuration} />
        </RowBetweenToDiv>
        <RowBetweenToDiv>
          <ResponsiveSizedTextNormal fontWeight="0.7rem">Staked</ResponsiveSizedTextNormal>
          {toggleToken ? (
            <ResponsiveSizedTextMedium fontWeight="0.6rem" color={theme.colors.primary}>
              {stakedAmount?.toSignificant() ?? '-'} <CurrencyLogo currency={currency} size=".8rem" />
            </ResponsiveSizedTextMedium>
          ) : (
            <ResponsiveSizedTextMedium fontWeight="0.6rem" color={theme.colors.primary}>
              {valueOfStakedAmountInBUSD?.toFixed(2) ?? '-'} <CurrencyLogo currency={BUSD} size=".8rem" />
            </ResponsiveSizedTextMedium>
          )}
        </RowBetweenToDiv>
        <RowBetweenToDiv>
          <ResponsiveSizedTextNormal fontWeight="0.7rem">Total Staked</ResponsiveSizedTextNormal>
          {pairState === PairState.EXISTS ? (
            <>
              {toggleToken ? (
                <ResponsiveSizedTextMedium fontWeight="0.7rem" color={theme.colors.primary}>
                  {totalStakedAmount?.toSignificant(4)} <CurrencyLogo currency={currency} size=".8rem" />
                </ResponsiveSizedTextMedium>
              ) : (
                <ResponsiveSizedTextMedium fontWeight="0.7rem" color={theme.colors.primary}>
                  {valueOfTotalStakedAmountInBUSD?.toFixed(2)} <CurrencyLogo currency={BUSD} size=".8rem" />
                </ResponsiveSizedTextMedium>
              )}
            </>
          ) : (
            <Dots />
          )}
        </RowBetweenToDiv>
        <Link
          style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}
          href={chainId ? getBscScanLink(address, 'address', chainId) : '#'}
        >
          <ResponsiveSizedTextNormal fontWeight="0.7rem">View Smart Contract</ResponsiveSizedTextNormal>
        </Link>
        <Link
          style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}
          href={chainId ? getBscScanLink(stakingInfo.rewardForDuration.token.address, 'token', chainId) : '#'}
        >
          <ResponsiveSizedTextNormal fontWeight="0.7rem">View Token Info</ResponsiveSizedTextNormal>
        </Link>
      </SpacedToCenteredAutoRow>
    </AutoColumnToRow>
  )
}
