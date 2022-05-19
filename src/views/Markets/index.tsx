import { Divider } from '../../theme'
import { RefObject, useCallback, useRef, useState, KeyboardEvent, useMemo } from 'react'
import { PageWrapper } from '../Stake/styleds'
import { LightCard } from '../../components/Card'
import { Text } from '@pancakeswap/uikit'
import { SearchInput } from '../../components/SearchModal/styleds'
import MarketCard from '../../components/markets/MarketCard'
import { ChainId, JSBI, Pair, Token } from '@intercroneswap/v2-sdk'
import { StakingRewardsInfo, REWARDS_DURATION_DAYS_180, REWARDS_DURATION_DAYS } from '../../state/stake/constants'
import { AutoColumn } from 'components/Layout/Column'
import { getTokensFromDefaults } from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePairs } from 'hooks/usePairs'
import { StyledHeading } from 'views/Home/components/Banners/Styled'
import { RowBetween, AutoRow } from '../../../packages/uikit/src/styles/header.styles'
import { breakpointMap } from '../../../packages/uikit/src/theme/base'
import { useRouter } from 'next/router'
import { useTrackedTokenPairs } from 'state/user/hooks'

const ZERO = JSBI.BigInt(0)
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

const convertRawInfoToTokenAmounts = (pairInfo: any): [Token, Token] | undefined => {
  if (pairInfo) {
    try {
      const tokenA = new Token(
        ChainId.MAINNET,
        pairInfo.tokenAHex.replace('41', '0x'),
        Number(pairInfo.tokenADecimal),
        pairInfo.tokenAAbbr,
        pairInfo.tokenAName,
      )
      // const tokenABalance = JSBI.multiply(
      //   JSBI.BigInt(Math.trunc(Number(pairInfo.tokenA_balance))),
      //   JSBI.multiply(TEN, JSBI.BigInt(Number(pairInfo.tokenA_Decimal))),
      // );

      // const tokenAAmount = new TokenAmount(tokenA, tokenABalance);
      const tokenB = new Token(
        ChainId.MAINNET,
        pairInfo.tokenBHex.replace('41', '0x'),
        Number(pairInfo.tokenBDecimal),
        pairInfo.tokenBAbbr,
        pairInfo.tokenBName,
      )
      // const tokenBBalance = JSBI.multiply(
      //   JSBI.BigInt(Math.trunc(Number(pairInfo.tokenB_Balance))),
      //   JSBI.multiply(TEN, JSBI.BigInt(Number(pairInfo.tokenB_Decimal))),
      // );
      // const tokenBAmount = new TokenAmount(tokenB, tokenBBalance);
      // const pair = new Pair(tokenAAmount, tokenBAmount, pairInfo.pair_hex.replace('41', '0x'));
      return [tokenA, tokenB]
    } catch (error) {
      console.error(error, 'Error while creating pair')
      return undefined
    }
  }
  return undefined
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
let marketInfosRaw: any[]
const allPairs: [Token, Token][] = []

fetch('https://api.intercroneswap.com/api/v1/getallpairs/tron?size=100')
  .then((response) => response.json())
  .then((data) => {
    marketInfosRaw = data?.pairs
    marketInfosRaw.map((pairInfo) => {
      const pair = convertRawInfoToTokenAmounts(pairInfo)
      if (pair) {
        allPairs.push(pair)
      }
    })
  })

export default function Markets() {
  const router = useRouter()
  router.push('/market')
  const { t } = useTranslation()
  //   const theme = useContext(ThemeContext);
  const isMobile = window.innerWidth <= breakpointMap.md
  const { chainId } = useActiveWeb3React()
  const inputRef = useRef<HTMLInputElement>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const trackedTokenPairs = useTrackedTokenPairs()
  const v1Pairs = usePairs(trackedTokenPairs)
  const allPairsLoaded = v1Pairs.map(([, pair]) => pair).filter((v1Pair): v1Pair is Pair => Boolean(v1Pair))
  const pairsWithLiquidity = allPairsLoaded.filter((pair) => pair.reserve0.greaterThan(ZERO)).reverse()

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
    <>
      <StyledHeading>Markets</StyledHeading>
      <PageWrapper justify="center">
        <LightCard style={{ marginTop: '20px' }}>
          <AutoColumn gap="1.5rem" justify="center">
            <RowBetween>
              <Text>Top Pools</Text>
              <SearchInput
                type="text"
                id="token-search-input"
                placeholder={t('poolSearchPlaceholder')}
                value={searchQuery}
                ref={inputRef as RefObject<HTMLInputElement>}
                onChange={handleInput}
                onKeyDown={handleEnter}
                width="1rem"
                style={{ fontSize: '.9rem', width: isMobile ? '57%' : '194px' }}
              />
            </RowBetween>
            <AutoRow style={{ padding: '0rem 3rem' }}>
              <Text width="30%">Pair</Text>
              <Text width="15%">Liquidity</Text>
              <Text width="15%">24h volume</Text>
              <Text width="15%">APY</Text>
              <Text width="15%">LP Staking</Text>
            </AutoRow>
            <Divider />
            {pairsWithLiquidity &&
              pairsWithLiquidity.length > 0 &&
              pairsWithLiquidity.map((pair, index) => (
                <>
                  <MarketCard
                    key={index}
                    pair={pair}
                    stakingAddress={
                      stakingRewardInfos.find((info) => tokenPairsAreEqual(info.tokens, [pair.token0, pair.token1]))
                        ?.stakingRewardAddress
                    }
                  />
                </>
              ))}
            {/* {dummyData.map((marketInfo) => (
              <>
                <MarketCard
                  key={marketInfo.tokens[1].symbol}
                  tokens={marketInfo.tokens}
                  dailyVolume={marketInfo.dailyVolume}
                  liquidity={marketInfo.liquidity}
                  lastPrice={marketInfo.lastPrice}
                />
              </>
            ))} */}
          </AutoColumn>
        </LightCard>
      </PageWrapper>
    </>
  )
}
