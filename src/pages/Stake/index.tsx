import { useCallback, useContext, useState } from 'react';
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
import { StakingInfo, useStakingBalancesWithLoadingIndicator } from '../../state/stake/hooks';
import StakeModal from './StakeModal';
import { StyledHeading } from '../App';
import { TokenAmount } from '@intercroneswap/v2-sdk';

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

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bg3};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.primary3)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 300;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`;

const rewardsAddresses: string[] = [];

fetch('https://raw.githubusercontent.com/InterCroneworldOrg/token-lists/main/staking-addresses.json')
  .then((response) => response.json())
  .then((responseJson) => rewardsAddresses.push(...responseJson.addresses))
  .catch((err) => console.error(err));

export default function Stake() {
  const theme = useContext(ThemeContext);
  const { account } = useActiveWeb3React();

  const [stakingInfos, fetchingStakingInfos] = useStakingBalancesWithLoadingIndicator(
    rewardsAddresses,
    account ?? undefined,
  );

  const [stakeAddress, setStakeAddress] = useState<string>('');
  const [stakeInfo, setStakeInfo] = useState<StakingInfo | undefined>(undefined);
  const [lpBalance, setLPBalance] = useState<TokenAmount | undefined>(undefined);
  const [showStake, setShowStake] = useState<boolean>(false);

  const v1IsLoading = fetchingStakingInfos;

  const toggleWalletModal = useWalletModalToggle();

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
  }, [stakeAddress, showStake]);

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
            <AutoColumn gap="lg" style={{ width: '100%' }}>
              <TitleRow style={{ marginTop: '1rem' }} textAlign="center" padding={'0'}>
                <TYPE.mediumHeader width="100%" style={{ marginTop: '0.5rem', justifySelf: 'center' }}>
                  Stake Liquidity Pool (LP) tokens to earn
                </TYPE.mediumHeader>
              </TitleRow>
              <Divider />
              <RowBetween>
                <AutoColumn justify="flex-start">
                  <Text>Search</Text>
                  <Input
                    spellCheck="false"
                    placeholder="Filter by token name"
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="off"
                    type="text"
                  />
                </AutoColumn>
                <AutoColumn>
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
