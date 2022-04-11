import { Currency, ETHER, JSBI, TokenAmount } from '@intercroneswap/v2-sdk';
import { useCallback, useEffect, useState, useContext } from 'react';
import { Plus } from 'react-feather';
import { ButtonDropdownLight } from '../../components/Button';
import { LightCard } from '../../components/Card';
import { AutoColumn, ColumnCenter } from '../../components/Column';
import CurrencyLogo from '../../components/CurrencyLogo';
import { FindPoolTabs } from '../../components/NavigationTabs';
import { MinimalPositionCard } from '../../components/PositionCard';
import Row from '../../components/Row';
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal';
import { PairState, usePair } from '../../data/Reserves';
import { useActiveWeb3React } from '../../hooks';
import { usePairAdder } from '../../state/user/hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { StyledInternalLink, TYPE } from '../../theme';
import { currencyId } from '../../utils/currencyId';
import AppBody from '../AppBody';
import { Dots } from '../Pool/styleds';
import { ThemeContext } from 'styled-components';
// import styled from 'styled-components';
// const AppBodyContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;

// const BelowAppbody = styled.div`
//   margin: 15px 44px;
//   border-radius: 40px 116px 0 0;
//   box-sizing: border-box;
//   background-color: cyan;
//   box-shadow: 159px -17px 150px 73px #2d72ffc2, 11px 33px 56px 13px rgb(249 115 65 / 0%);
//   // box-shadow:  ${({ theme }) =>
//     `-34px -16px 176px 80px ${theme.cardsBoxShadowTopLeftcorner}, -9px 33px 56px 13px ${theme.cardsBoxShadowTopleftCorner1}`};
//   // box-shadow: -6px 23px 150px 73px rgb(249,115,65,0.5), -9px 33px 56px 21px rgb(249 115 65 / 0%);
// `;

// const BelowAppbody1 = styled.div`
// margin: -28px -34px;
// border-radius: 40px 116px 0 0;
// box-sizing: border-box;
// background-color: cyan;
// box-shadow:  ${({ theme }) => `10px -3px 136px 41px ${theme.cardsBoxShadowTopRightcorner}, -15px 28px 140px 11px ${theme.cardsBoxShadowTopRightCorner1}`}
// // box-shadow: 10px -3px 136px 41px rgb(95,179,71), -15px 28px 140px 11px rgb(95,179,71);
// `

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { account } = useActiveWeb3React();
  const theme = useContext(ThemeContext);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined);
  const addPair = usePairAdder();
  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0)),
    );

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken);
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)));

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField],
  );

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false);
  }, [setShowSearch]);

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <TYPE.white textAlign="center">
        {!account ? 'Connect to a wallet to find pools' : 'Select a token to find your liquidity.'}
      </TYPE.white>
    </LightCard>
  );

  return (
    <AppBody>
      {/* <AppBodyContainer>
        <BelowAppbody></BelowAppbody>
      </AppBodyContainer> */}
      {/* <BelowAppbody1></BelowAppbody1> */}
      <FindPoolTabs />
      <AutoColumn gap="md">
        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true);
            setActiveField(Fields.TOKEN0);
          }}
        >
          {currency0 ? (
            <Row>
              <CurrencyLogo currency={currency0} />
              <TYPE.white fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {currency0.symbol}
              </TYPE.white>
            </Row>
          ) : (
            <TYPE.white fontWeight={500} fontSize={20} marginLeft={'12px'}>
              Select a Token
            </TYPE.white>
          )}
        </ButtonDropdownLight>

        <ColumnCenter>
          <Plus size="16" color="#888D9B" />
        </ColumnCenter>

        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true);
            setActiveField(Fields.TOKEN1);
          }}
        >
          {currency1 ? (
            <Row>
              <CurrencyLogo currency={currency1} />
              <TYPE.white fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {currency1.symbol}
              </TYPE.white>
            </Row>
          ) : (
            <TYPE.white fontWeight={500} fontSize={20} marginLeft={'12px'}>
              Select a Token
            </TYPE.white>
          )}
        </ButtonDropdownLight>

        {hasPosition && (
          <ColumnCenter
            style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
          >
            <TYPE.white textAlign="center" fontWeight={500}>
              Pool Found!
            </TYPE.white>
            <StyledInternalLink to={`/pool`}>
              <TYPE.white textAlign="center" color={theme.yellow2}>
                Manage this pool.
              </TYPE.white>
            </StyledInternalLink>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
            ) : (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <TYPE.white textAlign="center">You don’t have liquidity in this pool yet.</TYPE.white>
                  <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <TYPE.white textAlign="center">Add liquidity.</TYPE.white>
                  </StyledInternalLink>
                </AutoColumn>
              </LightCard>
            )
          ) : validPairNoLiquidity ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <TYPE.white textAlign="center">No pool found.</TYPE.white>
                <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  <TYPE.white textAlign="center" color={theme.primary3}>
                    Create pool.
                  </TYPE.white>
                </StyledInternalLink>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.INVALID ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <TYPE.white textAlign="center" fontWeight={500}>
                  Invalid pair.
                </TYPE.white>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.LOADING ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <TYPE.white textAlign="center">
                  Loading
                  <Dots />
                </TYPE.white>
              </AutoColumn>
            </LightCard>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </AutoColumn>

      <CurrencySearchModal
        isOpen={showSearch}
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
        showCommonBases
        selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
      />
    </AppBody>
  );
}
