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
import { DoubleCurrencyLogo } from 'components/Logo'
import tokens, { getTokensFromDefaults } from 'config/constants/tokens'
import PoolCard from '../../components/earn/PoolCard'
import { ResponsiveSizedTextMedium } from '../../components/earn/styleds'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import { SearchInput } from '../../components/SearchModal/styleds'
import { Dots } from '../../components/swap/styleds'
import Page from '../Page'
import { StakingInfo, useStakeActionHandlers, useStakingInfo } from '../../state/stake/hooks'
import { Divider } from '../../theme'
import HarvestModal from './HarvestModal'
import StakeModal from './StakeModal'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import { WordBreakDiv, PageWrapper, ReferalButton, TitleRow } from './styleds'
import { REWARDS_DURATION_DAYS, REWARDS_DURATION_DAYS_180, StakingRewardsInfo } from '../../state/stake/constants';
import { Form } from 'react-bootstrap'

const ZERO = JSBI.BigInt(0);
const { icr: ICR, busd : BUSD } = tokens

let stakingInfosRaw: {
  [chainId: number]: {
    [version: string]: {
      [tokens: string]: string;
    };
  };
} = {};
fetch('https://raw.githubusercontent.com/InterCroneworldOrg/token-lists/main/staking-addresses.json')
  .then((response) => response.json())
  .then((data) => (stakingInfosRaw = data));

export default function Stake() {
  const router = useRouter()
  const theme = useContext(ThemeContext)
  const { account, chainId } = useWeb3React()
  const stakingRewardInfos: StakingRewardsInfo[] = useMemo(() => {
    const tmpinfos: StakingRewardsInfo[] = [];
    stakingInfosRaw && chainId && stakingInfosRaw[chainId]
      ? Object.keys(stakingInfosRaw[chainId]).map((version) => {
          const vals = stakingInfosRaw[chainId][version];
          Object.keys(vals).map((tokens) => {
            const tokensFromDefault = getTokensFromDefaults(tokens);
            if (tokensFromDefault) {
              tmpinfos.push({
                stakingRewardAddress: vals[tokens],
                tokens: tokensFromDefault,
                rewardsDays: version !== 'v0' ? REWARDS_DURATION_DAYS_180 : REWARDS_DURATION_DAYS,
              });
            }
          });
        })
      : undefined;
    return tmpinfos;
  }, [chainId, stakingInfosRaw]);

  const referalArr = router.query.referal || []
  let referal = undefined;
  if( referalArr.length == 1 ) {
    referal = referalArr[0]
    if( !isAddress(referal))
      router.push('/stake')
  }
  else if( referalArr.length )
    router.push('/stake');

  const stakingInfos = useStakingInfo(stakingRewardInfos)

  const [stakeAddress, setStakeAddress] = useState<string>('')
  const [uplinkAddress, setUplinkAddress] = useState<string | undefined>(undefined)
  const [stakeInfo, setStakeInfo] = useState<StakingInfo | undefined>(undefined)
  const [lpBalance, setLPBalance] = useState<TokenAmount | undefined>(undefined)
  const [toggleToken, setToggleToken] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortOption, setSortOption] = useState('latest')
  const [showReferal, setShowReferal] = useState<boolean>(false)
  const [isActive, setActive] = useState<boolean>(true);
  const [isStakedOnly, setStakedOnly] = useState<boolean>(false);
  const { onUserInput } = useStakeActionHandlers()

  const bindSortSelect = (event: any) => {
    setSortOption(event.target.value);
  };

  const onStakedOnlyAction = () => {
    setStakedOnly(!isStakedOnly);
  };

  const onSwitchAction = () => {
    setActive(!isActive);
  };

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

  const handleInput = useCallback((event) => {
    const input = event.target.value
    setSearchQuery(input.toLowerCase())
  }, [searchQuery])

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
  }, [referal, uplinkAddress, account]);

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
        <ResponsiveSizedTextMedium fontWeight=".5rem">Your referral link</ResponsiveSizedTextMedium>
        <WordBreakDiv>{`${window.location.origin}/stake/${account}`}</WordBreakDiv>
      </AutoColumn>
    ) : undefined
  }, [uplinkAddress, showReferal])

  // Filtering and sorting pools
  const activePools = stakingInfos.filter((info) => info.active);
  const inactivePools = stakingInfos.filter((info) => !info.active);
  const stakedOnlyPools = activePools.filter(
    (info) => info.stakedAmount && JSBI.greaterThan(info.stakedAmount.numerator, ZERO),
  );
  const stakedInactivePools = inactivePools.filter(
    (info) => info.stakedAmount && JSBI.greaterThan(info.stakedAmount.numerator, ZERO),
  );

  const stakingList = useCallback(
    (poolsToDisplay: StakingInfo[]): StakingInfo[] => {
      if (searchQuery) {
        return poolsToDisplay.filter((info: StakingInfo) => {
          return (
            info.tokens[0].symbol?.toLowerCase().includes(searchQuery) ||
            info.tokens[0].name?.toLowerCase().includes(searchQuery) ||
            info.tokens[1].symbol?.toLowerCase().includes(searchQuery) ||
            info.tokens[1].name?.toLowerCase().includes(searchQuery)
          )
        })
      }
      return poolsToDisplay
    },
    [searchQuery],
  )

  const chosenPoolsMemoized = useMemo(() => {
    let chosenPools = []
    const sortPools = (infos: StakingInfo[]): StakingInfo[] => {
      switch (sortOption) {
        case 'liquidity':
          return orderBy(infos, (info) => (info.stakedAmount ? Number(info.stakedAmount.numerator) : 0), 'desc');
        case 'earned':
          return orderBy(infos, (info) => (info.earnedAmount ? Number(info.earnedAmount.numerator) : 0), 'desc')
        case 'latest':
          return orderBy(infos, (info) => (info.periodFinish?.getTime() ? info.periodFinish.getTime() : 0), 'desc')
        default:
          return infos
      }
    }
    chosenPools = stakingList(stakingInfos);
    if (isActive) {
      chosenPools = isStakedOnly ? stakingList(stakedOnlyPools) : stakingList(activePools);
    }
    if (!isActive) {
      chosenPools = isStakedOnly ? stakingList(stakedInactivePools) : stakingList(inactivePools);
    }
    return sortPools(chosenPools)
  }, [sortOption, stakingInfos, searchQuery, isActive, isStakedOnly])

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
    <HarvestModal
      stakingAddress={stakeAddress}
      stakingInfo={stakeInfo}
      onDismiss={handleDismissHarvest}
    />,
    true,
    true,
    'HarvestModal',
  )

  return (
    <Page>
      <StyledHeading>LP Staking</StyledHeading>
      <PageWrapper style={{marginTop: 30}}>
        <AutoRow justify="center">
          <Button variant="secondary" width="15rem" onClick={() => setToggleToken(!toggleToken)}>
            <ResponsiveSizedTextMedium>Token Value</ResponsiveSizedTextMedium>
            <DoubleCurrencyLogo currency0={BUSD} currency1={ICR} size={28} />
          </Button>
        </AutoRow>
        <LightCard style={{ marginTop: '20px' }} padding="2rem 1rem">
          {!account ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ConnectWalletButton width="100%" maxWidth={300} />
            </div>
          ) : (
            <AutoRow gap={'20px'} style={{ margin: 0 }} justify="space-between" />
          )}
          <AutoColumn gap="1.5rem" justify="center">
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: 20 }}>
              <ReferalButton
                width="11rem"
                height="48px"
                marginBottom="-4rem"
                justifySelf="end"
                onClick={() => setShowReferal(!showReferal)}
              >
                Show referal link
              </ReferalButton>
            </div>
		
            <AutoColumn gap="2rem" style={{ width: '100%' }}>
              <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
                <Text fontSize="1.2rem">
                <Text>Stake Liquidity Pool (LP) tokens to earn</Text>
                </Text>
              </TitleRow>
              <Divider />
              {uplineComponent()}
              {/* TODO: when finished enable display */}
              <RowBetween>
                <AutoColumn justify="flex-start" gap="1rem">
                  <Form.Switch 
                    label="Active"
                    id="active-staking"
                    onChange={onSwitchAction}
                    defaultChecked={true}
                    style={{ color: theme.colors.text }}
                  />
                  <Text fontSize="1rem">Search</Text>
                  <SearchInput
                    type="text"
                    id="token-search-input"
                    placeholder="Filter by token name"
                    value={searchQuery}
                    ref={inputRef as RefObject<HTMLInputElement>}
                    onChange={handleInput}
                    onKeyDown={handleEnter}
                    width="1rem"
                    style={{ fontSize: '1rem' }}
                  />
                </AutoColumn>
                <AutoColumn gap="3px">
                  <Form.Switch
                    label="Staked only"
                    id="staked-only"
                    onChange={onStakedOnlyAction}
                    defaultChecked={false}
                    style={{ color: theme.colors.text }}
                  />
                  <Text>Sort by</Text>
                  <Form.Select
                    style={{ color: theme.colors.text, background: theme.colors.background, borderColor: theme.colors.gold, borderRadius: ".7rem"}}
                    onChange={bindSortSelect}
                    value={sortOption}
                  >
                    <option value={'latest'}>Latest</option>
                    <option value={'liquidity'}>Liquidity</option>
                    <option value={'earned'}>Earned</option>
                    <option value={'apy'}>APY</option>
                  </Form.Select>
                </AutoColumn>
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
