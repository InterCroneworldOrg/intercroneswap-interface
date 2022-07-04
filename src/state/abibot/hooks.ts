import { useSelector } from 'react-redux';
import { AppState } from '..';

export function useAbiBotState(): AppState['abibot'] {
  return useSelector<AppState, AppState['abibot']>((state) => state.abibot);
}
