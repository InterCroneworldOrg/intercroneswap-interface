import { CurrencyAmount, Currency, ChainId } from '@intercroneswap/sdk-core';
import { FACTORY_ADDRESS, Pair } from '@intercroneswap/v2-sdk';
import { useMemo, useState } from 'react';
import { abi as ISwapV1PairABI } from '@intercroneswap/v1-core/build/IISwapV1Pair.json';
import { Interface } from '@ethersproject/abi';
import { useActiveWeb3React } from '../hooks';

import { useMultipleContractSingleData } from '../state/multicall/hooks';
import { wrappedCurrency } from '../utils/wrappedCurrency';
import tronWeb from 'tronweb';
import { ethAddress } from '@intercroneswap/java-tron-provider';
const PAIR_INTERFACE = new Interface(ISwapV1PairABI);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}
async function queryPair(
  tokenA: string | undefined,
  tokenB: string | undefined,
  chainId: ChainId | undefined,
): Promise<string | undefined> {
  if (window.tronWeb && chainId) {
    //@ts-ignore
    const factoryContract = await window.tronWeb?.contract().at(ethAddress.toTron(FACTORY_ADDRESS));
    if (tokenA && tokenB && factoryContract) {
      const pairAddress = await factoryContract.getPair(tokenA, tokenB).call();
      if (tronWeb.isAddress(pairAddress)) {
        return ethAddress.fromTron(pairAddress);
      } else {
        return '0x0000000000000000000000000000000000000000';
      }
    }
  }
  return undefined;
}
export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React();
  const [pairAddresses, setPairAddresses] = useState<(string | undefined)[]>([]);
  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  );

  useMemo(() => {
    const callTokens = tokens.map(([tokenA, tokenB]) => {
      return [tokenA?.address, tokenB?.address];
    });

    Promise.all(
      callTokens.map(([tokenA, tokenB]) => {
        return queryPair(tokenA, tokenB, chainId);
      }),
    ).then((res) => {
      setPairAddresses(res);
    });
  }, [JSON.stringify(tokens)]);

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');

  return useMemo(() => {
    return tokens.map(([tokenA, tokenB], i) => {
      const { result: reserves, loading } = results[i] || {};

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
        ),
      ];
    });
  }, [results, pairAddresses, JSON.stringify(tokens)]);
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0];
}
