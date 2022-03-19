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

export interface StakeContract {
  earn: string;
  stake: string;
  name: string;
  APR: string;
  earned: string;
  totalStaked: string;
  inusd: string;
  ends_in: string;
  address: string;
}

interface StakeArgs {
  contract: StakeContract;
}

export default function StakingPositionCard({ contract }: StakeArgs) {
  //const { account, chainId } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  const [showMore, setShowMore] = useState(false);

  return (
    <LightCard style={{ marginTop: '1px' }}>
      <AutoRow justify="space-between" gap="4px">
        <AutoColumn gap="0px">
          <Text fontSize={18} fontWeight={700}>
            Earn {contract.earn}
          </Text>
          <Text fontSize={16} fontWeight={200} color={theme.primary3}>
            Stake {contract.stake}
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            {contract.earn} earned
          </Text>
          <Text fontSize={13} fontWeight={300} color={theme.primary3}>
            {contract.earned}
          </Text>
          <Text fontSize={13} fontWeight={300} color={theme.primary3}>
            {contract.inusd} USD
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            Total staked
          </Text>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {contract.totalStaked} {contract.stake.toUpperCase()}
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            APR
          </Text>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {contract.APR}%
          </Text>
        </AutoColumn>
        <AutoColumn gap="2px">
          <Text fontSize={16} fontWeight={500}>
            Ends in
          </Text>
          <Text fontSize={16} fontWeight={300} color={theme.primary3}>
            {contract.ends_in} blocks
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
                href={`https://info.intercroneswap.com/#/pair/${contract.address}`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  See Pair Info
                  <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                </div>
              </ExternalLink>
              <ExternalLink
                style={{ marginTop: '10px', width: '100%', textAlign: 'center', color: '#fff' }}
                href={`https://info.intercroneswap.com/#/pair/${contract.address}`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  See Pair Info
                  <img style={{ marginLeft: '10px' }} src={ExternalIcon} alt="externalicon" />
                </div>
              </ExternalLink>
              <ExternalLink
                style={{ marginTop: '10px', width: '100%', textAlign: 'center', color: '#fff' }}
                href={`https://info.intercroneswap.com/#/pair/${contract.address}`}
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
                  to={`/stake/${contract.address}`}
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
                  to={`/unstake/${contract.address}`}
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
