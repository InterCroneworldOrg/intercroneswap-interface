import { REWARDS_DURATION_DAYS, REWARDS_DURATION_DAYS_180, StakingRewardsInfo } from '../../state/stake/constants';
import { ethAddress } from '@intercroneswap/java-tron-provider';
import { JSBI, TokenAmount, ZERO } from '@intercroneswap/v2-sdk';
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
import { Button, Divider, MEDIA_WIDTHS, TYPE } from '../../theme';
import { StyledHeading } from '../App';
import HarvestModal from './HarvestModal';
import StakeModal from './StakeModal';
import { WordBreakDiv, PageWrapper, ReferalButton, TitleRow } from './styleds';
import CurrencyLogo from '../../components/CurrencyLogo';
import { Form } from 'react-bootstrap';

let stakingInfosRaw: {
  [chainId: number]: {
    [version: string]: {
      [tokens: string]: string;
    };
  };
} = {};
fetch(
  'https://raw.githubusercontent.com/InterCroneworldOrg/token-lists/revert-2-revert-1-gnagy-add-new-staking-addresses/staking-addresses.json',
)
  .then((response) => response.json())
  .then((data) => (stakingInfosRaw = data));

export default function Stake({
  match: {
    params: { referal },
  },
}: RouteComponentProps<{ referal?: string }>) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const isMobile = window.innerWidth <= MEDIA_WIDTHS.upToMedium;
  const { account, chainId } = useActiveWeb3React();
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
  const stakingInfos = useStakingInfo(stakingRewardInfos);

  const [stakeAddress, setStakeAddress] = useState<string>('');
  const [uplinkAddress, setUplinkAddress] = useState<string | undefined>(undefined);
  const [stakeInfo, setStakeInfo] = useState<StakingInfo | undefined>(undefined);
  const [lpBalance, setLPBalance] = useState<TokenAmount | undefined>(undefined);
  const [toggleToken, setToggleToken] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<'latest' | 'liquidity' | 'earned' | 'apy'>('latest');
  const [showStake, setShowStake] = useState<boolean>(false);
  const [showReferal, setShowReferal] = useState<boolean>(false);
  const [showHarvest, setShowHarvest] = useState<boolean>(false);
  const [isActive, setActive] = useState<boolean>(true);
  const [isStakedOnly, setStakedOnly] = useState<boolean>(false);
  const { onUserInput, onTxHashChange } = useStakeActionHandlers();

  const toggleWalletModal = useWalletModalToggle();

  const bindSortSelect = (event: any) => {
    console.log(event.target.value, 'Select event');
    setSortOption(event.target.value);
  };

  const onStakedOnlyAction = () => {
    setStakedOnly(!isStakedOnly);
  };

  const onSwitchAction = () => {
    setActive(!isActive);
  };

  const handleHarvest = (address: string) => {
    setStakeAddress(address);
    setShowHarvest(true);
  };

  const handleDismissHarvest = useCallback(() => {
    setStakeAddress('');
    setShowHarvest(false);
    onTxHashChange('');
  }, [stakeAddress, showHarvest]);
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
    onTxHashChange('');
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

  const activePools = stakingInfos.filter((info) => info.active && info.periodFinish);
  const inactivePools = stakingInfos.filter((info) => !info.active || (info.active && !info.periodFinish));
  const stakedOnlyPools = activePools.filter(
    (info) => info.stakedAmount && JSBI.greaterThan(info.stakedAmount.numerator, ZERO),
  );
  const stakedInactivePools = inactivePools.filter(
    (info) => info.stakedAmount && JSBI.greaterThan(info.stakedAmount.numerator, ZERO),
  );

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
            );
          });
        }
        return poolsToDisplay.filter((info: StakingInfo) => {
          return (
            info.earnedAmount.token.symbol?.toLowerCase().includes(searchQuery) ||
            info.earnedAmount.token.name?.toLowerCase().includes(searchQuery)
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
        case 'liquidity':
          return orderBy(infos, (info) => (info.stakedAmount ? Number(info.stakedAmount.numerator) : 0), 'desc');
        case 'earned':
          return orderBy(infos, (info) => (info.earnedAmount ? Number(info.earnedAmount.numerator) : 0), 'desc');
        case 'latest':
          return orderBy(infos, (info) => (info.periodFinish?.getTime() ? info.periodFinish.getTime() : 0), 'desc');
        default:
          return infos;
      }
    };
    chosenPools = stakingList(stakingInfos);
    if (isActive) {
      chosenPools = isStakedOnly ? stakingList(stakedOnlyPools) : stakingList(activePools);
    }
    if (!isActive) {
      chosenPools = isStakedOnly ? stakingList(stakedInactivePools) : stakingList(inactivePools);
    }
    return sortPools(chosenPools);
  }, [sortOption, stakingInfos, searchQuery, isActive, isStakedOnly]);

  return (
    <>
      <StyledHeading>LP Staking</StyledHeading>
      <TitleRow style={{ marginTop: '1rem' }} textAlign="center" padding={'0'}>
        <TYPE.mediumHeader width="100%" style={{ marginTop: '0.5rem', justifySelf: 'center', color: theme.text1 }}>
          Stake Liquidity Pool (LP) tokens to earn
        </TYPE.mediumHeader>
      </TitleRow>
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
              margin="0"
              padding=".5rem"
              justifySelf="end"
              onClick={() => setShowReferal(!showReferal)}
            >
              Show referal link
            </ReferalButton>
            <ButtonSecondary width="15rem" onClick={() => setToggleToken(!toggleToken)}>
              <ResponsiveSizedTextMedium>Token Value</ResponsiveSizedTextMedium>
              <CurrencyLogo currency={toggleToken ? ICR : USDT} style={{ marginLeft: '1rem' }} />
            </ButtonSecondary>
            <AutoColumn gap="1rem" style={{ width: '100%' }}>
              <Divider />
              {uplineComponent()}
              {isMobile ? (
                <RowBetween>
                  <Form.Switch
                    label="Active"
                    id="active-staking"
                    onChange={onSwitchAction}
                    defaultChecked={true}
                    style={{ color: theme.text1 }}
                  />
                  <Form.Switch
                    label="Staked only"
                    id="staked-only"
                    onChange={onStakedOnlyAction}
                    defaultChecked={false}
                    style={{ color: theme.text1 }}
                  />
                </RowBetween>
              ) : undefined}
              <RowBetween>
                <ButtonSecondary
                  width={isMobile ? '45%' : '13%'}
                  onClick={() => {
                    setToggleSearch(!toggleSearch);
                    setSearchQuery('');
                  }}
                >
                  <ResponsiveSizedTextMedium>
                    Search {toggleSearch ? 'Earn token' : 'LP Token'}
                  </ResponsiveSizedTextMedium>
                </ButtonSecondary>
                <TYPE.white>Sort by</TYPE.white>
              </RowBetween>
              <RowBetween>
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
                <AutoRow gap="2rem" justify="flex-end">
                  {!isMobile ? (
                    <>
                      <Form.Switch
                        label="Active"
                        id="active-staking"
                        onChange={onSwitchAction}
                        defaultChecked={true}
                        style={{ color: theme.text1 }}
                      />
                      <Form.Switch
                        label="Staked only"
                        id="staked-only"
                        onChange={onStakedOnlyAction}
                        defaultChecked={false}
                        style={{ color: theme.text1 }}
                      />
                    </>
                  ) : undefined}
                  <Form.Select
                    style={{
                      color: theme.text1,
                      background: theme.bg1,
                      borderColor: theme.primary3,
                      width: isMobile ? '45%' : '150px',
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
