import { abi as ISwapV1PairABI } from '@intercroneswap/v1-core/build/IISwapV1Pair.json';
import { ChainId, CurrencyAmount, JSBI, Pair, Token, TokenAmount, WETH, ZERO } from '@intercroneswap/v2-sdk';
import { abi as ISwapV2StakingRewards } from '@intercroneswap/v2-staking/build/StakingRewards.json';
import { BigNumber } from 'ethers';
import { Interface, isAddress } from 'ethers/lib/utils';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, AppState } from '..';
import { BTT, ICR, USDT } from '../../constants/tokens';
import { useActiveWeb3React } from '../../hooks';
import { useStakingContract } from '../../hooks/useContract';
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp';
import { NEVER_RELOAD, useMultipleContractSingleData, useSingleCallResult } from '../multicall/hooks';
import { tryParseAmount } from '../swap/hooks';
import { typeInput } from './actions';

const PairInterface = new Interface(ISwapV1PairABI);
const ISwapV2StakingRewardsInterface = new Interface(ISwapV2StakingRewards);

export const STAKING_GENESIS = 1647797301;
export const REWARDS_DURATION_DAYS = 14;

interface PairInfo {
  token0: string;
  token1: string;
  reserve0: JSBI;
  reserve1: JSBI;
}

export const STAKING_REWARDS_INFO: {
  [chainId: number]: {
    tokens: [Token, Token];
    stakingRewardAddress: string;
  }[];
} = {
  [ChainId.MAINNET]: [
    {
      tokens: [ICR, WETH[ChainId.MAINNET] as Token],
      stakingRewardAddress: '0xbe3f0022fa68a5eaaf3189825b19d652377420f5',
    },
    {
      tokens: [BTT, ICR],
      stakingRewardAddress: '0x2edb6be332d850e1d0a1abd933f456b3d48a8950',
    },
    {
      tokens: [ICR, USDT],
      stakingRewardAddress: '0xfed67d9da22551895af2bb0d5e8010b28b016917',
    },
  ],
};

export interface StakingInfos {
  stakingRewardAddress: string;
  tokens: [Token, Token];
  stakedAmount: TokenAmount;
  earnedAmount: TokenAmount;
  totalStakedAmount: TokenAmount;
  totalRewardRate: TokenAmount;
  rewardRate: TokenAmount;
  rewardForDuration: TokenAmount;
  periodFinish: Date | undefined;
  active: boolean;
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount,
  ) => TokenAmount;
}

export type StakingInfo = {
  balance: JSBI;
  earned: JSBI;
  rewardRate: JSBI;
  periodFinish: BigNumber;
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
  };
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
  const periodFinish = useMultipleContractSingleData(
    validatedRewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'periodFinish',
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
                periodFinish: periodFinish?.[i]?.result?.[0],
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

export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfos[] {
  const { chainId, account } = useActiveWeb3React();

  // detect if staking is ended
  const currentBlockTimestamp = useCurrentBlockTimestamp();

  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.filter((stakingRewardInfo) =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1]),
          ) ?? []
        : [],
    [chainId, pairToFilterBy],
  );

  const accountArg = useMemo(() => [account ?? undefined], [account]);

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info]);

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(
    rewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'balanceOf',
    accountArg,
  );
  const earnedAmounts = useMultipleContractSingleData(
    rewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'earned',
    accountArg,
  );
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, ISwapV2StakingRewardsInterface, 'totalSupply');

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'rewardRate',
    undefined,
    NEVER_RELOAD,
  );
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'periodFinish',
    undefined,
    NEVER_RELOAD,
  );
  const rewardForDurations = useMultipleContractSingleData(
    rewardsAddresses,
    ISwapV2StakingRewardsInterface,
    'getRewardForDuration',
    undefined,
    NEVER_RELOAD,
  );

  return useMemo(() => {
    if (!chainId) return [];

    return rewardsAddresses.reduce<StakingInfos[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index];
      const earnedAmountState = earnedAmounts[index];

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index];
      const rewardRateState = rewardRates[index];
      const rewardForDurationState = rewardForDurations[index];
      const periodFinishState = periodFinishes[index];

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        rewardForDurationState &&
        !rewardForDurationState.loading &&
        periodFinishState &&
        !periodFinishState.loading
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          rewardForDurationState.error ||
          periodFinishState.error
        ) {
          console.error('Failed to load staking rewards info');
          return memo;
        }

        // get the LP token
        const tokens = info[index].tokens;
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'));

        // check for account, if no account set to 0

        const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0));
        const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(totalSupplyState.result?.[0]));
        const totalRewardRate = new TokenAmount(ICR, JSBI.BigInt(rewardRateState.result?.[0]));
        const rewardForDuration = new TokenAmount(ICR, JSBI.BigInt(rewardForDurationState.result?.[0]));

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount,
        ): TokenAmount => {
          return new TokenAmount(
            ICR,
            JSBI.greaterThan(totalStakedAmount.quotient, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.quotient, stakedAmount.quotient), totalStakedAmount.quotient)
              : JSBI.BigInt(0),
          );
        };

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate);

        const periodFinishSeconds = periodFinishState.result?.[0]?.toNumber();
        const periodFinishMs = periodFinishSeconds * 1000;

        // compare period end timestamp vs current block timestamp (in seconds)
        const active =
          periodFinishSeconds && currentBlockTimestamp ? periodFinishSeconds > currentBlockTimestamp.toNumber() : true;

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: info[index].tokens,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          earnedAmount: new TokenAmount(ICR, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          rewardForDuration,
          totalRewardRate,
          stakedAmount,
          totalStakedAmount,
          getHypotheticalRewardRate,
          active,
        });
      }
      return memo;
    }, []);
  }, [
    balances,
    chainId,
    currentBlockTimestamp,
    earnedAmounts,
    info,
    periodFinishes,
    rewardRates,
    rewardForDurations,
    rewardsAddresses,
    totalSupplies,
    ICR,
  ]);
}

export function useTotalIcrEarned(): TokenAmount | undefined {
  const stakingInfos = useStakingInfo();

  return useMemo(() => {
    return (
      stakingInfos?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(ICR, '0'),
      ) ?? new TokenAmount(ICR, '0')
    );
  }, [stakingInfos]);
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token | undefined,
  userLiquidityUnstaked: TokenAmount | undefined,
): {
  parsedAmount?: CurrencyAmount;
} {
  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken);

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.quotient, userLiquidityUnstaked.quotient)
      ? parsedInput
      : undefined;

  return {
    parsedAmount,
  };
}
