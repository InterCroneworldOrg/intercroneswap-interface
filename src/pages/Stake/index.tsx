import { RefObject, useCallback, useContext, useRef, useState, KeyboardEvent } from 'react';
import styled, { ThemeContext } from 'styled-components';

// import { useUserHasLiquidityInAllTokens } from '../../data/V';
import { TYPE, Divider, Button } from '../../theme';
import { GreyCard, LightCard } from '../../components/Card';
import { AutoRow, RowBetween } from '../../components/Row';
import { AutoColumn } from '../../components/Column';
import { Text } from 'rebass';

import { useActiveWeb3React } from '../../hooks';
import { Dots } from '../../components/swap/styleds';
import { useWalletModalToggle } from '../../state/application/hooks';
import StakingPositionCard from '../../components/PositionCard/Stake';
import { StakingInfo, useStakeActionHandlers, useStakingBalancesWithLoadingIndicator } from '../../state/stake/hooks';
import StakeModal from './StakeModal';
import { StyledHeading } from '../App';
import { TokenAmount } from '@intercroneswap/v2-sdk';
import HarvestModal from './HarvestModal';
import { SearchInput } from '../../components/SearchModal/styleds';
import { useTranslation } from 'react-i18next';
import { ethAddress } from '@intercroneswap/java-tron-provider';
import CopyHelper from '../../components/AccountDetails/Copy';
import { RouteComponentProps } from 'react-router-dom';
import { ButtonPrimary } from '../../components/Button';

const PageWrapper = styled(AutoColumn)`
  max-width: 80%;
  width: 100%;
`;

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`;

const rewardsAddresses: string[] = [];

fetch('https://raw.githubusercontent.com/InterCroneworldOrg/token-lists/main/staking-addresses.json')
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    rewardsAddresses.push(...responseJson.addresses);
  })
  .catch((err) => console.error(err));

export default function Stake({
  match: {
    params: { referal },
  },
}: RouteComponentProps<{ referal?: string }>) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const { account } = useActiveWeb3React();

  const [stakingInfos, fetchingStakingInfos] = useStakingBalancesWithLoadingIndicator(
    rewardsAddresses,
    account ?? undefined,
  );

  const [stakeAddress, setStakeAddress] = useState<string>('');
  const [uplinkAddress, setUplinkAddress] = useState<string | undefined>(undefined);
  const [stakeInfo, setStakeInfo] = useState<StakingInfo | undefined>(undefined);
  const [lpBalance, setLPBalance] = useState<TokenAmount | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showStake, setShowStake] = useState<boolean>(false);
  const [showReferal, setShowReferal] = useState<boolean>(false);
  const [showHarvest, setShowHarvest] = useState<boolean>(false);
  const { onUserInput } = useStakeActionHandlers();

  const v1IsLoading = fetchingStakingInfos;

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

  const handleStake = (address: string, pairSupply?: TokenAmount) => {
    setShowStake(true);
    setStakeAddress(address);
    setStakeInfo(stakingInfos[address]);
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
    setSearchQuery(input);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim();
        console.log(s);
      }
    },
    [searchQuery],
  );

  const confirmUpline = useCallback(() => {
    return (
      <>
        <Text fontSize={18} fontWeight={600}>
          Your upline
        </Text>
        {uplinkAddress ? (
          <Text>{uplinkAddress}</Text>
        ) : (
          <>
            <Text>Confirm your upline {referal}</Text>
            <ButtonPrimary width="25%" onClick={() => setUplinkAddress(referal ?? ethAddress.toTron(account))}>
              <Text>Confirm</Text>
            </ButtonPrimary>
          </>
        )}
      </>
    );
  }, [referal, uplinkAddress]);

  const uplineComponent = useCallback(() => {
    return (
      <AutoColumn
        justify="center"
        gap="3px"
        style={{
          display: showReferal ? 'grid' : 'none',
          background: theme.bg3,
          borderRadius: '2rem',
          padding: '2rem',
          margin: '0 5rem',
        }}
      >
        {referal ? confirmUpline() : undefined}
        <Text fontSize={18} fontWeight={600}>
          Your referral link
        </Text>
        <Text>{`${window.location.origin}/#/stake/${ethAddress.toTron(account)}`}</Text>
        <CopyHelper toCopy={`${window.location.origin}/#/stake/${ethAddress.toTron(account)}`}>Copy Address</CopyHelper>
      </AutoColumn>
    );
  }, [uplinkAddress, showReferal]);

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
        <LightCard style={{ marginTop: '20px' }}>
          {!account ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ maxWidth: '260px' }} onClick={toggleWalletModal}>
                Connect Wallet
              </Button>
            </div>
          ) : (
            <AutoRow gap={'20px'} style={{ margin: 0 }} justify="space-between"></AutoRow>
          )}
          <AutoColumn gap="lg" justify="center">
            <ButtonPrimary
              width="20%"
              height="3rem"
              marginBottom="-3rem"
              justifySelf="end"
              onClick={() => setShowReferal(!showReferal)}
            >
              Show referal link
            </ButtonPrimary>
            <AutoColumn gap="lg" style={{ width: '100%' }}>
              <TitleRow style={{ marginTop: '1rem' }} textAlign="center" padding={'0'}>
                <TYPE.mediumHeader width="100%" style={{ marginTop: '0.5rem', justifySelf: 'center' }}>
                  Stake Liquidity Pool (LP) tokens to earn
                </TYPE.mediumHeader>
              </TitleRow>
              <Divider />
              {uplineComponent()}
              <RowBetween>
                <AutoColumn justify="flex-start" gap="3px">
                  <Text>Search</Text>
                  <SearchInput
                    type="text"
                    id="token-search-input"
                    placeholder={t('tokenSearchPlaceholder')}
                    value={searchQuery}
                    ref={inputRef as RefObject<HTMLInputElement>}
                    onChange={handleInput}
                    onKeyDown={handleEnter}
                    width="25rem"
                  />
                </AutoColumn>
                <AutoColumn gap="3px">
                  <Text>Sort by</Text>
                </AutoColumn>
              </RowBetween>
              {!account ? (
                <GreyCard padding="12px">
                  <TYPE.body color={theme.text1} textAlign="left">
                    Connect to a wallet to view your liquidity.
                  </TYPE.body>
                </GreyCard>
              ) : v1IsLoading ? (
                <GreyCard padding="12px">
                  <TYPE.body color={theme.text1} textAlign="left">
                    <Dots>Loading</Dots>
                  </TYPE.body>
                </GreyCard>
              ) : rewardsAddresses?.length > 0 ? (
                <>
                  {rewardsAddresses.map((contract) => (
                    <StakingPositionCard
                      key={contract}
                      info={stakingInfos[contract]}
                      address={contract}
                      handleStake={handleStake}
                      handleHarvest={handleHarvest}
                    ></StakingPositionCard>
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
