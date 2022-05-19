import { ChainId, Pair, Percent, Token, TokenAmount } from '@intercroneswap/v2-sdk'
import { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Link, Text } from '@pancakeswap/uikit'
import { LightCard, LightGreyCard } from '../Card'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useWeb3React } from '@web3-react/core'
import { CurrencyLogo } from 'components/Logo'
import { DoubleTokenAmount, GetAmountInBUSD } from 'utils/tokens'
import { AutoRow } from '../../../packages/uikit/src/styles/header.styles'
import { currencyFormatter, getBscScanLink } from 'utils'
import useBUSDPrice from 'hooks/useBUSDPrice'

export interface MarketCardProps {
  pair: Pair
  tokens?: [Token, Token]
  liquidity?: TokenAmount
  dailyVolume?: TokenAmount
  apy?: Percent
  stakingAddress?: string
}

const MobileHidden = styled(AutoRow)``

export default function MarketCard({
  pair,
  stakingAddress,
}: // lastPrice,
// liquidity,
// dailyVolume,
// apy,
MarketCardProps) {
  const theme = useContext(ThemeContext)
  // const isMobile = window.innerWidth <= MEDIA_WIDTHS.upToMedium;
  const { chainId } = useWeb3React()

  const token0 = pair.token0
  const token1 = pair.token1

  const USDPrice = useBUSDPrice(token0)
  const USDPriceBackup = useBUSDPrice(token1)

  const liquidity = USDPrice
    ? GetAmountInBUSD(USDPrice, DoubleTokenAmount(pair.reserve0))
    : GetAmountInBUSD(USDPriceBackup, DoubleTokenAmount(pair.reserve1))

  const dailyVolume: TokenAmount | undefined = undefined

  const apy: Percent | undefined = undefined

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  return (
    <LightGreyCard
      style={{
        marginTop: '2px',
        margin: '0rem',
        padding: '1rem 3rem',
      }}
    >
      <AutoRow justify="start" gap=".2rem">
        <Link style={{ width: '30%', display: 'flex' }} href={getBscScanLink(pair.liquidityToken.address, 'token')}>
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
        <AutoRow style={{ width: '15%' }}>
          <Text>{currencyFormatter.format(Number(liquidity?.toFixed(2)))}</Text>
        </AutoRow>
        <MobileHidden style={{ width: '15%' }}>
          <Text>{dailyVolume ? `$ ${dailyVolume}` : '-'}</Text>
        </MobileHidden>
        <MobileHidden style={{ width: '15%' }}>
          <Text>{apy ? `${apy} %` : '-'}</Text>
        </MobileHidden>
        <MobileHidden style={{ width: '15%' }}>
          <Text>{stakingAddress ? 'Active' : 'Inactive'}</Text>
        </MobileHidden>
      </AutoRow>
    </LightGreyCard>
  )
}
