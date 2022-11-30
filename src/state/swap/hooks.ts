import useENS from '../../hooks/useENS';
import { Version } from '../../hooks/useToggledVersion';
import { parseUnits } from '@ethersproject/units';
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount, Trade } from '@intercroneswap/v2-sdk';
import { ParsedQs } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useVTrade } from '../../data/V';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency } from '../../hooks/Tokens';
import { useTradeExactIn, useTradeExactOut } from '../../hooks/Trades';
import useParsedQueryString from '../../hooks/useParsedQueryString';
import { isAddress } from '../../utils';
import { AppDispatch, AppState } from '../index';
import { useCurrencyBalances } from '../wallet/hooks';
import { Field, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions';
import { SwapState } from './reducer';
import useToggledVersion from '../../hooks/useToggledVersion';
import { useUserSlippageTolerance } from '../user/hooks';
import { computeSlippageAdjustedAmounts } from '../../utils/prices';
import { ACTUAL_LAUCH_TOKEN } from '../../constants';

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>((state) => state.swap);
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onChangeRecipient: (recipient: string | null) => void;
} {
  const dispatch = useDispatch<AppDispatch>();
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'TRX' : '',
        }),
      );
    },
    [dispatch],
  );

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch],
  );

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }));
    },
    [dispatch],
  );

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  };
}

// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0x8ef0b222b634cb81c2b8cb1a82a368d21a868c61', // v1 factory 0x8ef0b222b634cb81c2b8cb1a82a368d21a868c61
  '0x404A895237C97B75d4Cf96C8Ad9760687692613A', // v1 router 01 0x404A895237C97B75d4Cf96C8Ad9760687692613A
  '0x093a9fa8b6bb0395fd2568f11a9325d882a69b55', // v1 router 02 0x093a9fa8b6bb0395fd2568f11a9325d882a69b55
];

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
  );
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount };
  parsedAmount: CurrencyAmount | undefined;
  v1Trade: Trade | undefined;
  inputError?: string;
  vTrade: Trade | undefined;
} {
  const { account } = useActiveWeb3React();

  const toggledVersion = useToggledVersion();

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const recipientLookup = useENS(recipient ?? undefined);
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null;

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined);

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined);
  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined);

  const v1Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  // get link to trade on v, if a better rate exists
  const vTrade = useVTrade(isExactIn, currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmount);

  let inputError: string | undefined;
  if (!account) {
    inputError = 'Connect Wallet';
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount';
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? 'Select a token';
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? 'Enter a recipient';
  } else {
    if (
      BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
      inputError = inputError ?? 'Invalid recipient';
    }
  }

  const [allowedSlippage] = useUserSlippageTolerance();

  const slippageAdjustedAmounts =
    v1Trade && allowedSlippage && computeSlippageAdjustedAmounts(v1Trade, allowedSlippage);

  const slippageAdjustedAmountsV = vTrade && allowedSlippage && computeSlippageAdjustedAmounts(vTrade, allowedSlippage);

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    toggledVersion === Version.v
      ? slippageAdjustedAmountsV
        ? slippageAdjustedAmountsV[Field.INPUT]
        : null
      : slippageAdjustedAmounts
      ? slippageAdjustedAmounts[Field.INPUT]
      : null,
  ];

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = 'Insufficient ' + amountIn.currency.symbol + ' balance';
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v1Trade: v1Trade ?? undefined,
    inputError,
    vTrade,
  };
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam);
    if (valid) return valid;
    if (urlParam.toUpperCase() === 'TRX') return 'TRX';
    if (valid === false) return 'TRX';
  }
  return 'TRX' ?? '';
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : '';
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT;
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null;
  const address = isAddress(recipient);
  if (address) return address;
  if (ENS_NAME_REGEX.test(recipient)) return recipient;
  if (ADDRESS_REGEX.test(recipient)) return recipient;
  return null;
}

export function queryParametersToSwapState(parsedQs: ParsedQs): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency);
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency);
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = '';
    } else {
      outputCurrency = '';
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient);

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
  };
}

export function useDefaultsForLaunchPad():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >();
  useEffect(() => {
    if (!chainId) return;

    dispatch(
      replaceSwapState({
        typedValue: '',
        field: Field.INPUT,
        inputCurrencyId: 'TRX',
        outputCurrencyId: ACTUAL_LAUCH_TOKEN.address,
        recipient: null,
      }),
    );

    setResult({ inputCurrencyId: 'TRX', outputCurrencyId: ACTUAL_LAUCH_TOKEN.address });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId]);

  return result;
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const parsedQs = useParsedQueryString();
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >();

  useEffect(() => {
    if (!chainId) return;
    const parsed = queryParametersToSwapState(parsedQs);

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: parsed.recipient,
      }),
    );

    setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId]);

  return result;
}
