import { ETHER, Pair, Percent, TokenAmount } from '@intercroneswap/v2-sdk'
import { useContext, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { Button, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { CurrencyLogo } from 'components/Logo'
import { currencyFormatter, getBscScanLink } from 'utils'
import { ArrowWrapper, ResponsiveSizedTextMedium } from 'components/earn/styleds'
import { AutoRow } from '../../../packages/uikit/src/styles/header.styles'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { LightGreyCard } from '../Card'
import StyledChevronUp from '../Chevrons/ChevronUp'
import StyledChevronDown from '../Chevrons/ChevronDown'
import { CardRow, MobileCenteredCurrencyLink, MobileHiddenButtons, MobileOnlyDivider, MobileOnlyText } from './styleds'
import MarketDetails from './MarketDetails'

export interface MarketCardProps {
  pair: Pair
  liquidity?: string
  dailyVolume?: TokenAmount
  apy?: Percent
  stakingAddress?: string
}

export default function MarketCard({ pair, stakingAddress, liquidity }: MarketCardProps) {
  const theme = useContext(ThemeContext)
  // const isMobile = window.innerWidth <= MEDIA_WIDTHS.upToMedium;
  const { chainId } = useWeb3React()

  const dailyVolume: TokenAmount | undefined = undefined
  const [showMore, setShowMore] = useState(false)

  const apy: Percent | undefined = undefined

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  return (
    <LightGreyCard
      style={{
        marginTop: '2px',
        margin: '0rem',
        padding: '1rem 1rem',
      }}
    >
      <AutoRow justify="space-between" gap=".2rem">
        <MobileCenteredCurrencyLink href={getBscScanLink(pair.liquidityToken.address, 'token')}>
          <CurrencyLogo currency={currency0} size="1.2rem" />
          &nbsp;
          <Text fontWeight={500} fontSize="1rem">
            {currency0?.symbol}&nbsp;/
          </Text>
          &nbsp;
          <CurrencyLogo currency={currency1} size="1.2rem" />
          &nbsp;
          <Text fontWeight={500} fontSize="1rem">
            {currency1?.symbol}
          </Text>
        </MobileCenteredCurrencyLink>
        <MobileOnlyDivider />
        <CardRow>
          <MobileOnlyText>Liquidity</MobileOnlyText>
          <Text color={theme.colors.primary}>{currencyFormatter.format(Number(liquidity))}</Text>
        </CardRow>
        <CardRow>
          <MobileOnlyText>24H Volumen</MobileOnlyText>
          <Text color={theme.colors.primary}>{dailyVolume ? `$ ${dailyVolume}` : 'Coming Soon'}</Text>
        </CardRow>
        <CardRow>
          <MobileOnlyText>APY</MobileOnlyText>
          <Text color={theme.colors.primary}>{apy ? `${apy} %` : 'Coming Soon'}</Text>
        </CardRow>
        <CardRow>
          <MobileOnlyText>Staking</MobileOnlyText>
          <Text color={theme.colors.primary}>{stakingAddress ? 'Active' : 'Inactive'}</Text>
        </CardRow>
        <MobileHiddenButtons>
          <Button
            padding="8px"
            width="40%"
            height={45}
            onClick={(e) => {
              e.preventDefault()
              window.location.href = `/swap`
              // /${currency0 === ETHER ? ETHER.symbol : pair.token0?.address}/${
              //   currency1 === ETHER ? ETHER.symbol : pair.token1?.address
              // }
            }}
          >
            <ResponsiveSizedTextMedium color="rgb(44, 47, 54)">Swap</ResponsiveSizedTextMedium>
          </Button>
          <Button
            padding="8px"
            width="40%"
            height={45}
            onClick={(e) => {
              e.preventDefault()
              window.location.href = `/add/${currency0 === ETHER ? ETHER.symbol : pair.token0?.address}/${
                currency1 === ETHER ? ETHER.symbol : pair.token1?.address
              }`
            }}
          >
            <ResponsiveSizedTextMedium color="rgb(44, 47, 54)">Get LP</ResponsiveSizedTextMedium>
          </Button>
          <ArrowWrapper clickable style={{ width: '8%', justifyItems: 'center' }}>
            {showMore ? (
              <StyledChevronUp onClick={() => setShowMore(!showMore)} />
            ) : (
              <StyledChevronDown onClick={() => setShowMore(!showMore)} />
            )}
          </ArrowWrapper>
        </MobileHiddenButtons>
      </AutoRow>
      {showMore && <MarketDetails pair={pair} />}
    </LightGreyCard>
  )
}
