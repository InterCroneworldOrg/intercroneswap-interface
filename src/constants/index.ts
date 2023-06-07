import { JSBI } from '@intercroneswap/v2-sdk'

// Staking Yearly Rate
export const YEARLY_RATE = (rewardDuration: number) => JSBI.divide(JSBI.BigInt(365), JSBI.BigInt(rewardDuration))
