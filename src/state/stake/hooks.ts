import { JSBI, ZERO } from '@intercroneswap/v2-sdk';
import { Interface, isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useMultipleContractSingleData } from '../multicall/hooks';
import { abi as ISwapV2StakingRewards } from '@intercroneswap/v2-staking/build/StakingRewards.json';

const ISwapV2StakingRewardsInterface = new Interface(ISwapV2StakingRewards);

export type StakingInfo = {
  balance: JSBI;
  earned: JSBI;
  rewardRate: JSBI;
  rewardsToken: string | undefined;
  stakingToken: string | undefined;
};

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
