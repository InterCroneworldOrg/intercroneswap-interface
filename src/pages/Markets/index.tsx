import { Divider, MEDIA_WIDTHS, TYPE } from '../../theme';
import { RefObject, useCallback, useRef, useState, KeyboardEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledHeading } from '../App';
import { PageWrapper } from '../Stake/styleds';
import { LightCard } from '../../components/Card';
import { AutoRow, RowBetween } from '../../components/Row';
import { SearchInput } from '../../components/SearchModal/styleds';
import MarketCard from '../../components/markets/MarketCard';
import { Pair } from '@intercroneswap/v2-sdk';
import { AutoColumn } from '../../components/Column';
import { useTrackedTokenPairs } from '../../state/user/hooks';
import { usePairs } from '../../data/Reserves';
import { getTokensFromDefaults } from '../../constants/tokens';
import { StakingRewardsInfo, REWARDS_DURATION_DAYS_180, REWARDS_DURATION_DAYS } from '../../state/stake/constants';
import { useActiveWeb3React } from '../../hooks';

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
// let marketInfosRaw: any;

// fetch('http://194.163.183.153:3099/api/v1/tronscan-pairs')
//   .then((response) => response.json())
//   .then((data) => (marketInfosRaw = data));

// const dummyData: MarketCardProps[] = [
//   {
//     tokens: [ICR, MEOX],
//     lastPrice: new Price(USDT, ICR, 1500, 16),
//     dailyVolume: new TokenAmount(USDT, 34532),
//     liquidity: new TokenAmount(USDT, 23552),
//   },
//   {
//     tokens: [ICR, WETH[ChainId.MAINNET]],
//     lastPrice: new Price(USDT, ICR, 1500, 16),
//     dailyVolume: new TokenAmount(USDT, 34532),
//     liquidity: new TokenAmount(USDT, 23552),
//   },
//   {
//     tokens: [ICR, USDT],
//     lastPrice: new Price(USDT, ICR, 1500, 16),
//     dailyVolume: new TokenAmount(USDT, 34532),
//     liquidity: new TokenAmount(USDT, 23552),
//   },
//   {
//     tokens: [ICR, BTT],
//     lastPrice: new Price(USDT, ICR, 1500, 16),
//     dailyVolume: new TokenAmount(USDT, 34532),
//     liquidity: new TokenAmount(USDT, 23552),
//   },
// ];

export default function Markets() {
  const { t } = useTranslation();
  //   const theme = useContext(ThemeContext);
  const isMobile = window.innerWidth <= MEDIA_WIDTHS.upToMedium;
  const { chainId } = useActiveWeb3React();
  const inputRef = useRef<HTMLInputElement>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const trackedTokenPairs = useTrackedTokenPairs();
  const v1Pairs = usePairs(trackedTokenPairs);
  // const v1IsLoading = v1Pairs?.length || v1Pairs?.some((V1Pair) => !V1Pair);
  const allPairs = v1Pairs.map(([, pair]) => pair).filter((v1Pair): v1Pair is Pair => Boolean(v1Pair));

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
          <AutoColumn gap="1.5rem" justify="center">
            <RowBetween>
              <TYPE.white>Top Pools</TYPE.white>
              <SearchInput
                type="text"
                id="token-search-input"
                placeholder={t('poolSearchPlaceholder')}
                value={searchQuery}
                ref={inputRef as RefObject<HTMLInputElement>}
                onChange={handleInput}
                onKeyDown={handleEnter}
                width="1rem"
                style={{ fontSize: '.9rem', width: isMobile ? '57%' : '194px' }}
              />
            </RowBetween>
            <AutoRow style={{ padding: '0 1rem' }}>
              <TYPE.white width="25%">Pair</TYPE.white>
              <TYPE.white width="15%">Last Price</TYPE.white>
              <TYPE.white width="15%">Liquidity</TYPE.white>
              <TYPE.white width="15%">24h volume</TYPE.white>
              <TYPE.white width="15%">APY</TYPE.white>
              <TYPE.white width="15%">LP Staking</TYPE.white>
            </AutoRow>
            <Divider />
            {allPairs.map((pair) => (
              <>
                <MarketCard
                  key={pair.liquidityToken.address}
                  pair={pair}
                  stakingAddress={
                    stakingRewardInfos.find((info) => {
                      return info.tokens === [pair.token0, pair.token1] || info.tokens === [pair.token1, pair.token0];
                    })?.stakingRewardAddress
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
