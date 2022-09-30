import { useMemo } from 'react'
import styled from 'styled-components'
import { Text, CardBody, CardFooter, Button, LinkExternal } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { PoolAppBody } from '../../components/App'
import Page from '../Page'
import { SwapPoolTabs } from '../Swap/components/SwapPoolTabs'
import { AutoColumn } from '../../components/Layout/Column'
import { RowBetween } from '../../components/Layout/Row'
import { TotalValueLocked } from 'components/TotalValueLocked'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.normalCard};
`

const ExternalLink = styled(LinkExternal)`
  color: ${({ theme }) => theme.colors.text};

  svg {
    fill: ${({ theme }) => theme.colors.text};
  }
`

const StyledHeading = styled.h1`
  font-family: Jost;
  font-style: normal;
  font-weight: 900;
  font-size: 56px;
  line-height: 72px;
  text-align: center;
  width: 100%;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ disabled }) => disabled && '0.4'};
`

const CardNoise = styled.span`
  background: url('/noise.png');
  background-size: cover;
  mix-blend-mode: overlay;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
`

const DataCard = styled(AutoColumn)<{ disabled?: boolean }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #2172e5 100%);
  border-radius: 12px;
  width: 100%;
  position: relative;
  overflow: hidden;
`

const VoteCard = styled(DataCard)`
  max-width: 840px;
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #f3c914 0%, #151515 100%);
  overflow: hidden;
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <StyledHeading style={{ marginBottom: 35 }}>Swap your Tokens</StyledHeading>
      <TotalValueLocked />
      <VoteCard>
        <CardNoise />
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <Text fontWeight={600}>Liquidity provider rewards</Text>
            </RowBetween>
            <RowBetween>
              <Text fontSize="14px">
                {`Liquidity providers earn a 0.2% fee on all trades proportional to their share of the pool. Fees are
                added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`}
              </Text>
            </RowBetween>
            <ExternalLink style={{ color: 'white', textDecoration: 'underline' }} target="_blank" href="">
              <Text fontSize="14px">Read more about providing liquidity</Text>
            </ExternalLink>
          </AutoColumn>
        </CardSection>

        <CardNoise />
      </VoteCard>
      <PoolAppBody>
        {/* <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} /> */}
        <Body>
          <AutoColumn gap="7px" style={{ padding: '0 16px' }}>
            <SwapPoolTabs active="pool" />
          </AutoColumn>
          {renderBody()}
        </Body>
        <CardFooter id="poolfooter" style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/add" passHref>
            <Button id="join-pool-button" width="48%">
              {t('Add Liquidity')}
            </Button>
          </Link>
          <Link href="/find" passHref>
            <Button disabled={!(account && !v2IsLoading)} id="import-pool-link" width="48%">
              {t('Import other LP tokens')}
            </Button>
          </Link>
        </CardFooter>
      </PoolAppBody>
    </Page>
  )
}
