import { ChainId, Token, WETH } from '@intercroneswap/v2-sdk';
import { ICR, WBNB, BUSD, BTT } from '../../constants/tokens';

export const REWARDS_DURATION_DAYS = 14;
export const REWARDS_DURATION_DAYS_180 = 180;

interface StakingRewardsInfo {
  tokens: [Token, Token];
  stakingRewardAddress: string;
  rewardsDays: number;
}

export const STAKING_REWARDS_INFO: {
  [chainId: number]: StakingRewardsInfo[];
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
      tokens: [ICR, BUSD],
      stakingRewardAddress: '0xfed67d9da22551895af2bb0d5e8010b28b016917',
      rewardsDays: REWARDS_DURATION_DAYS,
    },
    // {
    //   tokens: [WETH[ChainId.MAINNET], USDT],
    //   stakingRewardAddress: '0xe16f5a0e7ba73628b9ba2684dee0e2a5ec586267',
    //   rewardsDays: REWARDS_DURATION_DAYS_180,
    // },
  ],
  [ChainId.TESTNET]: [
    {
      tokens: [BTT, ICR],
      stakingRewardAddress: '0xfA0DB80d4776A702E5a4792acdE4BDc81c254eD6',
      rewardsDays: REWARDS_DURATION_DAYS_180,
    },
    {
      tokens: [WBNB, ICR],
      stakingRewardAddress: '0x4BF2513E3C0917C88b1aC2F6dAB53736C6626039',
      rewardsDays: REWARDS_DURATION_DAYS,
    },
  ],
};

// export const STAKING_REWARDS_INFO_P1: {
//   [chainId: number]: StakingRewardsInfo[];
// } = {
//   [ChainId.MAINNET]: [
//     // ICR Staking
//     {
//       tokens: [ICR, BTC],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [ICR, ETH],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [ICR, WIN],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [ICR, BTT],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [ICR, SUN],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [ICR, JST],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [ICR, USDT],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     // TRX Staking
//     {
//       tokens: [WETH[ChainId.MAINNET] as Token, ICR],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [WETH[ChainId.MAINNET] as Token, WIN],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [WETH[ChainId.MAINNET] as Token, BTT],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [WETH[ChainId.MAINNET] as Token, SUN],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [WETH[ChainId.MAINNET] as Token, NFT],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [WETH[ChainId.MAINNET] as Token, JST],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [WETH[ChainId.MAINNET] as Token, TURU],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     // USDT Staking
//     {
//       tokens: [USDT, WETH[ChainId.MAINNET]],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [USDT, ICR],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [USDT, WIN],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [USDT, BTT],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [USDT, SUN],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [USDT, NFT],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//     {
//       tokens: [USDT, JST],
//       stakingRewardAddress: '',
//       rewardsDays: REWARDS_DURATION_DAYS_180,
//     },
//   ],
// };
