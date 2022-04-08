import { TokenAmount } from '@intercroneswap/v2-sdk';
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { orderBy } from 'lodash';
import { KeyboardEvent, RefObject, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Text, Button, useModal } from '@pancakeswap/uikit'
import styled, { ThemeContext } from 'styled-components';
import { GreyCard, LightCard } from '../../components/Card';
import { AutoColumn } from 'components/Layout/Column';
// import DoubleCurrencyLogo from '../../components/DoubleLogo';
import PoolCard from '../../components/earn/PoolCard';
import { ResponsiveSizedTextMedium } from '../../components/earn/styleds';
import { AutoRow, RowBetween } from 'components/Layout/Row'
import { SearchInput } from '../../components/SearchModal/styleds';
import { Dots } from '../../components/swap/styleds';
// import { BUSD, ICR } from '../../constants/tokens';
import { StakingInfo, useStakeActionHandlers, useStakingInfo } from '../../state/stake/hooks';
import { Divider } from '../../theme';
import HarvestModal from './HarvestModal';
import StakeModal from './StakeModal';
import ConnectWalletButton from '../../components/ConnectWalletButton'

import { WordBreakDiv, PageWrapper, ReferalButton, TitleRow } from './styleds';

export default function Stake() {
  const router = useRouter()
  const { referal } = router.query
  console.log(router.query)
  const theme = useContext(ThemeContext);
  const { account } = useWeb3React()

  const stakingInfos = useStakingInfo();

  const [stakeAddress, setStakeAddress] = useState<string>('');
  const [uplinkAddress, setUplinkAddress] = useState<string | undefined>(undefined);
  const [stakeInfo, setStakeInfo] = useState<StakingInfo | undefined>(undefined);
  const [lpBalance, setLPBalance] = useState<TokenAmount | undefined>(undefined);
  const [toggleToken, setToggleToken] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState('latest');
  const [showReferal, setShowReferal] = useState<boolean>(false);
  const { onUserInput } = useStakeActionHandlers();

  const handleHarvest = (address: string) => {
    onPresentHarvestModal();
    setStakeAddress(address);
  };

  const handleDismissHarvest = () => {
    setStakeAddress('');
  };
  const inputRef = useRef<HTMLInputElement>();

  const handleStake = (address: string, pairSupply?: TokenAmount, stakingInfo?: StakingInfo) => {
    onPresentStakeModal();
    setStakeAddress(address);
    setStakeInfo(stakingInfo);
    setLPBalance(pairSupply);
  };

  const handleDismissStake = useCallback(() => {
    setStakeAddress('');
    setStakeInfo(undefined);
    setLPBalance(undefined);
    onUserInput('');
  }, [stakeAddress]);

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
        <Text fontSize="12px" fontWeight={600}>
          Your upline
        </Text>
        {uplinkAddress ? (
          <Text>{uplinkAddress}</Text>
        ) : (
          <>
            <WordBreakDiv>Confirm your upline {referal}</WordBreakDiv>
            <Button width="10rem" onClick={() => alert()}>
              <Text>Confirm</Text>
            </Button>
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
          background: theme.colors.background,
          borderRadius: '2rem',
          padding: '0.5rem',
          margin: '0',
        }}
      >
        {referal ? confirmUpline() : undefined}
        <ResponsiveSizedTextMedium fontWeight=".5rem">Your referral link</ResponsiveSizedTextMedium>
        <WordBreakDiv>{`${window.location.origin}/#/stake/${account}`}</WordBreakDiv>
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
  `;

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
    <>
      <StyledHeading>LP Staking</StyledHeading>
      <PageWrapper>
        <AutoRow justify="center">
          <Button width="15rem" onClick={() => setToggleToken(!toggleToken)}>
            <ResponsiveSizedTextMedium>Token Value</ResponsiveSizedTextMedium>
            {/* <DoubleCurrencyLogo currency0={BUSD} currency1={ICR} size={28} /> */}
          </Button>
        </AutoRow>
        <LightCard style={{ marginTop: '20px' }} padding="2rem 1rem">
          {!account ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ConnectWalletButton width="100%" />
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
              <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
                <Text>
                  Stake Liquidity Pool (LP) tokens to earn
                </Text>
              </TitleRow>
              <Divider />
              {uplineComponent()}
              {/* TODO: when finished enable display */}
              <RowBetween>
                <AutoColumn justify="flex-start" gap="1rem">
                  <Text fontSize="1rem">Search</Text>
                  <SearchInput
                    type="text"
                    id="token-search-input"
                    placeholder="tokenSearchPlaceholder"
                    value={searchQuery}
                    ref={inputRef as RefObject<HTMLInputElement>}
                    onChange={handleInput}
                    onKeyDown={handleEnter}
                    width="1rem"
                    style={{ fontSize: '1rem' }}
                  />
                </AutoColumn>
                <AutoColumn gap="3px">
                  <Text>Sort by</Text>
                  <Button
                    onClick={() => (sortOption === 'earned' ? setSortOption('latest') : setSortOption('earned'))}
                  >
                    {sortOption}
                  </Button>
                </AutoColumn>
              </RowBetween>
              {!account ? (
                <GreyCard padding="1rem">
                  <Text color={theme.colors.text} textAlign="left">
                    Connect to a wallet to view your liquidity.
                  </Text>
                </GreyCard>
              ) : stakingInfos.length === 0 ? (
                <GreyCard padding="1rem">
                  <Text color={theme.colors.text} textAlign="left">
                    <Dots>Loading</Dots>
                  </Text>
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
                  <Text color={theme.colors.text} textAlign="left">
                    No liquidity found.
                  </Text>
                </GreyCard>
              )}
            </AutoColumn>
          </AutoColumn>
        </LightCard>
      </PageWrapper>
    </>
  );
}