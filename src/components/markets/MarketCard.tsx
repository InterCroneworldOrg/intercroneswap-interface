import { ETHER, Pair, Percent, Token, TokenAmount } from '@intercroneswap/v2-sdk'
import { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Button, Link, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { CurrencyLogo } from 'components/Logo'
import { currencyFormatter, getBscScanLink } from 'utils'
import { ArrowWrapper, ResponsiveSizedTextMedium } from 'components/earn/styleds'
import { AutoRow } from '../../../packages/uikit/src/styles/header.styles'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { LightGreyCard } from '../Card'
import StyledChevronUp from '../Chevrons/ChevronUp'
import StyledChevronDown from '../Chevrons/ChevronDown'

export interface MarketCardProps {
  pair: Pair
  tokens?: [Token, Token]
  liquidity?: string
  dailyVolume?: TokenAmount
  apy?: Percent
  stakingAddress?: string
}

const MobileHidden = styled(AutoRow)``

export default function MarketCard({
  pair,
  stakingAddress,
  liquidity,
}: // lastPrice,
// dailyVolume,
// apy,
MarketCardProps) {
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
      <AutoRow justify="start" gap=".2rem">
        <Link style={{ width: '20%', display: 'flex' }} href={getBscScanLink(pair.liquidityToken.address, 'token')}>
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
        </Link>
        <AutoRow style={{ width: '13%' }}>
          <Text color={theme.colors.primary}>{currencyFormatter.format(Number(liquidity))}</Text>
        </AutoRow>
        <MobileHidden style={{ width: '13%' }}>
          <Text color={theme.colors.primary}>{dailyVolume ? `$ ${dailyVolume}` : 'Coming Soon'}</Text>
        </MobileHidden>
        <MobileHidden style={{ width: '13%' }}>
          <Text color={theme.colors.primary}>{apy ? `${apy} %` : 'Coming Soon'}</Text>
        </MobileHidden>
        <MobileHidden style={{ width: '13%' }}>
          <Text color={theme.colors.primary}>{stakingAddress ? 'Active' : 'Inactive'}</Text>
        </MobileHidden>
        <Button
          padding="8px"
          width="10%"
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
          width="10%"
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
        <ArrowWrapper clickable style={{ width: '4%', justifyItems: 'center' }}>
          {showMore ? (
            <StyledChevronUp onClick={() => setShowMore(!showMore)} />
          ) : (
            <StyledChevronDown onClick={() => setShowMore(!showMore)} />
          )}
        </ArrowWrapper>
      </AutoRow>
    </LightGreyCard>
  )
}
