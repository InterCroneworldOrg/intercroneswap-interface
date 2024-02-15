import { createReducer } from '@reduxjs/toolkit';
import { typeInput } from './actions';

export interface StakeState {
  typedValue: string;
}

const initialState: StakeState = {
  typedValue: '',
};

export default createReducer<StakeState>(initialState, (builder) => {
  builder.addCase(typeInput, (state, { payload: { typedValue } }) => {
    return {
      typedValue,
    };
  });
});
