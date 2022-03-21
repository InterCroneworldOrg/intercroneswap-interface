import { JSBI, ZERO } from '@intercroneswap/v2-sdk';
import { Interface, isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useMultipleContractSingleData, useSingleCallResult } from '../multicall/hooks';
import { abi as ISwapV2StakingRewards } from '@intercroneswap/v2-staking/build/StakingRewards.json';
import { useStakingContract } from '../../hooks/useContract';

const ISwapV2StakingRewardsInterface = new Interface(ISwapV2StakingRewards);

export type StakingInfo = {
  balance: JSBI;
  earned: JSBI;
  rewardRate: JSBI;
  rewardsToken: string | undefined;
  stakingToken: string | undefined;
};

export function useTotalStakedAmount(address: string): JSBI {
  const contract = useStakingContract(address);

  const totalSupply = useSingleCallResult(contract, 'totalSupply')?.result?.[0];
  return totalSupply ? JSBI.BigInt(totalSupply.toString()) : ZERO;
}

export function useStakingInfo(rewardsAddress: string, address?: string): StakingInfo | undefined {
  const validatedAddress = useMemo(() => [], [rewardsAddress, address]);

  const contract = useStakingContract(rewardsAddress);
  const balance = useSingleCallResult(contract, 'balanceOf', [address]);
  const earned = useSingleCallResult(contract, 'earned', [address]);
  const rewardRate = useSingleCallResult(contract, 'rewardRate');
  const rewardsToken = useSingleCallResult(contract, 'rewardsToken');
  const stakingToken = useSingleCallResult(contract, 'stakingToken');

  return useMemo(() => {
    let value = balance.result?.[0];
    let amount = value ? JSBI.BigInt(value.toString()) : ZERO;
    const balanceAmount = amount;
    value = earned?.result?.[0];
    amount = value ? JSBI.BigInt(value.toString()) : ZERO;
    const earnedValue = amount;
    value = rewardRate?.result?.[0];
    amount = value ? JSBI.BigInt(value.toString()) : ZERO;
    const rate = amount;

    return {
      balance: balanceAmount,
      earned: earnedValue,
      rewardRate: rate,
      stakingToken: stakingToken?.result?.[0],
      rewardsToken: rewardsToken?.result?.[0],
    };
  }, [validatedAddress, address]);
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

              memo[reward] = {
                balance: balance,
                earned: earnedValue,
                rewardRate: rate,
                rewardsToken: rewardsToken?.[i]?.result?.[0],
                stakingToken: stakingToken?.[i]?.result?.[0],
              };
              return memo;
            }, {})
          : {},
      [address, validatedRewardsAddresses, balances],
    ),
    anyLoading,
  ];
}
