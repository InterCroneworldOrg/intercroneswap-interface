import { JSBI, ZERO } from '@intercroneswap/v2-sdk';
import { Interface, isAddress } from 'ethers/lib/utils';
import { useCallback, useMemo } from 'react';
import { useMultipleContractSingleData, useSingleCallResult } from '../multicall/hooks';
import { abi as ISwapV2StakingRewards } from '@intercroneswap/v2-staking/build/StakingRewards.json';
import { abi as ISwapV1PairABI } from '@intercroneswap/v1-core/build/IISwapV1Pair.json';
import { useStakingContract } from '../../hooks/useContract';
import { AppDispatch, AppState } from '..';
import { useDispatch, useSelector } from 'react-redux';
import { typeInput } from './actions';

const PairInterface = new Interface(ISwapV1PairABI);
const ISwapV2StakingRewardsInterface = new Interface(ISwapV2StakingRewards);

interface PairInfo {
  token0: string;
  token1: string;
  reserve0: JSBI;
  reserve1: JSBI;
}

export type StakingInfo = {
  balance: JSBI;
  earned: JSBI;
  rewardRate: JSBI;
  rewardsToken: string | undefined;
  stakingToken: string | undefined;
  stakingPair: PairInfo | undefined;
};

export function useStakeState(): AppState['stake'] {
  return useSelector<AppState, AppState['stake']>((state) => state.stake);
}

export function useStakeActionHandlers(): {
  onUserInput: (typedValue: string) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onFieldChange = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ typedValue }));
    },
    [dispatch],
  );

  return {
    onUserInput: onFieldChange,
  }
}

export function useTotalStakedAmount(address: string): JSBI {
  const contract = useStakingContract(address);

  const totalSupply = useSingleCallResult(contract, 'totalSupply')?.result?.[0];
  return totalSupply ? JSBI.BigInt(totalSupply.toString()) : ZERO;
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useStakingBalancesWithLoadingIndicator(
  rewardsAddresses: string[],
  address?: string,
): [{ [stakingAddress: string]: StakingInfo }, boolean] {
  const validatedRewardsAddresses: string[] = useMemo(
    () => rewardsAddresses?.filter((r) => isAddress(r) !== false) ?? [],
    [rewardsAddresses],
  );

  const balances = useMultipleContractSingleData(
    validatedRewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'balanceOf',
    [address],
  );
  const earned = useMultipleContractSingleData(validatedRewardsAddresses, ISwapV2StakingRewardsInterface, 'earned', [
    address,
  ]);
  const rewardRate = useMultipleContractSingleData(
    validatedRewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'rewardRate',
  );
  const rewardsToken = useMultipleContractSingleData(
    validatedRewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'rewardsToken',
  );
  const stakingToken = useMultipleContractSingleData(
    validatedRewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'stakingToken',
  );
  const stakingPools = stakingToken?.map((stakingToken) => stakingToken?.result?.[0]);
  const stakingPoolToken0 = useMultipleContractSingleData(stakingPools, PairInterface, 'token0');
  const stakingPoolToken1 = useMultipleContractSingleData(stakingPools, PairInterface, 'token1');
  const stakingPoolReserves = useMultipleContractSingleData(stakingPools, PairInterface, 'getReserves');

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances]);

  return [
    useMemo(
      () =>
        address && validatedRewardsAddresses.length > 0
          ? validatedRewardsAddresses.reduce<{ [rewardsAddresses: string]: StakingInfo }>((memo, reward, i) => {
              let value = balances?.[i]?.result?.[0];
              let amount = value ? JSBI.BigInt(value.toString()) : ZERO;
              const balance = amount;
              value = earned?.[i]?.result?.[0];
              amount = value ? JSBI.BigInt(value.toString()) : ZERO;
              const earnedValue = amount;
              value = rewardRate?.[i]?.result?.[0];
              amount = value ? JSBI.BigInt(value.toString()) : ZERO;
              const rate = amount;

              value = stakingPoolReserves?.[i]?.result?.reserve0;
              const reserve0 = value ? JSBI.BigInt(value.toString()) : ZERO;
              value = stakingPoolReserves?.[i]?.result?.reserve1;
              const reserve1 = value ? JSBI.BigInt(value.toString()) : ZERO;

              memo[reward] = {
                balance: balance,
                earned: earnedValue,
                rewardRate: rate,
                rewardsToken: rewardsToken?.[i]?.result?.[0],
                stakingToken: stakingToken?.[i]?.result?.[0],
                stakingPair: {
                  token0: stakingPoolToken0?.[i]?.result?.[0],
                  token1: stakingPoolToken1?.[i]?.result?.[0],
                  reserve0,
                  reserve1,
                },
              };
              return memo;
            }, {})
          : {},
      [address, validatedRewardsAddresses, balances],
    ),
    anyLoading,
  ];
}
