import { createAction } from '@reduxjs/toolkit';

export const typeInput = createAction<{ typedValue: string }>('stake/typeInput');
export const setTxHash = createAction<{ txHash: string }>('stake/setTxHash');
export const setAttemptingTxn = createAction<{ attemptingTxn: boolean }>('stake/setAttemptingTxattemptingTxn');
