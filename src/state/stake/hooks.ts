import { JSBI } from '@intercroneswap/v2-sdk';
import { Interface, isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useMultipleContractSingleData } from '../multicall/hooks';
import { abi as ISwapV2StakingRewards } from '@intercroneswap/v2-staking/build/StakingRewards.json';

const ISwapV2StakingRewardsInterface = new Interface(ISwapV2StakingRewards);

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useStakingBalancesWithLoadingIndicator(
  rewardsAddresses: string[],
  address?: string,
): [{ [stakingAddress: string]: JSBI | undefined }, boolean] {
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

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances]);

  return [
    useMemo(
      () =>
        address && validatedRewardsAddresses.length > 0
          ? validatedRewardsAddresses.reduce<{ [rewardsAddresses: string]: JSBI | undefined }>((memo, reward, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? JSBI.BigInt(value.toString()) : undefined;
              if (amount) {
                memo[reward] = amount;
              }
              return memo;
            }, {})
          : {},
      [address, validatedRewardsAddresses, balances],
    ),
    anyLoading,
  ];
}
