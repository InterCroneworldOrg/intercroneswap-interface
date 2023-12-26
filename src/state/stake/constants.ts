import { ChainId, Token, WETH } from '@intercroneswap/v2-sdk'
import tokens from 'config/constants/tokens'

export const REWARDS_DURATION_DAYS = 180
export const REWARDS_DURATION_DAYS_180 = 180

export interface StakingRewardsInfo {
  tokens: [Token, Token]
  stakingRewardAddress: string
  rewardsDays: number
}

const { usdt: BUSD, wvc: WBNB } = tokens

export const STAKING_REWARDS_INFO: {
  [chainId: number]: StakingRewardsInfo[]
} = {
  [ChainId.MAINNET]: [
    {
      tokens: [WBNB, WETH[ChainId.MAINNET] as Token],
      stakingRewardAddress: '0xbe3f0022fa68a5eaaf3189825b19d652377420f5',
      rewardsDays: REWARDS_DURATION_DAYS,
    },
    {
      tokens: [WBNB, BUSD],
      stakingRewardAddress: '0xfed67d9da22551895af2bb0d5e8010b28b016917',
      rewardsDays: REWARDS_DURATION_DAYS,
    },
  ],
  [ChainId.TESTNET]: [
    {
      tokens: [WBNB, BUSD],
      stakingRewardAddress: '0x4BF2513E3C0917C88b1aC2F6dAB53736C6626039',
      rewardsDays: REWARDS_DURATION_DAYS,
    },
  ],
}
