import { createReducer } from '@reduxjs/toolkit';
import { setAttemptingTxn, setTxHash, typeInput } from './actions';

export interface StakeState {
  typedValue: string;
  attemptingTxn: boolean;
  txHash: string;
}

const initialState: StakeState = {
  typedValue: '',
  txHash: '',
  attemptingTxn: false,
};

export default createReducer<StakeState>(initialState, (builder) => {
  builder.addCase(typeInput, (state, { payload: { typedValue } }) => {
    return {
      ...state,
      typedValue,
    };
  });
  builder.addCase(setTxHash, (state, { payload: { txHash } }) => {
    return {
      ...state,
      txHash,
    };
  });
  builder.addCase(setAttemptingTxn, (state, { payload: { attemptingTxn } }) => {
    return {
      ...state,
      attemptingTxn,
    };
  });
});
