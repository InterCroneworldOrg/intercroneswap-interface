import { Divider, MEDIA_WIDTHS, TYPE } from '../../theme';
import { RefObject, useCallback, useRef, useState, KeyboardEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledHeading } from '../App';
import { PageWrapper } from '../Stake/styleds';
import { LightCard } from '../../components/Card';
import { RowBetween } from '../../components/Row';
import { SearchInput } from '../../components/SearchModal/styleds';
import MarketCard from '../../components/markets/MarketCard';
import { ChainId, Token } from '@intercroneswap/v2-sdk';
import { AutoColumn } from '../../components/Column';
import { getTokensFromDefaults } from '../../constants/tokens';
import { StakingRewardsInfo, REWARDS_DURATION_DAYS_180, REWARDS_DURATION_DAYS } from '../../state/stake/constants';
import { useActiveWeb3React } from '../../hooks';
import useInterval from '../../hooks/useInterval';
import { BACKEND_URL } from '../../constants';
import { useMarkets, MarketInfo } from '../../hooks/useMarkets';

const tokenPairsAreEqual = (tokens1: [Token, Token], tokens2?: [Token, Token]): boolean => {
  if (!tokens2) {
    return false;
  }
  const [token10, token11] = tokens1;
  const [token20, token21] = tokens2;

  if (!token10.equals(token20) && !token10.equals(token21)) return false;
  if (!token11.equals(token20) && !token11.equals(token21)) return false;
  return true;
};

let stakingInfosRaw: {
  [chainId: number]: {
    [version: string]: {
      [tokens: string]: string;
    };
  };
} = {};
fetch('https://raw.githubusercontent.com/InterCroneworldOrg/token-lists/main/staking-addresses.json')
  .then((response) => response.json())
  .then((data) => (stakingInfosRaw = data));

export default function Markets() {
  const { t } = useTranslation();
  //   const theme = useContext(ThemeContext);
  const isMobile = window.innerWidth <= MEDIA_WIDTHS.upToMedium;
  const { chainId } = useActiveWeb3React();
  const inputRef = useRef<HTMLInputElement>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pairInfos, setPairInfos] = useState<any[]>([]);
  useInterval(() => {
    const fetchData = async () => {
      const response = await (await fetch(`${BACKEND_URL}/pairs/markets?chainId=${chainId && ChainId.MAINNET}`)).json();
      setPairInfos(response.data);
    };
    fetchData();
  }, 1000 * 30);
  const markets = useMarkets(pairInfos);

  const marketList = useMemo(() => {
    if (searchQuery) {
      return markets?.filter((info: MarketInfo) => {
        return (
          info.pair.token0.symbol?.toLowerCase().includes(searchQuery) ||
          info.pair.token0.name?.toLowerCase().includes(searchQuery) ||
          info.pair.token1.symbol?.toLowerCase().includes(searchQuery) ||
          info.pair.token1.name?.toLowerCase().includes(searchQuery)
        );
      });
    }
    return markets;
  }, [markets, searchQuery]);

  const stakingRewardInfos: StakingRewardsInfo[] = useMemo(() => {
    const tmpinfos: StakingRewardsInfo[] = [];
    stakingInfosRaw && chainId && stakingInfosRaw[chainId]
      ? Object.keys(stakingInfosRaw[chainId]).map((version) => {
          const vals = stakingInfosRaw[chainId][version];
          Object.keys(vals).map((tokens) => {
            const tokensFromDefault = getTokensFromDefaults(tokens);
            if (tokensFromDefault) {
              tmpinfos.push({
                stakingRewardAddress: vals[tokens],
                tokens: tokensFromDefault,
                rewardsDays: version !== 'v0' ? REWARDS_DURATION_DAYS_180 : REWARDS_DURATION_DAYS,
              });
            }
          });
        })
      : undefined;
    return tmpinfos;
  }, [chainId, stakingInfosRaw]);

  const handleInput = useCallback((event) => {
    const input = event.target.value;
    setSearchQuery(input.toLowerCase());
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim();
        setSearchQuery(s);
      }
    },
    [searchQuery],
  );

  return (
    <>
      <StyledHeading>Markets</StyledHeading>
      <PageWrapper>
        <LightCard style={{ marginTop: '20px' }}>
          <AutoColumn gap="1rem" justify="center">
            <RowBetween>
              <TYPE.white style={{ fontSize: '2rem' }}>Top Pools</TYPE.white>
            </RowBetween>
            <RowBetween style={{ padding: '0rem 3rem' }}>
              <TYPE.white width="20%">Pair</TYPE.white>
              <TYPE.white width="13%">Liquidity</TYPE.white>
              <TYPE.white width="13%">24h volume</TYPE.white>
              <TYPE.white width="13%">APY</TYPE.white>
              <TYPE.white width="13%">LP Staking</TYPE.white>
              <SearchInput
                type="text"
                id="token-search-input"
                placeholder={t('poolSearchPlaceholder')}
                value={searchQuery}
                ref={inputRef as RefObject<HTMLInputElement>}
                onChange={handleInput}
                onKeyDown={handleEnter}
                style={{ fontSize: '.9rem', width: isMobile ? '57%' : '25%' }}
              />
            </RowBetween>
            <Divider />
            {marketList &&
              marketList.length > 0 &&
              marketList.map((market) => (
                <>
                  <MarketCard
                    key={market.pair.liquidityToken.address}
                    pair={market.pair}
                    liquidity={market.usdAmount}
                    stakingAddress={
                      stakingRewardInfos.find((info) =>
                        tokenPairsAreEqual(info.tokens, [market.pair.token0, market.pair.token1]),
                      )?.stakingRewardAddress
                    }
                  />
                </>
              ))}
            {/* {dummyData.map((marketInfo) => (
              <>
                <MarketCard
                  key={marketInfo.tokens[1].symbol}
                  tokens={marketInfo.tokens}
                  dailyVolume={marketInfo.dailyVolume}
                  liquidity={marketInfo.liquidity}
                  lastPrice={marketInfo.lastPrice}
                />
              </>
            ))} */}
          </AutoColumn>
        </LightCard>
      </PageWrapper>
    </>
  );
}
