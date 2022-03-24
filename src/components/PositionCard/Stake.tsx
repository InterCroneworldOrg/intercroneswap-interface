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
import { Divider, ExternalLink } from '../../theme';
import { StakingInfo } from '../../state/stake/hooks';
import { useToken } from '../../hooks/Tokens';
import { ChainId, Percent, Token, TokenAmount, WETH } from '@intercroneswap/v2-sdk';
import CurrencyLogo from '../CurrencyLogo';
import { PairState, usePair } from '../../data/Reserves';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useActiveWeb3React } from '../../hooks';
import { getEtherscanLink } from '../../utils';
import ExternalIcon from '../../assets/images/arrrow-external.svg';

interface StakingPositionCardProps {
  info: StakingInfo;
  address: string;
  handleStake: (address: string, lpSupply?: TokenAmount) => void;
}

export default function StakingPositionCard({ info, address, handleStake }: StakingPositionCardProps) {
  const theme = useContext(ThemeContext);
  const { account, chainId } = useActiveWeb3React();

  const [showMore, setShowMore] = useState(false);
  const token0: Token | null | undefined = useToken(info.stakingPair?.token0);
  const token1: Token | null | undefined = useToken(info.stakingPair?.token1);
  const token0Loading = token0 === null || token0 === undefined;
  const token1Loading = token1 === null || token1 === undefined;
  const [pairState, lpPair] = usePair(token0 === null ? undefined : token0, token1 === null ? undefined : token1);
  const pairSupply = useTokenBalance(account ?? undefined, lpPair?.liquidityToken);
  const stakeSupply = useTokenBalance(address, lpPair?.liquidityToken);
  if (pairState === PairState.LOADING) {
    console.log('loading');
  }

  const finishDate = info.periodFinish ? new Date(info.periodFinish.toNumber() * 1000) : undefined;
  finishDate?.setSeconds(0);
  const dateDiff = finishDate ? new Date(finishDate.getTime() - Date.now()) : undefined;
  // console.log(lpPair, pairState, pairSupply, 'pair');
  const earnedRewards = new TokenAmount(token1 ?? WETH[ChainId.SHASTA], info.earned);
  const rate = new Percent(info.rewardRate, 8640);

  return (
    <LightCard style={{ marginTop: '2px', background: theme.bg3 }}>
      <AutoRow justify="space-between" gap="0px">
        <AutoColumn gap="0px">
          <AutoRow>
            <CurrencyLogo currency={token0Loading ? undefined : unwrappedToken(token0)} />
            &nbsp;
            <Text fontWeight={500} fontSize={20}>
              {token0Loading ? undefined : unwrappedToken(token0)?.symbol}&nbsp;/
            </Text>
            &nbsp;
            <CurrencyLogo currency={token1Loading ? undefined : unwrappedToken(token1)} />
            &nbsp;
            <Text fontWeight={500} fontSize={20}>
              {token1Loading ? undefined : unwrappedToken(token1)?.symbol}
            </Text>
          </AutoRow>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            Ends on
          </Text>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {finishDate?.toLocaleString()}
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
          <AutoRow gap="1px">
            <Text fontSize={16} fontWeight={500}>
              Balance
            </Text>
            <ExternalLink
              style={{ textAlign: 'center', color: '#fff' }}
              href={chainId ? getEtherscanLink(chainId, address, 'address') : '#'}
            >
              <Text fontSize={14} fontWeight={400} style={{ textDecorationLine: 'underline' }}>
                Get LP
              </Text>
            </ExternalLink>
          </AutoRow>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {pairSupply?.toSignificant(4)}
          </Text>
        </AutoColumn>
        <AutoColumn gap="0px" style={{ width: '35%' }} justify="flex-end">
          <AutoRow gap="4px" width="100%">
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              width="48%"
              disabled={true}
              style={{ color: '#000' }}
              onClick={() => console.log('Harvest is In development')}
            >
              <AutoColumn>
                <Text fontSize="16px" fontWeight={600}>
                  Harvest
                </Text>
                <Text fontSize="14px" fontWeight={300}>
                  In development
                </Text>
              </AutoColumn>
            </ButtonPrimary>
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              width="48%"
              style={{ color: '#000' }}
              onClick={() => handleStake(address, pairSupply)}
            >
              <AutoColumn>
                <Text fontSize="16px" fontWeight={600}>
                  Stake / Unstake
                </Text>
                <Text fontSize="14px" fontWeight={300}>
                  {pairSupply?.toSignificant(4)}
                </Text>
              </AutoColumn>
            </ButtonPrimary>
          </AutoRow>
        </AutoColumn>
        <AutoColumn gap="0px" justify="flex-end">
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
              {dateDiff ? Math.floor(dateDiff.getTime() / (24 * 3600 * 1000)) : undefined} Days /{' '}
              {dateDiff ? dateDiff.toLocaleTimeString() : undefined}
            </Text>
            <Text fontSize={16} fontWeight={300}>
              Liquidity
            </Text>
            <Text fontSize={16} fontWeight={500} color={theme.primary3}>
              {stakeSupply?.toSignificant(4)}
            </Text>
            <AutoColumn>
              <ExternalLink
                style={{ textAlign: 'center', color: '#fff' }}
                href={chainId ? getEtherscanLink(chainId, address, 'address') : '#'}
              >
                <Text fontSize={16} fontWeight={500}>
                  View Smart Contract
                  <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                </Text>
              </ExternalLink>
            </AutoColumn>
            <AutoColumn>
              <ExternalLink
                style={{ textAlign: 'center', color: '#fff' }}
                href={`https://info.intercroneswap.com/#/stake/${address}`}
              >
                <Text fontSize={16} fontWeight={500}>
                  View Token Info
                  <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                </Text>
              </ExternalLink>
            </AutoColumn>
          </AutoRow>
        </AutoColumn>
      )}
    </LightCard>
  );
}
