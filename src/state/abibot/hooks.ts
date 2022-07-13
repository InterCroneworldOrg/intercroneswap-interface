import { useActiveWeb3React } from '../../hooks';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '..';
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks';
import { setAttemptingTxn, setTxHash, typeInput } from './actions';
import { abi as AbiSwapICR } from '@intercroneswap/v2-abitragenft/build/AbiSwapICR.json';
import { Interface } from 'ethers/lib/utils';
import { ChainId, TokenAmount, WETH } from '@intercroneswap/v2-sdk';

const AbiSwapICRInterface = new Interface(AbiSwapICR);

export interface ArbiNFTInfo {
  cost: TokenAmount;
  name: string;
  mintAddress: string;
  baseURI: string;
  maxMintAmount: number;
  maxMintPerTransaction: number;
  totalSupply: number;
}

export function useAbiBotState(): AppState['abibot'] {
  return useSelector<AppState, AppState['abibot']>((state) => state.abibot);
}

export function useAbiBotActionHandlers(): {
  onUserInput: (typedValue: string) => void;
  onTxHashChange: (hashValue: string) => void;
  onAttemptingTxn: (attmeping: boolean) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onFieldChange = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ typedValue }));
    },
    [dispatch],
  );

  const onAttemptingTxn = useCallback(
    (attemptingTxn: boolean) => {
      dispatch(setAttemptingTxn({ attemptingTxn }));
    },
    [dispatch],
  );

  const onTxHashChange = useCallback((hash: string) => dispatch(setTxHash({ txHash: hash })), [dispatch]);

  return {
    onUserInput: onFieldChange,
    onAttemptingTxn,
    onTxHashChange,
  };
}

export function useAbiBotMintInfo(nftAddresses: string[]): ArbiNFTInfo[] {
  const { chainId, account } = useActiveWeb3React();

  const accountArg = useMemo(() => [account ?? undefined], [account]);

  const costs = useMultipleContractSingleData(nftAddresses, AbiSwapICRInterface, 'cost', undefined, NEVER_RELOAD);

  const names = useMultipleContractSingleData(nftAddresses, AbiSwapICRInterface, 'name', undefined, NEVER_RELOAD);

  const maxMintAmounts = useMultipleContractSingleData(
    nftAddresses,
    AbiSwapICRInterface,
    'maxMintAmount',
    undefined,
    NEVER_RELOAD,
  );

  const maxMintPerTransactions = useMultipleContractSingleData(
    nftAddresses,
    AbiSwapICRInterface,
    'maxMintPerTransaction',
    undefined,
    NEVER_RELOAD,
  );

  const baseURIs = useMultipleContractSingleData(nftAddresses, AbiSwapICRInterface, 'baseURI', undefined, NEVER_RELOAD);

  const totalSupplies = useMultipleContractSingleData(nftAddresses, AbiSwapICRInterface, 'totalSupply', undefined);

  return useMemo(() => {
    if (!chainId) return [];

    return nftAddresses.reduce<ArbiNFTInfo[]>((memo, nftAddress, index) => {
      const costState = costs[index];
      const maxMintAmountState = maxMintAmounts[index];
      const maxMintPerTransactionState = maxMintPerTransactions[index];
      const totalSupplyState = totalSupplies[index];
      const baseURIState = baseURIs[index];
      const nameState = names[index];

      if (
        costState &&
        !costState.loading &&
        nameState &&
        !nameState.loading &&
        maxMintAmountState &&
        !maxMintAmountState.loading &&
        maxMintPerTransactionState &&
        !maxMintPerTransactionState.loading &&
        totalSupplyState &&
        !totalSupplyState.loading &&
        baseURIState &&
        !baseURIState.loading
      ) {
        if (
          costState.error ||
          nameState.error ||
          maxMintAmountState.error ||
          maxMintPerTransactionState.error ||
          totalSupplyState.error ||
          baseURIState.error
        ) {
          console.error('Failed to load arbi nft info');
          return memo;
        }

        const ethTokenAmount = new TokenAmount(WETH[chainId ?? ChainId.MAINNET], costState?.result?.[0]);

        memo.push({
          cost: ethTokenAmount,
          name: nameState?.result?.[0],
          baseURI: baseURIState?.result?.[0],
          mintAddress: nftAddress,
          maxMintAmount: maxMintAmountState?.result?.[0]?.toNumber() ?? 0,
          maxMintPerTransaction: maxMintPerTransactionState?.result?.[0]?.toNumber() ?? 0,
          totalSupply: totalSupplyState?.result?.[0]?.toNumber() ?? 0,
        });
      }

      return memo;
    }, []);
  }, [chainId, totalSupplies, maxMintAmounts, maxMintPerTransactions, costs, names, accountArg]);
}
