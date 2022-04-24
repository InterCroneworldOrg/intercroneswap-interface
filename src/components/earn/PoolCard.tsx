import { ETHER, JSBI, Percent, TokenAmount } from '@intercroneswap/v2-sdk'
import { useContext, useState } from 'react'
import { Text, Button, LinkExternal } from '@pancakeswap/uikit'
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
import { LightCard } from '../Card'
import DetailsDropdown from './DetailsDropdown'
import { YEARLY_RATE } from '../../constants'
import { AutoRowToColumn, ResponsiveSizedTextMedium, ResponsiveSizedTextNormal, ArrowWrapper } from './styleds'
import StyledChevronUp from './ChevronUp'
import StyledChevronDown from './ChevronDown'

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

  const valueOfTotalStakedAmountInBUSD = GetAmountInBUSD(USDPrice ? USDPrice : USDPriceBackup, totalStakedInToken)
  const valueOfEarnedAmountInBUSD = GetAmountInBUSD(earnedUSDPrice, stakingInfo.earnedAmount)

  const apr =
    ratePerYearBUSD &&
    valueOfTotalStakedAmountInBUSD &&
    JSBI.greaterThan(valueOfTotalStakedAmountInBUSD.numerator, ZERO)
      ? new Percent(ratePerYearBUSD.numerator, JSBI.multiply(valueOfTotalStakedAmountInBUSD.numerator, JSBI.BigInt(2)))
      : undefined

  return (
    <LightCard style={{ marginTop: '2px', margin: '0rem', padding: '1rem', background: theme.colors.background }}>
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
          <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.colors.primary}>
            {stakingInfo.periodFinish?.toLocaleString() || 'Not available yet'}
          </ResponsiveSizedTextNormal>
        </AutoRowToColumn>
        <AutoRowToColumn gap="1px">
          <ResponsiveSizedTextMedium fontWeight="1.3rem">Earned / APY</ResponsiveSizedTextMedium>
          {toggleToken ? (
            <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.colors.primary}>
              {stakingInfo.earnedAmount.toSignificant()} <CurrencyLogo currency={ICR} size=".8rem" />/{' '}
              {apr ? `${apr.toFixed(2)} %` : '-'}{' '}
            </ResponsiveSizedTextNormal>
          ) : (
            <ResponsiveSizedTextNormal fontWeight="0.6rem" color={theme.colors.primary}>
              {valueOfEarnedAmountInBUSD?.toFixed(2)} <CurrencyLogo currency={BUSD} size=".8rem" />/{' '}
              {apr ? `${apr.toFixed(2)} %` : '-'}
            </ResponsiveSizedTextNormal>
          )}
        </AutoRowToColumn>
        <AutoRowToColumn gap="1px">
          <ResponsiveSizedTextMedium fontWeight="0.7rem">Balance</ResponsiveSizedTextMedium>
          <LinkExternal
            style={{ textAlign: 'left', color: '#fff' }}
            href={`/add/${currency0 === ETHER ? ETHER.symbol : token0?.address}/${
              currency1 === ETHER ? ETHER.symbol : token1?.address
            }`}
          >
            <ResponsiveSizedTextMedium fontWeight={400} style={{ textDecorationLine: 'underline' }}>
              Get LP
            </ResponsiveSizedTextMedium>
          </LinkExternal>
          {pairState === PairState.EXISTS ? (
            <ResponsiveSizedTextNormal fontWeight="0.7rem" color={theme.colors.primary}>
              {LPSupply?.toSignificant(4)}
            </ResponsiveSizedTextNormal>
          ) : (
            <Dots />
          )}
        </AutoRowToColumn>
        <AutoColumn justify="center" style={{ maxWidth: '25rem', width: '100%' }} gap="1rem">
          <AutoRow gap=".1rem">
            <Button padding="8px" width="48%" height={60} onClick={() => handleHarvest(address)}>
              <AutoColumn>
                <ResponsiveSizedTextMedium fontWeight="0.8rem" color="rgb(44, 47, 54)">
                  Harvest
                </ResponsiveSizedTextMedium>
                <ResponsiveSizedTextNormal fontWeight="0.5rem" color="rgb(44, 47, 54)">
                  {stakingInfo.earnedAmount?.greaterThan(0)
                    ? stakingInfo.earnedAmount?.toSignificant(4)
                    : 'Nothing to Harvest'}
                </ResponsiveSizedTextNormal>
              </AutoColumn>
            </Button>
            <Button padding="8px" width="48%" height={60} onClick={() => handleStake(address, LPSupply, stakingInfo)}>
              <AutoColumn>
                <ResponsiveSizedTextMedium fontWeight="0.7rem" color="rgb(44, 47, 54)">
                  Stake / Unstake
                </ResponsiveSizedTextMedium>
                {pairState === PairState.EXISTS ? (
                  <ResponsiveSizedTextNormal fontWeight="0.5rem" color="rgb(44, 47, 54)">
                    {LPSupply?.greaterThan(0) ? LPSupply?.toSignificant(4) : 'No liquidity'}
                  </ResponsiveSizedTextNormal>
                ) : (
                  <Dots />
                )}
              </AutoColumn>
            </Button>
          </AutoRow>
          <ArrowWrapper clickable>
            {showMore ? (
              <StyledChevronUp onClick={() => setShowMore(!showMore)} />
            ) : (
              <StyledChevronDown onClick={() => setShowMore(!showMore)} />
            )}
          </ArrowWrapper>
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
  )
}
