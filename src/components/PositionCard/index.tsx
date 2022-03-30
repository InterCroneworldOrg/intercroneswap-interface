import { ETHER, JSBI, Pair, Percent } from '@intercroneswap/v2-sdk';
import { darken } from 'polished';
import { useContext, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Link } from 'react-router-dom';
import { Text } from 'rebass';
import styled, { ThemeContext } from 'styled-components';
import { useTotalSupply } from '../../data/TotalSupply';

import { useActiveWeb3React } from '../../hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { Divider, ExternalLink, TYPE } from '../../theme';
import { currencyId } from '../../utils/currencyId';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import {
  ButtonPrimary,
  //  ButtonSecondary,
  ButtonEmpty,
} from '../Button';
import ExternalIcon from '../../assets/images/arrrow-external.svg';
import { ethAddress } from '@intercroneswap/java-tron-provider';

// import { transparentize } from 'polished';
// import { CardNoise } from '../earn/styled'

// import { useColor } from '../../hooks/useColor';

import Card, { LightCard } from '../Card';
// GreyCard,
import { AutoColumn } from '../Column';
import CurrencyLogo from '../CurrencyLogo';
// import DoubleCurrencyLogo from '../DoubleLogo';
import { AutoRow, RowBetween, RowFixed } from '../Row';
import { Dots } from '../swap/styleds';
import { getEtherscanLink } from '../../utils';

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`;

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`;
const StyledPositionCard = styled(LightCard)<{ bgColor?: any }>`
  border: none;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.bg3};
`;

const StyledPoolInfoCard = styled(LightCard)`
  background: ${({ theme }) => theme.bg4};
`;

// background: ${({ theme, bgColor }) =>
//   `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, bgColor)} 0%, ${theme.bg3} 100%) `};

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
}

export function MinimalPositionCard({
  pair,
  showUnwrapped = false,
}: //  border
PositionCardProps) {
  const { account } = useActiveWeb3React();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  // const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt('0')) ? (
        <LightCard style={{ marginTop: '1rem' }}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowBetween>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
                <RowFixed>
                  <CurrencyLogo currency={currency0} />
                  &nbsp;
                  <Text fontWeight={500} fontSize={20}>
                    {currency0.symbol}&nbsp;/
                  </Text>
                  &nbsp;
                  <CurrencyLogo currency={currency1} />
                  &nbsp;
                  <Text fontWeight={500} fontSize={20}>
                    {currency1.symbol}
                  </Text>
                </RowFixed>
              </RowBetween>
            </FixedHeightRow>
            <Divider />
            {/* <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow> */}
            <AutoColumn gap="md">
              <AutoRow justify="space-between" gap="4px">
                <AutoColumn justify="center" style={{ display: 'none' }}>
                  <Text fontSize={16} fontWeight={500}>
                    Your pool share:
                  </Text>
                  <Text fontSize={16}>{poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}</Text>
                </AutoColumn>
                <AutoColumn justify="center">
                  <Text fontSize={16} fontWeight={500}>
                    {currency0.symbol}
                  </Text>
                  {token0Deposited ? (
                    <RowFixed>
                      <Text fontSize={16} marginLeft={'6px'}>
                        {token0Deposited?.toSignificant(6)}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </AutoColumn>
                <AutoColumn justify="center">
                  <Text fontSize={16} fontWeight={500}>
                    {currency1.symbol}
                  </Text>
                  {token1Deposited ? (
                    <RowFixed>
                      <Text fontSize={16} marginLeft={'6px'}>
                        {token1Deposited?.toSignificant(6)}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </AutoColumn>
                <AutoColumn justify="center">
                  <Text fontSize={16} fontWeight={500}>
                    Pool token
                  </Text>
                  <Text fontSize={16}>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
                </AutoColumn>
              </AutoRow>
            </AutoColumn>
          </AutoColumn>
        </LightCard>
      ) : (
        <LightCard style={{ marginTop: '1rem' }}>
          <TYPE.body style={{ textAlign: 'center' }} fontSize={16}>
            {/* <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{' '} */}
            By adding liquidity you&apos;ll earn 0.3% of all trades on this pair proportional to your share of the pool.
            Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
          </TYPE.body>
        </LightCard>
      )}
    </>
  );
}

export const MinimalAutoColumn = styled(AutoColumn)`
  height: 100%;
  flex-grow: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 25%;
  `}
`;

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const { account, chainId } = useActiveWeb3React();
  const theme = useContext(ThemeContext);
  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);
  const isCurrency0ETH = currency0 === ETHER;
  const isCurrency1ETH = currency1 === ETHER;

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  // const backgroundColor = useColor(pair?.token0);

  return (
    <StyledPositionCard border={border}>
      {/* <CardNoise /> */}
      <AutoColumn gap="12px">
        <FixedHeightRow>
          {/* <RowFixed>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </RowFixed> */}
          <FixedHeightRow>
            <RowBetween>
              {!currency0 || !currency1 ? (
                <Dots>Loading</Dots>
              ) : (
                <RowFixed>
                  <CurrencyLogo currency={currency0} />
                  &nbsp;
                  <Text fontWeight={500} fontSize={20}>
                    {currency0.symbol}&nbsp;/
                  </Text>
                  &nbsp;
                  <CurrencyLogo currency={currency1} />
                  &nbsp;
                  <Text fontWeight={500} fontSize={20}>
                    {currency1.symbol}
                  </Text>
                </RowFixed>
              )}
            </RowBetween>
          </FixedHeightRow>
          <RowFixed gap="8px">
            <ButtonEmpty
              padding="6px 8px"
              borderRadius="12px"
              width="fit-content"
              onClick={() => setShowMore(!showMore)}
            >
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
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <Divider />
            <StyledPoolInfoCard style={{ padding: '25px' }}>
              <AutoColumn gap="md">
                <AutoRow justify="space-between" gap="4px">
                  <AutoColumn justify="center">
                    <Text fontSize={16} fontWeight={500}>
                      Your pool tokens
                    </Text>
                    <RowFixed style={{ width: '100%' }}>
                      <Text fontSize={16} marginLeft={'6px'} textAlign={'left'} color={theme.primary3}>
                        {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'} /{' '}
                        {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
                      </Text>
                    </RowFixed>
                  </AutoColumn>
                  <AutoColumn justify="center">
                    <Text fontSize={16} fontWeight={500}>
                      Pooled {currency0.symbol}
                    </Text>
                    {token0Deposited ? (
                      <RowFixed>
                        <Text fontSize={16} fontWeight={500} marginLeft={'6px'} color={theme.primary3}>
                          {token0Deposited?.toSignificant(6)}
                        </Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </AutoColumn>
                  <AutoColumn justify="center">
                    <Text fontSize={16} fontWeight={500}>
                      Pooled {currency1.symbol}
                    </Text>
                    {token1Deposited ? (
                      <RowFixed>
                        <Text fontSize={16} fontWeight={500} marginLeft={'6px'} color={theme.primary3}>
                          {token1Deposited?.toSignificant(6)}
                        </Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </AutoColumn>
                </AutoRow>
              </AutoColumn>
            </StyledPoolInfoCard>
            <AutoRow justify="space-between">
              <AutoColumn>
                {/* <ButtonSecondary padding="8px" borderRadius="8px"> */}
                <ExternalLink
                  style={{ marginTop: '10px', width: '100%', textAlign: 'center', color: '#fff' }}
                  href={`#/add/${isCurrency0ETH ? ETHER.symbol : pair.token0.address}/${
                    isCurrency1ETH ? ETHER.symbol : pair.token1.address
                  }`}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Get {currency0.symbol} - {currency1.symbol} LP
                    <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                  </div>
                </ExternalLink>
                <ExternalLink
                  style={{ marginTop: '10px', width: '100%', textAlign: 'center', color: '#fff' }}
                  href={chainId ? getEtherscanLink(chainId, pair.liquidityToken.address, 'address') : '#'}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    View Contract
                    <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                  </div>
                </ExternalLink>
                <ExternalLink
                  style={{ marginTop: '10px', width: '100%', textAlign: 'center', color: '#fff' }}
                  href={`https://info.intercroneswap.com/#/pair/${ethAddress.toTron(pair.liquidityToken.address)}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    See Pair Info
                    <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                  </div>
                </ExternalLink>
                {/* <ExternalLink
                  style={{ width: '100%', textAlign: 'center', color: '#fff' }}
                  href={`https://info.intercroneswap.com/#/account/${account}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    View accrued fees and analytics
                    <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                  </div>
                </ExternalLink> */}
                {/* </ButtonSecondary> */}
              </AutoColumn>
              <MinimalAutoColumn justify="end">
                <RowBetween>
                  <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                    width="48%"
                    style={{ color: '#000' }}
                  >
                    Add
                  </ButtonPrimary>
                  <ButtonPrimary
                    padding="8px"
                    borderRadius="8px"
                    as={Link}
                    width="48%"
                    style={{ color: '#000' }}
                    to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                  >
                    Remove
                  </ButtonPrimary>
                </RowBetween>
              </MinimalAutoColumn>
            </AutoRow>
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  );
}
