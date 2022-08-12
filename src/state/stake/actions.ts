/* eslint-disable import/no-cycle */
import { createAction } from '@reduxjs/toolkit'
import { StakeState } from './reducer'

export const typeInput = createAction<StakeState>('stake/typeInput')
