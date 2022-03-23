import { LightCard } from '../Card';
import { unwrappedToken } from '../../utils/wrappedCurrency';
// GreyCard,
import { AutoColumn } from '../Column';
import { Text } from 'rebass';
// import DoubleCurrencyLogo from '../DoubleLogo';
import { AutoRow } from '../Row';
import { ButtonEmpty, ButtonPrimary } from '../Button';
import { useContext, useState } from 'react';
import { ThemeContext } from 'styled-components';
import { ChevronUp, ChevronDown } from 'react-feather';
import { Divider } from '../../theme';
import { StakingInfo } from '../../state/stake/hooks';
import { useToken } from '../../hooks/Tokens';
import { ChainId, Percent, Token, TokenAmount, WETH } from '@intercroneswap/v2-sdk';
import CurrencyLogo from '../CurrencyLogo';
import { PairState, usePair } from '../../data/Reserves';
import { useTotalSupply } from '../../data/TotalSupply';

interface StakingPositionCardProps {
  info: StakingInfo;
  address: string;
  handleStake: (
    isStaking: boolean,
    address: string,
    lpSupply?: TokenAmount,
    token0?: TokenAmount,
    token1?: TokenAmount,
  ) => void;
}

export default function StakingPositionCard({ info, address, handleStake }: StakingPositionCardProps) {
  const theme = useContext(ThemeContext);

  const [showMore, setShowMore] = useState(false);
  const token0: Token | null | undefined = useToken(info.stakingPair?.token0);
  const token1: Token | null | undefined = useToken(info.stakingPair?.token1);
  const token0Loading = token0 === null || token0 === undefined;
  const token1Loading = token1 === null || token1 === undefined;
  const [pairState, lpPair] = usePair(token0 === null ? undefined : token0, token1 === null ? undefined : token1);
  const pairSupply = useTotalSupply(lpPair?.liquidityToken);
  if (pairState === PairState.LOADING) {
    console.log('loading');
  }
  // console.log(lpPair, pairState, pairSupply, 'pair');
  const earnedRewards = new TokenAmount(token1 ?? WETH[ChainId.SHASTA], info.earned);
  const rate = new Percent(info.rewardRate, 8640);

  return (
    <LightCard style={{ marginTop: '0px' }}>
      <AutoRow justify="space-between" gap="0px">
        <AutoColumn gap="0px">
          <AutoRow>
            <CurrencyLogo currency={token0Loading ? undefined : unwrappedToken(token0)} />
            &nbsp;
            <Text fontWeight={500} fontSize={20}>
              {token0?.symbol}&nbsp;/
            </Text>
            &nbsp;
            <CurrencyLogo currency={token1Loading ? undefined : unwrappedToken(token1)} />
            &nbsp;
            <Text fontWeight={500} fontSize={20}>
              {token1?.symbol}
            </Text>
          </AutoRow>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            Ends on
          </Text>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {info.earned}
          </Text>
        </AutoColumn>
        <AutoColumn gap="1px">
          <Text fontSize={16} fontWeight={500}>
            Earned / APY
          </Text>
          <Text fontSize={13} fontWeight={300} color={theme.primary3}>
            {earnedRewards.toSignificant()} / {rate.toSignificant()}
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            Balance
          </Text>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {pairSupply?.toSignificant()}
          </Text>
        </AutoColumn>
        <AutoColumn gap="0px">
          <AutoRow>
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              width="48%"
              style={{ color: '#000' }}
              onClick={() => handleStake(true, address, pairSupply, lpPair?.reserve0, lpPair?.reserve1)}
            >
              Stake
            </ButtonPrimary>
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              width="48%"
              style={{ color: '#000' }}
              onClick={() => handleStake(false, address, pairSupply, lpPair?.reserve0, lpPair?.reserve1)}
            >
              Unstake
            </ButtonPrimary>
          </AutoRow>
        </AutoColumn>
        <AutoColumn gap="0px">
          <ButtonEmpty padding="1px" borderRadius="6" width="fit-content" onClick={() => setShowMore(!showMore)}>
            {showMore ? (
              <>
                {/* {' '}
                  Manage */}
                <ChevronUp size="20" style={{ marginLeft: '1px', color: '#fff' }} />
              </>
            ) : (
              <>
                {/* Manage */}
                <ChevronDown size="20" style={{ marginLeft: '1px', color: '#fff' }} />
              </>
            )}
          </ButtonEmpty>
        </AutoColumn>
      </AutoRow>

      {showMore && (
        <AutoColumn gap="8px">
          <Divider />
          <AutoRow justify="center" gap="10px">
            <Text fontSize={16} fontWeight={300}>
              Ends in
            </Text>
            <Text fontSize={16} fontWeight={500} color={theme.primary3}>
              10 Days / 7:01:54
            </Text>
            <Text fontSize={16} fontWeight={300}>
              Liquidity
            </Text>
            <Text fontSize={16} fontWeight={500} color={theme.primary3}>
              1564355
            </Text>
          </AutoRow>
        </AutoColumn>
      )}
    </LightCard>
  );
}
