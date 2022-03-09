import { BigNumber } from 'ethers';
import { useSingleCallResult } from '../state/multicall/hooks';
import { useMulticallContract } from './useContract';

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const multicall = useMulticallContract();
  // TODO: need to change this as well, to only call it once every 2 seconds, otherwise from cache
  console.log('calling multicall for time');
  return useSingleCallResult(multicall, 'getCurrentBlockTimestamp')?.result?.[0];
}
