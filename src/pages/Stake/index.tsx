import { useCallback, useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Link } from 'react-router-dom';

// import { useUserHasLiquidityInAllTokens } from '../../data/V';
import { TYPE, HideSmall, Divider, Button } from '../../theme';
import { Text } from 'rebass';
import { GreyCard, LightCard } from '../../components/Card';
import { AutoRow, RowBetween } from '../../components/Row';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { AutoColumn } from '../../components/Column';

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
const ButtonRow = styled.div`
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  //  width: 100%;
  // width: 05;
  // background: aliceblue;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 0;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
     width: 100%;
     flex-direction: row-reverse;
     justify-content: space-between;
   `};
`;

// const ButtonRow = styled(RowFixed)`
//   gap: 8px;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     width: 100%;
//     flex-direction: row-reverse;
//     justify-content: space-between;
//   `};
// `

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`;

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  // margin-left:219px;
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`;

// const EmptyProposals = styled.div`
//   border: 1px solid ${({ theme }) => theme.text4};
//   padding: 16px 12px;
//   border-radius: 12px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

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
              <div>
                <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
                  <HideSmall>
                    <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                      Stake Liquidity Pools
                    </TYPE.mediumHeader>
                  </HideSmall>
                  <ButtonRow style={{ display: 'none' }}>
                    <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/create/TRX">
                      Create a pair
                    </ResponsiveButtonSecondary>
                    <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="6px 8px" to="/add/TRX">
                      <Text fontWeight={500} fontSize={16}>
                        Add Liquidity
                      </Text>
                    </ResponsiveButtonPrimary>
                  </ButtonRow>
                </TitleRow>
                <Divider />
              </div>

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
