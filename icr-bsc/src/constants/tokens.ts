import { ChainId, Token } from '@intercroneswap/v2-sdk';

export const ICR = new Token(ChainId.TESTNET, '0xb518912759D86409e747fad19Dbad9FE681761C3', 18, 'ICR', 'InterCrone');
export const BUSD = new Token(ChainId.TESTNET, '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', 18, 'BUSD', 'Binance USD');
export const WBNB = new Token(ChainId.TESTNET, '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', 18, 'WBNB', 'Wrapped BNB');
export const BTT = new Token(ChainId.TESTNET, '0x9d77B98d399fd890104aDc6c44db576DbCd23f95', 18, 'BTT', 'Btt Token');