import { LightCard } from '../Card';
import ExternalIcon from '../../assets/images/arrrow-external.svg';
// GreyCard,
import { AutoColumn } from '../Column';
import { Text } from 'rebass';
import { Link } from 'react-router-dom';
// import DoubleCurrencyLogo from '../DoubleLogo';
import { AutoRow, RowBetween } from '../Row';
import { ButtonEmpty, ButtonPrimary } from '../Button';
import { useContext, useState } from 'react';
import { ThemeContext } from 'styled-components';
import { ChevronUp, ChevronDown, ExternalLink } from 'react-feather';
import { Divider } from '../../theme';
import { StakingInfo, useTotalStakedAmount } from '../../state/stake/hooks';
import { useToken } from '../../hooks/Tokens';
import { ChainId, Percent, TokenAmount, WETH } from '@intercroneswap/v2-sdk';

export default function StakingPositionCard({ info, address }: { info: StakingInfo; address: string }) {
  const theme = useContext(ThemeContext);

  const [showMore, setShowMore] = useState(false);
  const stakingToken = useToken(info.stakingToken);
  const rewardsToken = useToken(info.rewardsToken);
  const earnedRewards = new TokenAmount(rewardsToken ?? WETH[ChainId.SHASTA], info.earned);
  const rate = new Percent(info.rewardRate, 8640);
  const totalSupply = useTotalStakedAmount(address);

  return (
    <LightCard style={{ marginTop: '1px' }}>
      <AutoRow justify="space-between" gap="4px">
        <AutoColumn gap="0px">
          <Text fontSize={18} fontWeight={700}>
            Earn {rewardsToken?.symbol}
          </Text>
          <Text fontSize={16} fontWeight={200} color={theme.primary3}>
            Stake {stakingToken?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            {earnedRewards.toSignificant()} earned
          </Text>
          <Text fontSize={13} fontWeight={300} color={theme.primary3}>
            {earnedRewards.toSignificant()}
          </Text>
          <Text fontSize={13} fontWeight={300} color={theme.primary3}>
            {earnedRewards.toSignificant()} USD
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            Total staked
          </Text>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {totalSupply.toString()} {stakingToken?.symbol?.toUpperCase()}
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            APR
          </Text>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {rate.toSignificant()}%
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            Ends in
          </Text>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {info.earned} blocks
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <ButtonEmpty padding="8px" borderRadius="12px" width="fit-content" onClick={() => setShowMore(!showMore)}>
            {showMore ? (
              <>
                {/* {' '}
                  Manage */}
                <ChevronUp size="20" style={{ marginLeft: '10px', color: '#fff' }} />
              </>
            ) : (
              <>
                {/* Manage */}
                <ChevronDown size="20" style={{ marginLeft: '10px', color: '#fff' }} />
              </>
            )}
          </ButtonEmpty>
        </AutoColumn>
      </AutoRow>

      {showMore && (
        <AutoColumn gap="8px">
          <Divider />
          <AutoRow justify="space-between">
            <AutoColumn>
              <ExternalLink
                style={{ marginTop: '10px', width: '100%', textAlign: 'center', color: '#fff' }}
                href={`https://info.intercroneswap.com/#/pair/${address}`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  See Pair Info
                  <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                </div>
              </ExternalLink>
              <ExternalLink
                style={{ marginTop: '10px', width: '100%', textAlign: 'center', color: '#fff' }}
                href={`https://info.intercroneswap.com/#/pair/${address}`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  See Pair Info
                  <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                </div>
              </ExternalLink>
              <ExternalLink
                style={{ marginTop: '10px', width: '100%', textAlign: 'center', color: '#fff' }}
                href={`https://info.intercroneswap.com/#/pair/${address}`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  See Pair Info
                  <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                </div>
              </ExternalLink>
            </AutoColumn>
            <AutoColumn style={{ flexGrow: 1 }} justify="end">
              <RowBetween style={{ maxWidth: '330px', width: '100%', alignItems: 'flex-end' }} marginTop="10px">
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  as={Link}
                  to={`/stake/${address}`}
                  width="48%"
                  style={{ color: '#000' }}
                >
                  Stake
                </ButtonPrimary>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  as={Link}
                  width="48%"
                  style={{ color: '#000' }}
                  to={`/unstake/${address}`}
                >
                  Unstake
                </ButtonPrimary>
              </RowBetween>
            </AutoColumn>
          </AutoRow>
        </AutoColumn>
      )}
    </LightCard>
  );
}
