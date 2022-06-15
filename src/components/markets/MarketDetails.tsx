import { Pair, TokenAmount } from '@intercroneswap/v2-sdk'
import { useContext, useEffect, useMemo, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { ThemeContext } from 'styled-components'
import { CurrencyLogo } from 'components/Logo'
import { Link } from '../../../packages/uikit/src/components/Link'
import useCoinGeckoInfo from '../../hooks/useCoinGeckoInfo'
import { breakpointMap } from '../../../packages/uikit/src/theme/base'
import { AutoRow, RowBetween } from '../../../packages/uikit/src/styles/header.styles'
import { Text } from '../../../packages/uikit/src/components/Text'
import { LightGreyCard } from '../Card'
import { currencyFormatter } from '../../utils'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { Divider } from '../../theme'
import { DetailCard, DetailsButton } from './styleds'

interface MarketDetailsParams {
  pair: Pair
}

export default function MarketDetails({ pair }: MarketDetailsParams) {
  const theme = useContext(ThemeContext)
  const { chainId } = useActiveWeb3React()
  const isMobile = window.innerWidth <= breakpointMap.md

  const [activeTokenAmount, setActiveTokenAmount] = useState<TokenAmount>(pair.reserve0)
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)
  const [coingGeckoInfo, setCoinGeckoInfo] = useState<any>(undefined)
  const fetchCoinGeckoData = async (coin: string | undefined) => {
    if (!coin) {
      return undefined
    }
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`)

      const data = await response.json()
      if (data.id === coin) {
        setCoinGeckoInfo(data)
      }
      return data
    } catch (error) {
      console.error('Error getting coingecko data', error)
      return undefined
    }
  }
  useEffect(() => {
    const activeCurrency = unwrappedToken(activeTokenAmount.token)
    fetchCoinGeckoData(activeCurrency.name?.toLowerCase().split(' ')[0])
  }, [chainId, activeTokenAmount])

  const truncatedAddress = useMemo(() => {
    const len = activeTokenAmount.token.address.length
    return `${activeTokenAmount.token.address.substring(0, 5)}...${activeTokenAmount.token.address.substring(
      len - 5,
      len,
    )}`
  }, [activeTokenAmount])

  const geckoInfo = useCoinGeckoInfo(unwrappedToken(activeTokenAmount.token), coingGeckoInfo)
  const price0 = useBUSDPrice(pair.token0)
  const price1 = useBUSDPrice(pair.token1)

  return (
    <DetailCard>
      {!isMobile && <Divider />}
      <RowBetween style={{ justifyItems: 'space-between', width: '100%' }}>
        <LightGreyCard style={{ width: '15%', alignItems: 'center' }} padding="0rem 1rem">
          <DetailsButton
            aria-selected={activeTokenAmount.token.equals(pair.token0)}
            onClick={() => setActiveTokenAmount(pair.reserve0)}
          >
            <CurrencyLogo currency={currency0} style={{ marginRight: '.5rem' }} />
            <Text>{currency0?.symbol}</Text>
          </DetailsButton>
          <DetailsButton
            aria-selected={activeTokenAmount.token.equals(pair.token1)}
            onClick={() => setActiveTokenAmount(pair.reserve1)}
          >
            <CurrencyLogo currency={currency1} style={{ marginRight: '.5rem' }} />
            <Text>{currency1?.symbol}</Text>
          </DetailsButton>
        </LightGreyCard>
        <AutoRow style={{ width: '40%' }}>
          <RowBetween style={{ width: '100%' }}>
            <Text>Liquidity</Text>
            <Text color={theme.colors.primary}>{activeTokenAmount.toSignificant(4)}</Text>
          </RowBetween>
          <RowBetween style={{ width: '100%' }}>
            <Text style={{ wordWrap: 'break-word' }}>Circulating Supply</Text>
            <Text color={theme.colors.primary}>{geckoInfo.circulatingSupply}</Text>
          </RowBetween>
          <RowBetween style={{ width: '100%' }}>
            <Text>Contract address</Text>
            <Text color={theme.colors.primary}>{truncatedAddress}</Text>
          </RowBetween>
          <RowBetween style={{ width: '100%' }}>
            <Text>Market cap</Text>
            <Text color={theme.colors.primary}>{currencyFormatter.format(Number(geckoInfo.marketCap))}</Text>
          </RowBetween>
        </AutoRow>
        <AutoRow style={{ width: '40%' }}>
          <RowBetween style={{ width: '100%' }}>
            <Text>Market Cap Rank</Text>
            <Text color={theme.colors.primary}>{geckoInfo.marketCapRank ?? '-'}</Text>
          </RowBetween>
          <RowBetween style={{ width: '100%' }}>
            <Text>Trading Volume 24H</Text>
            <Text color={theme.colors.primary}>{currencyFormatter.format(geckoInfo.marketCapChange24h) ?? '-'}</Text>
          </RowBetween>
          <RowBetween style={{ width: '100%' }}>
            <Text>Price</Text>
            <Text color={theme.colors.primary}>
              {`$ ${
                activeTokenAmount.token === pair.token0 ? price0?.adjusted.toFixed(4) : price1?.adjusted.toFixed(4)
              }`}
            </Text>
          </RowBetween>
          <RowBetween style={{ width: '100%' }}>
            <Link
              href={`https://www.coingecko.com/en/coins/${geckoInfo?.id}`}
              style={{ color: 'white', textDecorationLine: 'underline' }}
            >
              View on CoinGecko
            </Link>
            <Link
              href={`https://www.coingecko.com/en/coins/${geckoInfo?.id}`}
              style={{ color: 'white', textDecorationLine: 'underline' }}
            >
              View Chart
            </Link>
          </RowBetween>
        </AutoRow>
      </RowBetween>
    </DetailCard>
  )
}
