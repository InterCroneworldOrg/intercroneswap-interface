/// <reference types="react-scripts" />

declare module 'jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement;
}

declare module 'fortmatic';
interface Ethereum {
  isMetaMask?: true;
  send: unknown;
  enable: () => Promise<string[]>;
  on?: (method: string, listener: (...args: any[]) => void) => void;
  removeListener?: (method: string, listener: (...args: any[]) => void) => void;
}

interface tronWeb {
  send: unknown;
  enable: () => Promise<string[]>;
  on?: (method: string, listener: (...args: any[]) => void) => void;
  removeListener?: (method: string, listener: (...args: any[]) => void) => void;
  request: any;
  trx?: { getBlock?: (m: string) => Promise };
  defaultAddress?: {
    base58?: '';
  };
  fullNode?: {
    chainType?: '';
    host?: 'https://api.trongrid.io';
  };
}

interface Window {
  ethereum?: Ethereum;
  tronWeb?: tronWeb;
  web3?: {};
}

declare const __DEV__: boolean;
declare module 'tronweb';
declare module '@intercroneswap/java-tron-provider';
declare module 'trongrid';
declare module 'content-hash' {
  declare function decode(x: string): string;
  declare function getCodec(x: string): string;
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array };
  declare function toB58String(hash: Uint8Array): string;
}

import * as TronWebModule from 'tronweb';

const tronWebInstance = new TronWebModule({
  fullNode: {
    host: 'https://api.trongrid.io',
  },
  headers: { 'TRON-PRO-API-KEY': 'e15544ca-e0b1-418f-bd68-5fdfc41c9ce0' },
});

tronWebInstance.enable().then((addresses) => {
  console.log('TronLink enabled with addresses:', addresses);
});
