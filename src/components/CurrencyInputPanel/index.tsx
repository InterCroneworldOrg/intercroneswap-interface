import { Currency, ETHER, Pair } from '@intercroneswap/v2-sdk';
import { useState, useContext, useCallback } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { darken } from 'polished';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal';
import CurrencyLogo from '../CurrencyLogo';
import DoubleCurrencyLogo from '../DoubleLogo';
import { AutoRow, RowBetween } from '../Row';
import { TYPE } from '../../theme';
import { ethAddress } from '@intercroneswap/java-tron-provider';
import { Input as NumericalInput } from '../NumericalInput';
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg';

import { useActiveWeb3React } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { useAllLists } from '../../state/lists/hooks';
import { registerToken } from '../../utils/wallet';
import { wrappedCurrency } from '../../utils/wrappedCurrency';
import { TronlinkIcon } from '../Svg/Icons/tronlink';
import { ButtonEmpty } from '../Button';
import CopyHelper from '../AccountDetails/Copy';

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  flex-direction: column-reverse !important;
  justify-content: space-between;
  /* padding: ${({ selected }) => (selected ? '0.75rem 0rem 0.75rem 0rem' : '0.75rem 0rem 0.75rem 0rem')}; */
`;

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 3.5rem;
  // height: 40px;
  font-size: 20px;
  width: 162px;
  font-weight: 400;
  // background-color: #707070;
  // background: #2B2626;
  box-shadow: inset 6px 10px 12px 197px rgba(255, 255, 255, 0.1) !important;
  // filter: blur(0.4px) !important;
  background: ${({ selected, theme }) => (selected ? theme.bg1 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.black)};
  // border-radius: 12px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    // background-color: #2B2626;
    border: 1px solid ${({ theme }) => theme.primary3};
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary3))};
  }
`;

// const LabelRow = styled.div`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: center;
//   color: ${({ theme }) => theme.text1};
//   font-size: 0.75rem;
//   line-height: 1rem;
//   padding: 0.75rem 1rem 0 1rem;
//   span:hover {
//     cursor: pointer;
//     color: ${({ theme }) => darken(0.2, theme.text2)};
//   }
// `;

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;
  width: 15px;
  g {
    fill: #ffffff;
    opacity: 0.3;
  }
  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.black)};
    stroke-width: 1.5px;
  }
`;

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  // background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`;

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  // border: 1px solid ${({ theme }) => theme.bg2};
  // background-color: ${({ theme }) => theme.bg1};
`;

const StyledTokenName = styled.span<{ active?: boolean }>`
  // ${({ active }) => (active ? '  margin: 0 6.65rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size: ${({ active }) => (active ? '17px' : '15px')};
  flex-grow: 1;
  text-align: left;
  margin-left: 0.5rem;
`;

const CurrencySelectContainer = styled.div`
  width: 100%;
`;
const InputWrapper = styled.div`
  margin-top: 10px;
  width: 100%;
`;

// const StyledBalanceMax = styled.button`
//   height: 28px;
//   background-color: ${({ theme }) => theme.primary5};
//   border: 1px solid ${({ theme }) => theme.primary5};
//   border-radius: 0.5rem;
//   font-size: 0.875rem;

//   font-weight: 500;
//   cursor: pointer;
//   margin-right: 0.5rem;
//   color: ${({ theme }) => theme.primaryText1};
//   :hover {
//     border: 1px solid ${({ theme }) => theme.primary3};
//   }
//   :focus {
//     border: 1px solid ${({ theme }) => theme.primary3};
//     outline: none;
//   }

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     margin-right: 0.5rem;
//   `};
// `

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  customBalanceText?: string;
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  // showMaxButton,
  // label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const { chainId, account } = useActiveWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined);
  const theme = useContext(ThemeContext);
  const allTokens = useAllLists();
  const token = currency && wrappedCurrency(currency, chainId);

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <InputPanel id={id} className="tokenMain">
      <Container hideInput={hideInput}>
        {/* {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={onMax}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6)
                    : ' -'}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )} */}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <InputWrapper>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val);
                }}
              />
              {/* {account && currency && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )} */}
            </InputWrapper>
          )}
          <CurrencySelectContainer className="tokenBg">
            <RowBetween>
              <AutoRow gap="3px">
                <CurrencySelect
                  selected={!!currency}
                  className="open-currency-select-button"
                  onClick={() => {
                    if (!disableCurrencySelect) {
                      setModalOpen(true);
                    }
                  }}
                >
                  <Aligner>
                    {pair ? (
                      <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
                    ) : currency ? (
                      <CurrencyLogo currency={currency} size={'24px'} />
                    ) : null}
                    {pair ? (
                      <StyledTokenName className="pair-name-container">
                        {pair?.token0.symbol}:{pair?.token1.symbol}
                      </StyledTokenName>
                    ) : (
                      <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                        {(currency && currency.symbol && currency.symbol.length > 20
                          ? currency.symbol.slice(0, 4) +
                            '...' +
                            currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                          : currency?.symbol) || t('selectToken')}
                      </StyledTokenName>
                    )}
                    {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
                  </Aligner>
                </CurrencySelect>
                {currency !== ETHER && token && token.symbol && (
                  <>
                    <CopyHelper toCopy={ethAddress.toTron(token.address)} />
                    <ButtonEmpty
                      onClick={() => registerToken(token.address, token.symbol ?? '', token.decimals, allTokens)}
                      style={{ alignSelf: 'flex-end', width: '20px' }}
                    >
                      <TronlinkIcon />
                    </ButtonEmpty>
                  </>
                )}
              </AutoRow>
              {!hideBalance && (
                <div>
                  <TYPE.body color={theme.primary3} textAlign={'right'} fontWeight={500} fontSize={14}>
                    Balance
                  </TYPE.body>
                  {account && (
                    <TYPE.body
                      onClick={onMax}
                      color={theme.text1}
                      fontWeight={500}
                      fontSize={24}
                      style={{ display: 'inline', cursor: 'pointer' }}
                    >
                      {!hideBalance && !!currency && selectedCurrencyBalance
                        ? (customBalanceText ?? '') + selectedCurrencyBalance?.toSignificant(6)
                        : ' -'}
                    </TYPE.body>
                  )}
                </div>
              )}
            </RowBetween>
          </CurrencySelectContainer>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  );
}
