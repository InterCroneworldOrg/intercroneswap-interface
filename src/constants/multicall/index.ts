import { ChainId } from '@intercroneswap/v2-sdk';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x89a963BB4eD57eA1A99E765f12b8ed6DA6847760',
  [ChainId.TESTNET]: 'TODO',
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
