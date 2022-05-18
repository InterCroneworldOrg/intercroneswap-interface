import { Divider, MEDIA_WIDTHS, TYPE } from '../../theme';
import { RefObject, useCallback, useRef, useState, KeyboardEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledHeading } from '../App';
import { PageWrapper } from '../Stake/styleds';
import { LightCard } from '../../components/Card';
import { AutoRow, RowBetween } from '../../components/Row';
import { SearchInput } from '../../components/SearchModal/styleds';
import MarketCard from '../../components/markets/MarketCard';
import { ChainId, Pair, Token, ZERO } from '@intercroneswap/v2-sdk';
import { AutoColumn } from '../../components/Column';
import { getTokensFromDefaults } from '../../constants/tokens';
import { StakingRewardsInfo, REWARDS_DURATION_DAYS_180, REWARDS_DURATION_DAYS } from '../../state/stake/constants';
import { useActiveWeb3React } from '../../hooks';
import { usePairs } from '../../data/Reserves';

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

const convertRawInfoToTokenAmounts = (pairInfo: any): [Token, Token] | undefined => {
  if (pairInfo) {
    try {
      const tokenA = new Token(
        ChainId.MAINNET,
        pairInfo.tokenA_hex.replace('41', '0x'),
        Number(pairInfo.tokenA_Decimal),
        pairInfo.tokenA_Abbr,
        pairInfo.tokenA_Name,
      );
      // const tokenABalance = JSBI.multiply(
      //   JSBI.BigInt(Math.trunc(Number(pairInfo.tokenA_balance))),
      //   JSBI.multiply(TEN, JSBI.BigInt(Number(pairInfo.tokenA_Decimal))),
      // );

      // const tokenAAmount = new TokenAmount(tokenA, tokenABalance);
      const tokenB = new Token(
        ChainId.MAINNET,
        pairInfo.tokenB_hex.replace('41', '0x'),
        Number(pairInfo.tokenB_Decimal),
        pairInfo.tokenB_Abbr,
        pairInfo.tokenB_Name,
      );
      // const tokenBBalance = JSBI.multiply(
      //   JSBI.BigInt(Math.trunc(Number(pairInfo.tokenB_Balance))),
      //   JSBI.multiply(TEN, JSBI.BigInt(Number(pairInfo.tokenB_Decimal))),
      // );
      // const tokenBAmount = new TokenAmount(tokenB, tokenBBalance);
      // const pair = new Pair(tokenAAmount, tokenBAmount, pairInfo.pair_hex.replace('41', '0x'));
      return [tokenA, tokenB];
    } catch (error) {
      console.error(error, 'Error while creating pair');
      return undefined;
    }
  }
  return undefined;
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
let marketInfosRaw: any[];
const allPairs: [Token, Token][] = [];

fetch('https://api.intercroneswap.com/api/v1/getallpairs/tron?size=100')
  .then((response) => response.json())
  .then((data) => {
    marketInfosRaw = data?.pairs;
    marketInfosRaw.map((pairInfo) => {
      const pair = convertRawInfoToTokenAmounts(pairInfo);
      if (pair) {
        allPairs.push(pair);
      }
    });
  });

export default function Markets() {
  const { t } = useTranslation();
  //   const theme = useContext(ThemeContext);
  const isMobile = window.innerWidth <= MEDIA_WIDTHS.upToMedium;
  const { chainId } = useActiveWeb3React();
  const inputRef = useRef<HTMLInputElement>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  // const trackedTokenPairs = useTrackedTokenPairs();
  const v1Pairs = usePairs(allPairs);
  const allPairsLoaded = v1Pairs.map(([, pair]) => pair).filter((v1Pair): v1Pair is Pair => Boolean(v1Pair));
  const pairsWithLiquidity = allPairsLoaded.filter((pair) => pair.reserve0.greaterThan(ZERO));

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
            <AutoRow style={{ padding: '0rem 3rem' }}>
              <TYPE.white width="30%">Pair</TYPE.white>
              <TYPE.white width="15%">Liquidity</TYPE.white>
              <TYPE.white width="15%">24h volume</TYPE.white>
              <TYPE.white width="15%">APY</TYPE.white>
              <TYPE.white width="15%">LP Staking</TYPE.white>
            </AutoRow>
            <Divider />
            {pairsWithLiquidity &&
              pairsWithLiquidity.length > 0 &&
              pairsWithLiquidity.map((pair, index) => (
                <>
                  <MarketCard
                    key={index}
                    pair={pair}
                    stakingAddress={
                      stakingRewardInfos.find((info) => tokenPairsAreEqual(info.tokens, [pair.token0, pair.token1]))
                        ?.stakingRewardAddress
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
