import { Divider } from '../../theme'
import { RefObject, useCallback, useRef, useState, KeyboardEvent, useMemo, useContext, useEffect } from 'react'
import { PageWrapper, StyledHeading } from '../Stake/styleds'
import { LightCard } from '../../components/Card'
import { Text } from '@pancakeswap/uikit'
import { SearchInput } from '../../components/SearchModal/styleds'
import MarketCard from '../../components/markets/MarketCard'
import { ChainId, JSBI, Token } from '@intercroneswap/v2-sdk'
import { StakingRewardsInfo, REWARDS_DURATION_DAYS_180, REWARDS_DURATION_DAYS } from '../../state/stake/constants'
import { AutoColumn } from 'components/Layout/Column'
import { getTokensFromDefaults } from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { RowBetween, AutoRow } from '../../../packages/uikit/src/styles/header.styles'
import { breakpointMap } from '../../../packages/uikit/src/theme/base'
import useInterval from 'hooks/useInterval'
import { BACKEND_URL } from 'config'
import Page from 'views/Page'
import { MarketInfo, useMarkets } from 'hooks/useMarkets'
import { ThemeContext } from 'styled-components'
import { useRouter } from 'next/router'
import { Pagination } from 'react-bootstrap'
import { MarketHeader } from './styleds'
import { TotalValueLocked } from 'components/TotalValueLocked'

const tokenPairsAreEqual = (tokens1: [Token, Token], tokens2?: [Token, Token]): boolean => {
  if (!tokens2) {
    return false
  }
  const [token10, token11] = tokens1
  const [token20, token21] = tokens2

  if (!token10.equals(token20) && !token10.equals(token21)) return false
  if (!token11.equals(token20) && !token11.equals(token21)) return false
  return true
}

let stakingInfosRaw: {
  [chainId: number]: {
    [version: string]: {
      [tokens: string]: string
    }
  }
} = {}
fetch('https://raw.githubusercontent.com/InterCroneworldOrg/token-lists/main/staking-addresses.json')
  .then((response) => response.json())
  .then((data) => (stakingInfosRaw = data))

export default function Markets() {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useContext(ThemeContext)
  const { chainId } = useActiveWeb3React()
  const isMobile = window.innerWidth <= breakpointMap.md
  const [pagingInfo, setPagingInfo] = useState<any>(undefined)
  const [pairInfos, setPairInfos] = useState<any[]>([])
  const pageArr = router.query.page || []
  let page = 1
  if (pageArr.length === 1) {
    page = Number(pageArr[0])
  }
  console.log('Page:', page)

  const fetchData = async () => {
    const response = await (
      await fetch(`${BACKEND_URL}/markets?chainId=${chainId && ChainId.MAINNET}&page=${page}`)
    ).json()
    setPairInfos(response.data.markets)
    setPagingInfo(response.data.pagination)
  }
  useInterval(() => {
    fetchData()
  }, 1000 * 30)
  useEffect(() => {
    fetchData()
  }, [page])

  const inputRef = useRef<HTMLInputElement>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const markets = useMarkets(pairInfos)

  const marketList = useMemo(() => {
    if (searchQuery) {
      return markets?.filter((info: MarketInfo) => {
        return (
          info.pair.token0.symbol?.toLowerCase().includes(searchQuery) ||
          info.pair.token0.name?.toLowerCase().includes(searchQuery) ||
          info.pair.token1.symbol?.toLowerCase().includes(searchQuery) ||
          info.pair.token1.name?.toLowerCase().includes(searchQuery)
        )
      })
    }
    return markets
  }, [markets, searchQuery, page])

  const stakingRewardInfos: StakingRewardsInfo[] = useMemo(() => {
    const tmpinfos: StakingRewardsInfo[] = []
    stakingInfosRaw && chainId && stakingInfosRaw[chainId]
      ? Object.keys(stakingInfosRaw[chainId]).map((version) => {
          const vals = stakingInfosRaw[chainId][version]
          Object.keys(vals).map((tokens) => {
            const tokensFromDefault = getTokensFromDefaults(tokens)
            if (tokensFromDefault) {
              tmpinfos.push({
                stakingRewardAddress: vals[tokens],
                tokens: tokensFromDefault,
                rewardsDays: version !== 'v0' ? REWARDS_DURATION_DAYS_180 : REWARDS_DURATION_DAYS,
                legacy: version === 'v1',
              })
            }
          })
        })
      : undefined
    return tmpinfos
  }, [chainId, stakingInfosRaw])

  const handleInput = useCallback((event) => {
    const input = event.target.value
    setSearchQuery(input.toLowerCase())
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        setSearchQuery(s)
      }
    },
    [searchQuery],
  )

  return (
    <Page>
      <StyledHeading>Markets</StyledHeading>
      <TotalValueLocked />
      <PageWrapper justify="center" style={{ marginTop: 30 }}>
        <LightCard style={{ margin: '5rem 0' }}>
          <AutoColumn gap="1rem" justify="space-between">
            <RowBetween>
              <Text style={{ fontSize: '2rem' }}>Top Pools</Text>
            </RowBetween>
            <MarketHeader style={{ padding: '0rem 1rem', margin: 0 }}>
              <Text width="20%">Pair</Text>
              <Text width="13%">Liquidity</Text>
              <Text width="13%">24h volume</Text>
              <Text width="13%">APY</Text>
              <Text width="13%">LP Staking</Text>
              <SearchInput
                type="text"
                id="token-search-input"
                placeholder={t('Search')}
                value={searchQuery}
                ref={inputRef as RefObject<HTMLInputElement>}
                onChange={handleInput}
                onKeyDown={handleEnter}
                style={{ fontSize: '.9rem', width: '25%' }}
              />
            </MarketHeader>
            <Divider style={{ margin: 0 }} />
            {marketList &&
              marketList.length > 0 &&
              marketList.map((market, index) => (
                <>
                  <MarketCard
                    key={market.pair.liquidityToken.address}
                    pair={market.pair}
                    liquidity={market.usdAmount}
                    stakingAddress={
                      stakingRewardInfos.find((info) =>
                        tokenPairsAreEqual(info.tokens, [market.pair.token0, market.pair.token1]),
                      )?.stakingRewardAddress
                    }
                  />
                </>
              ))}
          </AutoColumn>
        </LightCard>
      </PageWrapper>
      {pagingInfo && (
        <Pagination color={theme.colors.primary} style={{ background: theme.colors.background, marginTop: '2rem' }}>
          <Pagination.First style={{ background: theme.colors.background }} href={`/markets/1`} />
          {pagingInfo.page > 1 && <Pagination.Prev href={`/markets/${pagingInfo.page - 1}`} />}
          {pagingInfo.page > 2 && <Pagination.Item href={`/markets/1`}>1</Pagination.Item>}
          {pagingInfo.page > 3 && <Pagination.Ellipsis />}
          {Array.from({ length: 3 }, (_, i) => i + pagingInfo.page - 1).map((val) => {
            if (val <= pagingInfo.maxPages && val > 0) {
              return (
                <Pagination.Item
                  key={val}
                  active={pagingInfo.page === val}
                  disabled={pagingInfo.page === val}
                  href={`/markets/${val}`}
                >
                  {val}
                </Pagination.Item>
              )
            }
            return undefined
          })}
          {pagingInfo.page < pagingInfo.maxPages - 2 && <Pagination.Ellipsis />}
          {pagingInfo.page < pagingInfo.maxPages - 1 && (
            <Pagination.Item href={`/markets/${pagingInfo.maxPages}`}>{pagingInfo.maxPages}</Pagination.Item>
          )}
          {pagingInfo.page !== pagingInfo.maxPages && <Pagination.Next href={`/markets/${pagingInfo.page + 1}`} />}
          <Pagination.Last href={`/markets/${pagingInfo.maxPages}`} />
        </Pagination>
      )}
    </Page>
  )
}
