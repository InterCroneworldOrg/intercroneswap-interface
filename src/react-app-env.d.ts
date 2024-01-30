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
// interface tronWeb {
//   send: unknown;
//   enable: () => Promise<string[]>;
//   on?: (method: string, listener: (...args: any[]) => void) => void;
//   removeListener?: (method: string, listener: (...args: any[]) => void) => void;
//   request: any;
//   trx?: { getBlock?: (m: string) => Promise };
//   defaultAddress?: {
//     base58?: '';
//   };
//   fullNode?: {
//     chainType?: '207';
//     fullHost: 'https://vinuchain-rpc.com';
//     // headers: { 'TRON-PRO-API-KEY': 'your api key' };
//     // privateKey: 'e15544ca-e0b1-418f-bd68-5fdfc41c9ce0';
//   };
// }

interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
  };
  ethereum?: Ethereum;
  // tronWeb?: tronWeb;
  // web3?: {};
}
declare const __DEV__: boolean;
declare module 'isMetaMask';
declare module '@web3-react/abstract-connector';
declare module 'trongrid';
declare module 'content-hash' {
  declare function decode(x: string): string;
  declare function getCodec(x: string): string;
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array };
  declare function toB58String(hash: Uint8Array): string;
}
