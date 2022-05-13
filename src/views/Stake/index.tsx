import { JSBI, TokenAmount } from '@intercroneswap/v2-sdk'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { orderBy } from 'lodash'
import { KeyboardEvent, RefObject, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { isAddress } from 'utils'
import { Text, Button, useModal } from '@pancakeswap/uikit'
import styled, { ThemeContext } from 'styled-components'
import { LightGreyCard, LightCard } from '../../components/Card'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import tokens, { getTokensFromDefaults } from 'config/constants/tokens'
import PoolCard from '../../components/earn/PoolCard'
import { ResponsiveSizedTextMedium } from '../../components/earn/styleds'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import { SearchInput } from '../../components/SearchModal/styleds'
import { Dots } from '../../components/swap/styleds'
import Page from '../Page'
import { StakingInfo, useStakeActionHandlers, useStakingInfo } from '../../state/stake/hooks'
import HarvestModal from './HarvestModal'
import StakeModal from './StakeModal'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import { WordBreakDiv, PageWrapper, ReferalButton, TitleRow } from './styleds'
import { REWARDS_DURATION_DAYS, REWARDS_DURATION_DAYS_180, StakingRewardsInfo } from '../../state/stake/constants'
import { Form } from 'react-bootstrap'
import { breakpointMap } from '../../../packages/uikit/src/theme/base'

const ZERO = JSBI.BigInt(0)
const { icr: ICR, busd: BUSD } = tokens

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

export default function Stake() {
  const router = useRouter()
  const theme = useContext(ThemeContext)
  const isMobile = window.innerWidth <= breakpointMap.md
  const { account, chainId } = useWeb3React()
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

  const referalArr = router.query.referal || []
  let referal = undefined
  if (referalArr.length == 1) {
    referal = referalArr[0]
    if (!isAddress(referal)) router.push('/stake')
  } else if (referalArr.length) router.push('/stake')

  const stakingInfos = useStakingInfo(stakingRewardInfos)

  const [stakeAddress, setStakeAddress] = useState<string>('')
  const [toggleSearch, setToggleSearch] = useState(false)
  const [uplinkAddress, setUplinkAddress] = useState<string | undefined>(undefined)
  const [stakeInfo, setStakeInfo] = useState<StakingInfo | undefined>(undefined)
  const [lpBalance, setLPBalance] = useState<TokenAmount | undefined>(undefined)
  const [toggleToken, setToggleToken] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortOption, setSortOption] = useState('latest')
  const [showReferal, setShowReferal] = useState<boolean>(false)
  const [isActive, setActive] = useState<boolean>(true)
  const [isStakedOnly, setStakedOnly] = useState<boolean>(false)
  const [isLegacy, setLegacy] = useState<boolean>(false)
  const { onUserInput } = useStakeActionHandlers()

  const bindSortSelect = (event: any) => {
    setSortOption(event.target.value)
  }

  const onStakedOnlyAction = () => {
    setStakedOnly(!isStakedOnly)
  }

  const onLegacyAction = () => {
    setLegacy(!isLegacy)
  }

  const onSwitchAction = () => {
    setActive(!isActive)
  }

  const handleHarvest = (address: string) => {
    onPresentHarvestModal()
    setStakeAddress(address)
  }

  const handleDismissHarvest = () => {
    setStakeAddress('')
  }
  const inputRef = useRef<HTMLInputElement>()

  const handleStake = (address: string, pairSupply?: TokenAmount, stakingInfo?: StakingInfo) => {
    onPresentStakeModal()
    setStakeAddress(address)
    setStakeInfo(stakingInfo)
    setLPBalance(pairSupply)
  }

  const handleDismissStake = useCallback(() => {
    setStakeAddress('')
    setStakeInfo(undefined)
    setLPBalance(undefined)
    onUserInput('')
  }, [stakeAddress])

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value
      setSearchQuery(input.toLowerCase())
    },
    [searchQuery],
  )

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        setSearchQuery(s)
      }
    },
    [searchQuery],
  )

  const confirmUpline = useCallback(() => {
    return account ? (
      <>
        <Text fontSize="12px" fontWeight={600}>
          Your upline
        </Text>
        {uplinkAddress ? (
          <Text>{uplinkAddress}</Text>
        ) : (
          <>
            <WordBreakDiv>Confirm your upline {referal}</WordBreakDiv>
            <Button width="10rem" onClick={() => setUplinkAddress(referal ?? account)}>
              <Text>Confirm</Text>
            </Button>
          </>
        )}
      </>
    ) : undefined
  }, [referal, uplinkAddress, account])

  const uplineComponent = useCallback(() => {
    return account ? (
      <AutoColumn
        justify="center"
        gap="3px"
        style={{
          display: showReferal ? 'grid' : 'none',
          background: theme.colors.background,
          borderRadius: '2rem',
          padding: '0.5rem',
          margin: '0',
        }}
      >
        {referal ? confirmUpline() : undefined}
        <ResponsiveSizedTextMedium>Your referral link</ResponsiveSizedTextMedium>
        <WordBreakDiv>{`${window.location.origin}/stake/${account}`}</WordBreakDiv>
      </AutoColumn>
    ) : undefined
  }, [uplinkAddress, showReferal])

  const activePools = stakingInfos.filter((info) => info.active)
  const inactivePools = stakingInfos.filter((info) => !info.active)
  const stakedOnlyPools = activePools.filter(
    (info) => info.stakedAmount && JSBI.greaterThan(info.stakedAmount.numerator, ZERO),
  )
  const stakedInactivePools = inactivePools.filter(
    (info) => info.stakedAmount && JSBI.greaterThan(info.stakedAmount.numerator, ZERO),
  )

  const stakingList = useCallback(
    (poolsToDisplay: StakingInfo[]): StakingInfo[] => {
      if (searchQuery) {
        if (!toggleSearch) {
          return poolsToDisplay.filter((info: StakingInfo) => {
            return (
              info.tokens[0].symbol?.toLowerCase().includes(searchQuery) ||
              info.tokens[0].name?.toLowerCase().includes(searchQuery) ||
              info.tokens[1].symbol?.toLowerCase().includes(searchQuery) ||
              info.tokens[1].name?.toLowerCase().includes(searchQuery)
            )
          })
        }
        return poolsToDisplay.filter((info: StakingInfo) => {
          return (
            info.earnedAmount.token.symbol?.toLowerCase().includes(searchQuery) ||
            info.earnedAmount.token.name?.toLowerCase().includes(searchQuery)
          )
        })
      }
      return poolsToDisplay
    },
    [searchQuery, isLegacy],
  )

  const chosenPoolsMemoized = useMemo(() => {
    let chosenPools: StakingInfo[] = []
    const sortPools = (infos: StakingInfo[]): StakingInfo[] => {
      switch (sortOption) {
        case 'liquidity':
          return orderBy(infos, (info) => (info.stakedAmount ? Number(info.stakedAmount.numerator) : 0), 'desc')
        case 'earned':
          return orderBy(infos, (info) => (info.earnedAmount ? Number(info.earnedAmount.numerator) : 0), 'desc')
        case 'latest':
          return orderBy(infos, (info) => (info.periodFinish?.getTime() ? info.periodFinish.getTime() : 0), 'desc')
        default:
          return infos
      }
    }
    chosenPools = stakingList(stakingInfos)
    if (isActive) {
      chosenPools = isStakedOnly ? stakingList(stakedOnlyPools) : stakingList(activePools)
    }
    if (!isActive) {
      chosenPools = isStakedOnly ? stakingList(stakedInactivePools) : stakingList(inactivePools)
    }
    if (isLegacy) {
      chosenPools = chosenPools.filter((info) => info.legacy)
    }
    if (!isLegacy) {
      chosenPools = chosenPools.filter((info) => !info.legacy)
    }
    console.log(chosenPools, isLegacy, 'chosenPools')

    return sortPools(chosenPools)
  }, [sortOption, stakingInfos, searchQuery, isActive, isStakedOnly, isLegacy])

  const StyledHeading = styled.h1`
    text-transform: uppercase;
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

  const [onPresentStakeModal] = useModal(
    <StakeModal
      stakingAddress={stakeAddress}
      stakingInfo={stakeInfo}
      onDismiss={handleDismissStake}
      balance={lpBalance}
      referalAddress={uplinkAddress}
    />,
    true,
    true,
    'StakeModal',
  )

  const [onPresentHarvestModal] = useModal(
    <HarvestModal stakingAddress={stakeAddress} stakingInfo={stakeInfo} onDismiss={handleDismissHarvest} />,
    true,
    true,
    'HarvestModal',
  )

  return (
    <Page>
      <StyledHeading>LP Staking</StyledHeading>
      <TitleRow style={{ marginTop: '1rem', textAlign: 'center' }} padding={'0'}>
        <Text width="100%" style={{ marginTop: '0.5rem', justifySelf: 'center', color: theme.colors.text }}>
          Stake Liquidity Pool (LP) tokens to earn
        </Text>
      </TitleRow>
      <PageWrapper style={{ marginTop: 30 }}>
        <RowBetween marginTop="1rem">
          {isMobile ? (
            <Button
              width="45%"
              onClick={() => setToggleToken(!toggleToken)}
              style={{ zIndex: '2', background: theme.colors.background, border: `1px solid ${theme.colors.primary}` }}
            >
              <ResponsiveSizedTextMedium>Token Value</ResponsiveSizedTextMedium>
              <CurrencyLogo currency={toggleToken ? ICR : BUSD} size={'28px'} style={{ marginLeft: '1rem' }} />
            </Button>
          ) : (
            <div />
          )}
          <ReferalButton
            height="3rem"
            margin="0"
            onClick={() => setShowReferal(!showReferal)}
            style={{
              width: isMobile ? '45%' : '16rem',
              justifySelf: 'flex-end',
            }}
          >
            Show referal link
          </ReferalButton>
        </RowBetween>
        <LightCard style={{ marginTop: '20px' }} padding="1rem 1rem">
          {!account ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ConnectWalletButton width="100%" maxWidth={300} />
            </div>
          ) : (
            <AutoRow gap={'20px'} style={{ margin: 0 }} justify="space-between" />
          )}
          <AutoColumn gap="1rem" justify="center">
            <AutoColumn gap="1rem" style={{ width: '100%' }}>
              {uplineComponent()}
              {isMobile ? (
                <RowBetween>
                  <Form.Switch
                    label="Active"
                    id="active-staking"
                    onChange={onSwitchAction}
                    defaultChecked={true}
                    style={{ color: theme.colors.text }}
                  />
                  <Form.Switch
                    label="Legacy"
                    id="legacy"
                    onChange={onLegacyAction}
                    defaultChecked={false}
                    style={{ color: theme.colors.text }}
                  />
                  <Form.Switch
                    label="Staked only"
                    id="staked-only"
                    onChange={onStakedOnlyAction}
                    defaultChecked={false}
                    style={{ color: theme.colors.text }}
                  />
                </RowBetween>
              ) : undefined}
              <RowBetween style={{ marginBottom: isMobile ? '-1rem' : '-1.5rem' }}>
                <AutoRow gap=".3rem" width={isMobile ? '55%' : '20%'}>
                  <Text
                    onClick={() => setToggleSearch(false)}
                    color={!toggleSearch ? theme.colors.primary : theme.colors.text}
                    style={{ textDecorationLine: 'underline', cursor: 'pointer' }}
                  >
                    LP token
                  </Text>
                  <Text
                    onClick={() => setToggleSearch(false)}
                    color={toggleSearch ? theme.colors.primary : theme.colors.text}
                    style={{ textDecorationLine: 'underline', cursor: 'pointer' }}
                  >
                    Earn token
                  </Text>
                </AutoRow>
                {!isMobile && (
                  <AutoRow justify="center">
                    <Button
                      width="15rem"
                      onClick={() => setToggleToken(!toggleToken)}
                      style={{
                        zIndex: '5',
                        background: theme.colors.backgroundAlt,
                        border: `1px solid ${theme.colors.primary}`,
                      }}
                    >
                      <ResponsiveSizedTextMedium>Token Value</ResponsiveSizedTextMedium>
                      <CurrencyLogo currency={toggleToken ? BUSD : ICR} size={'28px'} style={{ marginLeft: '1rem' }} />
                    </Button>
                  </AutoRow>
                )}
                <AutoRow style={{ width: isMobile ? '35%' : '15%' }}>
                  <Text textAlign="start">Sort by</Text>
                </AutoRow>
              </RowBetween>
              <RowBetween>
                <SearchInput
                  type="text"
                  id="token-search-input"
                  placeholder="Search name"
                  value={searchQuery}
                  ref={inputRef as RefObject<HTMLInputElement>}
                  onChange={handleInput}
                  onKeyDown={handleEnter}
                  style={{
                    fontSize: '.9rem',
                    background: theme.colors.backgroundAlt2,
                    width: isMobile ? '60%' : '194px',
                  }}
                />
                <AutoRow gap="2rem" justify="flex-end">
                  {!isMobile ? (
                    <>
                      <Form.Switch
                        label="Active"
                        id="active-staking"
                        onChange={onSwitchAction}
                        defaultChecked={true}
                        style={{ color: theme.colors.text }}
                      />
                      <Form.Switch
                        label="Legacy"
                        id="legacy"
                        onChange={onLegacyAction}
                        defaultChecked={false}
                        style={{ color: theme.colors.text }}
                      />
                      <Form.Switch
                        label="Staked only"
                        id="staked-only"
                        onChange={onStakedOnlyAction}
                        defaultChecked={false}
                        style={{ color: theme.colors.text }}
                      />
                    </>
                  ) : undefined}
                  <Form.Select
                    style={{
                      color: theme.colors.textSubtle,
                      background: theme.colors.backgroundAlt2,
                      border: 'none',
                      width: isMobile ? '50%' : '165px',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                    }}
                    onChange={bindSortSelect}
                    value={sortOption}
                  >
                    <option value={'latest'}>Latest</option>
                    <option value={'liquidity'}>Liquidity</option>
                    <option value={'earned'}>Earned</option>
                    <option value={'apy'}>APY</option>
                  </Form.Select>
                </AutoRow>
              </RowBetween>
              {!account ? (
                <LightGreyCard padding="1rem">
                  <Text color={theme.colors.text} textAlign="left">
                    Connect to a wallet to view your liquidity.
                  </Text>
                </LightGreyCard>
              ) : stakingInfos.length === 0 ? (
                <LightGreyCard padding="1rem">
                  <Text color={theme.colors.text} textAlign="left">
                    <Dots>Loading</Dots>
                  </Text>
                </LightGreyCard>
              ) : chosenPoolsMemoized?.length > 0 ? (
                <>
                  {chosenPoolsMemoized.map((stakingInfo) => (
                    <PoolCard
                      key={stakingInfo.stakingRewardAddress}
                      stakingInfo={stakingInfo}
                      address={stakingInfo.stakingRewardAddress}
                      handleStake={handleStake}
                      handleHarvest={handleHarvest}
                      toggleToken={toggleToken}
                    ></PoolCard>
                  ))}
                </>
              ) : (
                <LightGreyCard style={{ padding: '12px' }}>
                  <Text color={theme.colors.text} textAlign="left">
                    No liquidity found.
                  </Text>
                </LightGreyCard>
              )}
            </AutoColumn>
          </AutoColumn>
        </LightCard>
      </PageWrapper>
    </Page>
  )
}
