import { JSBI } from '@intercroneswap/v2-sdk';

import { REWARDS_DURATION_DAYS } from '../state/stake/constants';

// Staking Yearly Rate
export const YEARLY_RATE = JSBI.divide(JSBI.BigInt(365), JSBI.BigInt(REWARDS_DURATION_DAYS));