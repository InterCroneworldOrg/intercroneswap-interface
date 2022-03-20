import { useContext, useMemo } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Link } from 'react-router-dom';

// import { useUserHasLiquidityInAllTokens } from '../../data/V';
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks';
import { TYPE, HideSmall, Divider, Button } from '../../theme';
import { Text } from 'rebass';
import { GreyCard, LightCard } from '../../components/Card';
import { AutoRow, RowBetween } from '../../components/Row';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { AutoColumn } from '../../components/Column';

import { useActiveWeb3React } from '../../hooks';
import { usePairs } from '../../data/Reserves';
import { useAsyncV1LiquidityTokens, useTrackedTokenPairs } from '../../state/user/hooks';
import { Dots } from '../../components/swap/styleds';
import { useWalletModalToggle } from '../../state/application/hooks';
import StakingPositionCard, { StakeContract } from '../../components/PositionCard/Stake';
import { useStakingBalancesWithLoadingIndicator } from '../../state/stake/hooks';

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

const dummyStakingContract: StakeContract[] = [
  {
    earn: 'ICR',
    stake: 'BTT',
    name: 'dummy',
    APR: '35',
    earned: '2323.345',
    totalStaked: '53453452.23',
    inusd: '2.34',
    ends_in: '43252',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  {
    earn: 'ICR',
    stake: 'BTT',
    name: 'dummy',
    APR: '35',
    earned: '2323.345',
    totalStaked: '53453452.23',
    inusd: '2.34',
    ends_in: '43252',
    address: '0x6b175474e89094c44da98b954eedeac495271d0rf',
  },
  {
    earn: 'ICR',
    stake: 'BTT',
    name: 'dummy',
    APR: '35',
    earned: '2323.345',
    totalStaked: '53453452.23',
    inusd: '2.34',
    ends_in: '43252',
    address: '0x6b175474e89094c44da98b954eedeac495271d0fs',
  },
];

const rewardsAddresses: string[] = ['0x85c4a3ca3cc1771ccdcd31cc9c58f18a24be62b6'];

export default function Stake() {
  const theme = useContext(ThemeContext);
  const { account } = useActiveWeb3React();

  // fetch the user's balances of all tracked V1 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useAsyncV1LiquidityTokens(trackedTokenPairs);
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  );
  const [v1PairsBalances, fetchingV1PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  );
  const stakingBalances = useStakingBalancesWithLoadingIndicator(rewardsAddresses, account ?? undefined);
  console.log(stakingBalances, 'stakingBalances');

  // fetch the reserves for all V1 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v1PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v1PairsBalances],
  );

  const v1Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens));
  const v1IsLoading =
    fetchingV1PairBalances ||
    v1Pairs?.length < liquidityTokensWithBalances.length ||
    v1Pairs?.some((V1Pair) => !V1Pair);

  // const allV1PairsWithLiquidity = v1Pairs.map(([, pair]) => pair).filter((v1Pair): v1Pair is Pair => Boolean(v1Pair));
  const toggleWalletModal = useWalletModalToggle();

  return (
    <>
      <PageWrapper>
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
              ) : dummyStakingContract?.length > 0 ? (
                <>
                  {dummyStakingContract.map((contract) => (
                    <StakingPositionCard key={contract.address} contract={contract}></StakingPositionCard>
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
