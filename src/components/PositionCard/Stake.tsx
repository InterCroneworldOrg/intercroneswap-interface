import { LightCard } from '../Card';
import { unwrappedToken } from '../../utils/wrappedCurrency';
// GreyCard,
import { AutoColumn } from '../Column';
import { Text } from 'rebass';
// import DoubleCurrencyLogo from '../DoubleLogo';
import { AutoRow } from '../Row';
import { ButtonEmpty, ButtonPrimary } from '../Button';
import { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ChevronUp, ChevronDown } from 'react-feather';
import { Divider, ExternalLink } from '../../theme';
import { StakingInfos } from '../../state/stake/hooks';
import { ETHER, Percent, Token, TokenAmount } from '@intercroneswap/v2-sdk';
import CurrencyLogo from '../CurrencyLogo';
import { PairState, usePair } from '../../data/Reserves';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useActiveWeb3React } from '../../hooks';
import { getEtherscanLink } from '../../utils';
import { Dots } from '../../pages/Stake/styleds';
import { tryParseAmount } from '../../state/swap/hooks';

interface StakingPositionCardProps {
  stakingInfo: StakingInfos;
  address: string;
  handleStake: (address: string, lpSupply?: TokenAmount) => void;
  handleHarvest: (address: string) => void;
}

export const AutoRowToColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string;
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between';
}>`
  display: grid;
  width: 100%
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
    padding: 0;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  `}
`;

export const AutoColumnToRow = styled(AutoRow)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: grid;
    margin: .5rem 0;
    padding: 0;
    width: 100%;
    grid-auto-rows: auto;
    justify-content: space-between;
  `}
`;

const SpacedToCenteredAutoRow = styled(AutoRow)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: space-between;
  `}
`;

const RowBetweenToDiv = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding: 0 1rem;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: space-between;
    width: 100%;
    padding: 0;
    gap: 0;
  `}
`;

export default function StakingPositionCard({ stakingInfo, address, handleStake, handleHarvest }: StakingPositionCardProps) {
  const theme = useContext(ThemeContext);

  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)
  const { account, chainId } = useActiveWeb3React();
  const [showMore, setShowMore] = useState(false);
  const stakeBalanceAmount = tryParseAmount(
    (Number(info?.balance.toString()) / Math.pow(10, lpPair?.liquidityToken.decimals ?? 0)).toFixed(
      lpPair?.liquidityToken.decimals,
    ),
    lpPair?.liquidityToken,
  );

  const finishDate =
    info.periodFinish && info.periodFinish.gt(0) ? new Date(info.periodFinish.toNumber() * 1000) : undefined;
  finishDate?.setSeconds(0);
  const now = Date.now();
  const dateDiff = finishDate && finishDate.getTime() > now ? new Date(finishDate.getTime() - now) : undefined;
  const rate = new Percent(info.rewardRate, 8640);

  return (
    <LightCard style={{ marginTop: '2px', margin: '0rem', padding: '1rem', background: theme.bg3 }}>
      <AutoRow justify="space-between" gap=".2rem">
        <AutoRowToColumn>
          <AutoRow>
            <CurrencyLogo currency={currency0} size="1rem" />
            &nbsp;
            <Text fontWeight={500} fontSize="1rem">
              {currency0?.symbol}&nbsp;/
            </Text>
            &nbsp;
            <CurrencyLogo currency={currency1} size="1rem" />
            &nbsp;
            <Text fontWeight={500} fontSize="1rem">
              {currency1?.symbol}
            </Text>
          </AutoRow>
        </AutoRowToColumn>
        <AutoRowToColumn gap="0.5rem">
          <Text fontSize="0.7rem" fontWeight="1.3rem">
            Ends on
          </Text>
          <Text fontSize="0.5rem" fontWeight="0.6rem" color={theme.primary3}>
            {finishDate?.toLocaleString() || 'Not available yet'}
          </Text>
        </AutoRowToColumn>
        <AutoRowToColumn gap="1px">
          <Text fontSize="0.7rem" fontWeight="1.3rem">
            Earned / APY
          </Text>
          <Text fontSize="0.5rem" fontWeight="0.6rem" color={theme.primary3}>
            {stakingInfo.earnedAmount.toSignificant()} / {rate.toSignificant()}
          </Text>
        </AutoRowToColumn>
        <AutoRowToColumn gap="1px">
          <AutoRow gap="1rem">
            <Text fontSize="0.7rem" fontWeight="0.7rem">
              Balance
            </Text>
            <ExternalLink
              style={{ textAlign: 'center', color: '#fff' }}
              href={`#/add/${currency0 === ETHER ? ETHER.symbol : token0?.address}/${
                currency1 === ETHER ? ETHER.symbol : token1?.address
              }`}
            >
              <Text fontSize="0.7rem" fontWeight={400} style={{ textDecorationLine: 'underline' }}>
                Get LP
              </Text>
            </ExternalLink>
          </AutoRow>
          {stakingInfo?. ? (
            <Text fontSize="0.5rem" fontWeight="0.7rem" color={theme.primary3}>
              {pairSupply?.toSignificant(4)}
            </Text>
          ) : (
            <Dots></Dots>
          )}
        </AutoRowToColumn>
        <AutoRow style={{ width: '25rem' }} gap=".1rem">
          <ButtonPrimary
            padding="8px"
            borderRadius="8px"
            width="45%"
            style={{ color: '#000' }}
            disabled={rewardAmount?.equalTo(0)}
            onClick={() => handleHarvest(address)}
          >
            <AutoColumn>
              <Text fontSize="0.7rem" fontWeight="0.8rem">
                Harvest
              </Text>
              <Text fontSize="0.5rem" fontWeight="0.5rem">
                {rewardAmount?.greaterThan(0) ? rewardAmount?.toSignificant(4) : 'Nothing to Harvest'}
              </Text>
            </AutoColumn>
          </ButtonPrimary>
          <ButtonPrimary
            padding="8px"
            borderRadius="8px"
            width="45%"
            style={{ color: '#000' }}
            onClick={() => handleStake(address, pairSupply)}
          >
            <AutoColumn>
              <Text fontSize="0.7rem" fontWeight="0.7rem">
                Stake
              </Text>
              {pairSupply ? (
                <Text fontSize="0.5rem" fontWeight="0.5rem">
                  {pairSupply.greaterThan(0) ? pairSupply?.toSignificant(4) : 'No liquidity'}
                </Text>
              ) : (
                <Dots></Dots>
              )}
            </AutoColumn>
          </ButtonPrimary>
          <ButtonEmpty padding="0px" borderRadius="6" width="5%" onClick={() => setShowMore(!showMore)}>
            {showMore ? (
              <>
                {/* {' '}
                  Manage */}
                <ChevronUp size="20" style={{ marginLeft: '0px', color: '#fff' }} />
              </>
            ) : (
              <>
                {/* Manage */}
                <ChevronDown size="20" style={{ marginLeft: '0px', color: '#fff' }} />
              </>
            )}
          </ButtonEmpty>
        </AutoRow>
      </AutoRow>

      {showMore && (
        <AutoColumnToRow>
          <Divider />
          <SpacedToCenteredAutoRow gap=".3rem">
            <RowBetweenToDiv>
              <Text fontSize="0.7rem" fontWeight="0.7rem">
                Ends in
              </Text>
              {dateDiff ? (
                <Text fontSize="0.5rem" fontWeight="0.5rem" color={theme.primary3}>
                  {Math.floor(dateDiff.getTime() / (24 * 3600 * 1000))} Days / {dateDiff.toLocaleTimeString()}
                </Text>
              ) : (
                <Text fontSize="0.5rem" fontWeight="0.5rem" color={theme.primary3}>
                  Not available
                </Text>
              )}
            </RowBetweenToDiv>
            <RowBetweenToDiv>
              <Text fontSize="0.7rem" fontWeight="0.7rem">
                Liquidity
              </Text>
              <Text fontSize="0.5rem" fontWeight="0.5rem" color={theme.primary3}>
                {stakeBalanceAmount?.toSignificant()}
              </Text>
            </RowBetweenToDiv>
            <ExternalLink
              style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}
              href={chainId ? getEtherscanLink(chainId, address, 'address') : '#'}
            >
              <Text fontSize="0.7rem" fontWeight="0.7rem">
                View Smart Contract
              </Text>
            </ExternalLink>
            <ExternalLink
              style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}
              href={chainId ? getEtherscanLink(chainId, stakingInfo.stakingRewardAddress ?? '', 'token') : '#'}
            >
              <Text fontSize="0.7rem" fontWeight="0.7rem">
                View Token Info
              </Text>
            </ExternalLink>
          </SpacedToCenteredAutoRow>
        </AutoColumnToRow>
      )}
    </LightCard>
  );
}
