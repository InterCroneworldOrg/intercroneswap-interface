import { REWARDS_DURATION_DAYS, REWARDS_DURATION_DAYS_180, StakingRewardsInfo } from '../../state/stake/constants';
import { ethAddress } from '@intercroneswap/java-tron-provider';
import { TokenAmount } from '@intercroneswap/v2-sdk';
import { orderBy } from 'lodash';
import { KeyboardEvent, RefObject, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import { ThemeContext } from 'styled-components';

import CopyHelper from '../../components/AccountDetails/Copy';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { GreyCard, LightCard } from '../../components/Card';
import { AutoColumn } from '../../components/Column';
import PoolCard from '../../components/earn/PoolCard';
import { ResponsiveSizedTextMedium } from '../../components/earn/styleds';
import { AutoRow, RowBetween } from '../../components/Row';
import { SearchInput } from '../../components/SearchModal/styleds';
import { Dots } from '../../components/swap/styleds';
import { USDT, getTokensFromDefaults, ICR } from '../../constants/tokens';
import { useActiveWeb3React } from '../../hooks';
import { useWalletModalToggle } from '../../state/application/hooks';
import { StakingInfo, useStakeActionHandlers, useStakingInfo } from '../../state/stake/hooks';
import { Button, Divider, TYPE } from '../../theme';
import { StyledHeading } from '../App';
import HarvestModal from './HarvestModal';
import StakeModal from './StakeModal';
import { WordBreakDiv, PageWrapper, ReferalButton, TitleRow } from './styleds';
import CurrencyLogo from '../../components/CurrencyLogo';

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

export default function Stake({
  match: {
    params: { referal },
  },
}: RouteComponentProps<{ referal?: string }>) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const { account, chainId } = useActiveWeb3React();
  const stakingRewardInfos: StakingRewardsInfo[] = useMemo(() => {
    const tmpinfos: StakingRewardsInfo[] = [];
    stakingInfosRaw && chainId
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

  const stakingInfos = useStakingInfo(stakingRewardInfos);

  const [stakeAddress, setStakeAddress] = useState<string>('');
  const [uplinkAddress, setUplinkAddress] = useState<string | undefined>(undefined);
  const [stakeInfo, setStakeInfo] = useState<StakingInfo | undefined>(undefined);
  const [lpBalance, setLPBalance] = useState<TokenAmount | undefined>(undefined);
  const [toggleToken, setToggleToken] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState('latest');
  const [showStake, setShowStake] = useState<boolean>(false);
  const [showReferal, setShowReferal] = useState<boolean>(false);
  const [showHarvest, setShowHarvest] = useState<boolean>(false);
  const { onUserInput } = useStakeActionHandlers();

  const toggleWalletModal = useWalletModalToggle();

  const handleHarvest = (address: string) => {
    setStakeAddress(address);
    setShowHarvest(true);
  };

  const handleDismissHarvest = () => {
    setStakeAddress('');
    setShowHarvest(false);
  };
  const inputRef = useRef<HTMLInputElement>();

  const handleStake = (address: string, pairSupply?: TokenAmount, stakingInfo?: StakingInfo) => {
    setShowStake(true);
    setStakeAddress(address);
    setStakeInfo(stakingInfo);
    setLPBalance(pairSupply);
  };

  const handleDismissStake = useCallback(() => {
    setShowStake(false);
    setStakeAddress('');
    setStakeInfo(undefined);
    setLPBalance(undefined);
    onUserInput('');
  }, [stakeAddress, showStake]);

  const handleInput = useCallback((event) => {
    const input = event.target.value;
    setSearchQuery(input.toLowerCase());
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim();
        setSearchQuery(s);
      }
    },
    [searchQuery],
  );

  const confirmUpline = useCallback(() => {
    return account ? (
      <>
        <TYPE.white fontSize={18} fontWeight={600}>
          Your upline
        </TYPE.white>
        {uplinkAddress ? (
          <TYPE.white>{uplinkAddress}</TYPE.white>
        ) : (
          <>
            <WordBreakDiv>Confirm your upline {referal}</WordBreakDiv>
            <ButtonPrimary width="10rem" onClick={() => setUplinkAddress(referal ?? ethAddress.toTron(account))}>
              <TYPE.white>Confirm</TYPE.white>
            </ButtonPrimary>
          </>
        )}
      </>
    ) : undefined;
  }, [referal, uplinkAddress]);

  const uplineComponent = useCallback(() => {
    return account ? (
      <AutoColumn
        justify="center"
        gap="3px"
        style={{
          display: showReferal ? 'grid' : 'none',
          background: theme.bg3,
          borderRadius: '2rem',
          padding: '0.5rem',
          margin: '0',
        }}
      >
        {referal ? confirmUpline() : undefined}
        <ResponsiveSizedTextMedium fontWeight=".5rem">Your referral link</ResponsiveSizedTextMedium>
        <WordBreakDiv>{`${window.location.origin}/#/stake/${ethAddress.toTron(account)}`}</WordBreakDiv>
        <CopyHelper toCopy={`${window.location.origin}/#/stake/${ethAddress.toTron(account)}`}>Copy Address</CopyHelper>
      </AutoColumn>
    ) : undefined;
  }, [uplinkAddress, showReferal]);

  // Filtering and sorting pools
  // TODO: when we have active/ inactive toggle
  // const activePools = stakingInfos.filter((info) => info.active);
  // const inactivePools = stakingInfos.filter((info) => !info.active);
  // const stakedOnlyPools = activePools.filter(
  //   (info) => info.stakedAmount && JSBI.greaterThan(info.stakedAmount.numerator, ZERO),
  // );
  // const stakedInactivePools = inactivePools.filter(
  //   (info) => info.stakedAmount && JSBI.greaterThan(info.stakedAmount.numerator, ZERO),
  // );

  const stakingList = useCallback(
    (poolsToDisplay: StakingInfo[]): StakingInfo[] => {
      if (searchQuery) {
        return poolsToDisplay.filter((info: StakingInfo) => {
          return (
            info.tokens[0].symbol?.toLowerCase().includes(searchQuery) ||
            info.tokens[0].name?.toLowerCase().includes(searchQuery) ||
            info.tokens[1].symbol?.toLowerCase().includes(searchQuery) ||
            info.tokens[1].name?.toLowerCase().includes(searchQuery)
          );
        });
      }
      return poolsToDisplay;
    },
    [searchQuery],
  );

  const chosenPoolsMemoized = useMemo(() => {
    let chosenPools = [];
    const sortPools = (infos: StakingInfo[]): StakingInfo[] => {
      switch (sortOption) {
        case 'earned':
          return orderBy(infos, (info) => (info.earnedAmount ? Number(info.earnedAmount.numerator) : 0), 'desc');
        case 'latest':
          return orderBy(infos, (info) => (info.periodFinish?.getTime() ? info.periodFinish.getTime() : 0), 'desc');
        default:
          return infos;
      }
    };
    chosenPools = stakingList(stakingInfos);
    // if (isActive) {
    //   chosenPools = farmsList(activeFarms)
    // }
    // if (isInactive) {
    //   chosenPools = farmsList(inactiveFarms)
    // }
    return sortPools(chosenPools);
  }, [sortOption, stakingInfos, searchQuery]);

  return (
    <>
      <StyledHeading>LP Staking</StyledHeading>
      <PageWrapper>
        <StakeModal
          isOpen={showStake}
          stakingAddress={stakeAddress}
          stakingInfo={stakeInfo}
          onDismiss={handleDismissStake}
          balance={lpBalance}
          referalAddress={uplinkAddress}
        />
        <HarvestModal
          isOpen={showHarvest}
          stakingAddress={stakeAddress}
          stakingInfo={stakeInfo}
          onDismiss={handleDismissHarvest}
        />
        <AutoRow justify="center">
          <ButtonSecondary width="15rem" onClick={() => setToggleToken(!toggleToken)}>
            <ResponsiveSizedTextMedium>Token Value</ResponsiveSizedTextMedium>
            <CurrencyLogo currency={toggleToken ? ICR : USDT} />
          </ButtonSecondary>
        </AutoRow>
        <LightCard style={{ marginTop: '20px' }} padding="2rem 1rem">
          {!account ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ maxWidth: '260px' }} onClick={toggleWalletModal}>
                Connect Wallet
              </Button>
            </div>
          ) : (
            <AutoRow gap={'20px'} style={{ margin: 0 }} justify="space-between"></AutoRow>
          )}
          <AutoColumn gap="1.5rem" justify="center">
            <ReferalButton
              width="11rem"
              height="2rem"
              marginBottom="-4rem"
              justifySelf="end"
              onClick={() => setShowReferal(!showReferal)}
            >
              Show referal link
            </ReferalButton>
            <AutoColumn gap="2rem" style={{ width: '100%' }}>
              <TitleRow style={{ marginTop: '1rem' }} textAlign="center" padding={'0'}>
                <TYPE.mediumHeader width="100%" style={{ marginTop: '0.5rem', justifySelf: 'center' }}>
                  Stake Liquidity Pool (LP) tokens to earn
                </TYPE.mediumHeader>
              </TitleRow>
              <Divider />
              {uplineComponent()}
              {/* TODO: when finished enable display */}
              <RowBetween>
                <AutoColumn justify="flex-start" gap="1rem">
                  <TYPE.white fontSize="1rem">Search</TYPE.white>
                  <SearchInput
                    type="text"
                    id="token-search-input"
                    placeholder={t('tokenSearchPlaceholder')}
                    value={searchQuery}
                    ref={inputRef as RefObject<HTMLInputElement>}
                    onChange={handleInput}
                    onKeyDown={handleEnter}
                    width="1rem"
                    style={{ fontSize: '1rem' }}
                  />
                </AutoColumn>
                <AutoColumn gap="3px">
                  <TYPE.white>Sort by</TYPE.white>
                  <ButtonSecondary
                    onClick={() => (sortOption === 'earned' ? setSortOption('latest') : setSortOption('earned'))}
                  >
                    {sortOption}
                  </ButtonSecondary>
                </AutoColumn>
              </RowBetween>
              {!account ? (
                <GreyCard padding="1rem">
                  <TYPE.body color={theme.text1} textAlign="left">
                    Connect to a wallet to view your liquidity.
                  </TYPE.body>
                </GreyCard>
              ) : stakingInfos.length === 0 ? (
                <GreyCard padding="1rem">
                  <TYPE.body color={theme.text1} textAlign="left">
                    <Dots>Loading</Dots>
                  </TYPE.body>
                </GreyCard>
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
                <GreyCard style={{ padding: '12px' }}>
                  <TYPE.body color={theme.text1} textAlign="left">
                    No liquidity found.
                  </TYPE.body>
                </GreyCard>
              )}
            </AutoColumn>
          </AutoColumn>
        </LightCard>
      </PageWrapper>
    </>
  );
}
