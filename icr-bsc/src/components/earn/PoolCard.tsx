import { ETHER, JSBI, Percent, TokenAmount } from '@intercroneswap/v2-sdk'
import { useContext, useState } from 'react'
import { Divider } from 'theme'
import { Text, Button, Link } from '@pancakeswap/uikit'
import { ThemeContext } from 'styled-components'
import { PairState, usePair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { AutoRow } from 'components/Layout/Row'
import tokens from 'config/constants/tokens'
import { DoubleTokenAmount, GetAmountInBUSD } from 'utils/tokens'
import { Dots } from '../../views/Stake/styleds'
import { StakingInfo } from '../../state/stake/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { LightGreyCard } from '../Card'
import DetailsDropdown from './DetailsDropdown'
import { YEARLY_RATE } from '../../constants'
import {
  AutoRowToColumn,
  ResponsiveSizedTextMedium,
  ResponsiveSizedTextNormal,
  ArrowWrapper,
  ButtonAutoRow,
} from './styleds'
import StyledChevronUp from '../Chevrons/ChevronUp'
import StyledChevronDown from '../Chevrons/ChevronDown'
import { breakpointMap } from '../../../packages/uikit/src/theme/base'

const { icr: ICR, busd: BUSD } = tokens

const ZERO = JSBI.BigInt(0)

interface PoolCardProps {
  stakingInfo: StakingInfo
  address: string
  handleStake: (address: string, lpSupply?: TokenAmount, stakingInfo?: StakingInfo) => void
  handleHarvest: (address: string) => void
  toggleToken: boolean
}

export default function PoolCard({ stakingInfo, address, toggleToken, handleStake, handleHarvest }: PoolCardProps) {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const isMobile = window.innerWidth <= breakpointMap.sm

  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)
  const [showMore, setShowMore] = useState(false)
  const [pairState, pair] = usePair(currency0, currency1)

  const LPSupply = useTokenBalance(account ?? undefined, pair?.liquidityToken ?? undefined)
  const LPTotalSupply = useTotalSupply(pair?.liquidityToken)

  // We create a new tokenAmaount as we get wrong pair from stakingInfo
  const totalStakedAmount = pair ? new TokenAmount(pair?.liquidityToken, stakingInfo.totalStakedAmount.raw) : undefined
  const stakedAmount = pair ? new TokenAmount(pair?.liquidityToken, stakingInfo.stakedAmount.raw) : undefined

  const USDPrice = useBUSDPrice(token0)
  const USDPriceBackup = useBUSDPrice(token1)
  const earnedUSDPrice = useBUSDPrice(stakingInfo.earnedAmount.token)
  const ratePerYear = stakingInfo.rewardForDuration.multiply(YEARLY_RATE)
  const ratePerYearBUSD = ratePerYear && earnedUSDPrice?.quote(stakingInfo.rewardForDuration).multiply(YEARLY_RATE)

  // Check if the actual Token is ICR or WETH based
  const stakedInToken =
    !!pair &&
    !!LPTotalSupply &&
    !!LPSupply &&
    stakedAmount &&
    JSBI.greaterThan(LPTotalSupply?.raw, stakingInfo.stakedAmount.raw)
      ? DoubleTokenAmount(pair.getLiquidityValue(USDPrice ? token0 : token1, LPTotalSupply, stakedAmount, false))
      : undefined

  const totalStakedInToken =
    !!pair &&
    !!LPTotalSupply &&
    !!LPSupply &&
    totalStakedAmount &&
    JSBI.greaterThan(LPTotalSupply?.raw, stakingInfo.totalStakedAmount.raw)
      ? DoubleTokenAmount(pair.getLiquidityValue(USDPrice ? token0 : token1, LPTotalSupply, totalStakedAmount, false))
      : undefined

  const valueOfTotalStakedAmountInBUSD = GetAmountInBUSD(USDPrice ?? USDPriceBackup, totalStakedInToken)
  const valueOfEarnedAmountInBUSD = GetAmountInBUSD(earnedUSDPrice, stakingInfo.earnedAmount)

  const apr =
    stakingInfo.active &&
    ratePerYearBUSD &&
    valueOfTotalStakedAmountInBUSD &&
    JSBI.greaterThan(valueOfTotalStakedAmountInBUSD.numerator, ZERO)
      ? new Percent(ratePerYearBUSD.numerator, valueOfTotalStakedAmountInBUSD.numerator)
      : undefined

  return (
    <LightGreyCard style={{ marginTop: '2px', margin: '0rem', padding: '.5rem 1rem' }}>
      <AutoRow justify="space-between" gap=".2rem" padding="0px 6px">
        <AutoRowToColumn justify="center" style={{ flexWrap: 'wrap' }}>
          <AutoRow justify={isMobile ? 'center' : undefined}>
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
          <AutoRow gap="2px" justify={isMobile ? 'center' : 'start'}>
            <Text style={{ color: theme.colors.primary }}>Earn {stakingInfo.earnedAmount.token?.symbol}</Text>
            <CurrencyLogo currency={stakingInfo.earnedAmount.token} size="1rem" />
          </AutoRow>
        </AutoRowToColumn>
        <AutoRowToColumn gap="2px">
          <ResponsiveSizedTextNormal>Ends on</ResponsiveSizedTextNormal>
          <ResponsiveSizedTextMedium color={theme.colors.primary}>
            {stakingInfo.periodFinish?.toLocaleDateString() || 'Not available yet'}
          </ResponsiveSizedTextMedium>
        </AutoRowToColumn>
        <AutoRowToColumn gap="1px">
          <ResponsiveSizedTextNormal fontWeight="1.3rem">Earned / APY</ResponsiveSizedTextNormal>
          {toggleToken ? (
            <ResponsiveSizedTextMedium fontWeight="0.6rem" color={theme.colors.primary}>
              {stakingInfo.earnedAmount.toSignificant(4)}{' '}
              <CurrencyLogo currency={stakingInfo.earnedAmount.token} size=".8rem" />/{' '}
              {apr ? `${apr.toFixed(2)} %` : '-'}{' '}
            </ResponsiveSizedTextMedium>
          ) : (
            <ResponsiveSizedTextMedium fontWeight="0.6rem" color={theme.colors.primary}>
              {valueOfEarnedAmountInBUSD?.toFixed(2)} <CurrencyLogo currency={BUSD} size=".8rem" />/{' '}
              {apr ? `${apr.toFixed(2)} %` : '-'}
            </ResponsiveSizedTextMedium>
          )}
        </AutoRowToColumn>
        <AutoRowToColumn gap="1px" justify="stretch">
          <AutoRow justify="space-between" width="10rem">
            <ResponsiveSizedTextNormal fontWeight="0.7rem">Balance</ResponsiveSizedTextNormal>
            {stakingInfo.stakedAmount?.greaterThan(ZERO) && (
              <Link
                style={{ textAlign: 'left', color: '#fff' }}
                href={`/add/${currency0 === ETHER ? ETHER.symbol : token0?.address}/${
                  currency1 === ETHER ? ETHER.symbol : token1?.address
                }`}
              >
                <ResponsiveSizedTextNormal fontWeight={400} style={{ textDecorationLine: 'underline' }}>
                  Get LP
                </ResponsiveSizedTextNormal>
              </Link>
            )}
          </AutoRow>
          {pairState === PairState.EXISTS ? (
            <ResponsiveSizedTextMedium fontWeight="0.7rem" color={theme.colors.primary}>
              {LPSupply?.toSignificant(4)}
            </ResponsiveSizedTextMedium>
          ) : (
            <Dots />
          )}
        </AutoRowToColumn>
        <ButtonAutoRow gap=".5rem" justify="flex-end">
          <Button
            padding="8px"
            width={isMobile ? '43%' : '40%'}
            height={45}
            onClick={() => handleHarvest(address)}
            disabled={stakingInfo.earnedAmount?.equalTo(ZERO)}
          >
            <AutoColumn>
              <ResponsiveSizedTextMedium color="rgb(44, 47, 54)">Harvest</ResponsiveSizedTextMedium>
              <ResponsiveSizedTextNormal fontWeight="400" style={{ color: 'rgb(44, 47, 54)' }}>
                {stakingInfo.earnedAmount?.toSignificant(4)}
              </ResponsiveSizedTextNormal>
            </AutoColumn>
          </Button>
          {LPSupply?.greaterThan(ZERO) || stakingInfo.stakedAmount?.greaterThan(ZERO) ? (
            <Button
              padding="8px"
              width={isMobile ? '43%' : '40%'}
              height={45}
              onClick={() => handleStake(address, LPSupply, stakingInfo)}
            >
              <AutoColumn>
                <ResponsiveSizedTextMedium color="rgb(44, 47, 54)">Stake / Unstake</ResponsiveSizedTextMedium>
              </AutoColumn>
            </Button>
          ) : (
            <Button
              padding="8px"
              width={isMobile ? '43%' : '40%'}
              height={45}
              onClick={(e) => {
                e.preventDefault()
                window.location.href = `/add/${currency0 === ETHER ? ETHER.symbol : token0?.address}/${
                  currency1 === ETHER ? ETHER.symbol : token1?.address
                }`
              }}
            >
              <ResponsiveSizedTextMedium color="rgb(44, 47, 54)">Get LP</ResponsiveSizedTextMedium>
            </Button>
          )}
          {showMore && isMobile && <Divider />}
          <ArrowWrapper clickable style={{ width: isMobile ? '100%' : '6%', justifyItems: 'center' }}>
            {showMore ? (
              <StyledChevronUp onClick={() => setShowMore(!showMore)} />
            ) : (
              <StyledChevronDown onClick={() => setShowMore(!showMore)} />
            )}
          </ArrowWrapper>
        </ButtonAutoRow>
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
    </LightGreyCard>
  )
}
