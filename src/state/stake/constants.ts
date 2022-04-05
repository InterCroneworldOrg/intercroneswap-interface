import { ChainId, Token, WETH } from '@intercroneswap/v2-sdk';
import { ICR, BTT, USDT } from '../../constants/tokens';

export const REWARDS_DURATION_DAYS = 14;
export const REWARDS_DURATION_DAYS_180 = 180;

export const STAKING_REWARDS_INFO: {
  [chainId: number]: {
    tokens: [Token, Token];
    stakingRewardAddress: string;
    rewardsDays: number;
  }[];
} = {
  [ChainId.MAINNET]: [
    {
      tokens: [ICR, WETH[ChainId.MAINNET] as Token],
      stakingRewardAddress: '0xbe3f0022fa68a5eaaf3189825b19d652377420f5',
      rewardsDays: REWARDS_DURATION_DAYS,
    },
    {
      tokens: [BTT, ICR],
      stakingRewardAddress: '0x2edb6be332d850e1d0a1abd933f456b3d48a8950',
      rewardsDays: REWARDS_DURATION_DAYS,
    },
    {
      tokens: [ICR, USDT],
      stakingRewardAddress: '0xfed67d9da22551895af2bb0d5e8010b28b016917',
      rewardsDays: REWARDS_DURATION_DAYS,
    },
    {
      tokens: [WETH[ChainId.MAINNET], USDT],
      stakingRewardAddress: '0xe16f5a0e7ba73628b9ba2684dee0e2a5ec586267',
      rewardsDays: REWARDS_DURATION_DAYS_180,
    },
  ],
};
