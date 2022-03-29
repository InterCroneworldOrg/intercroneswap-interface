import { ChainId } from '@intercroneswap/v2-sdk';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  // TODO: TRON: mainnet multicall contract address
  // [ChainId.MAINNET]: '0x9037ae53c89147e009d26f7547143544be00f984',
  [ChainId.MAINNET]: '0xD3573a8728A49512A1485D63180Ed5b095e11D5C',
  [ChainId.DONAU]: '0x968F2Ce6464E05afDe6c898AD752cf31Cf69b8A2',
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
