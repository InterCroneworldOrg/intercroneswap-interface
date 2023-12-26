import { Token, ChainId } from '@intercroneswap/v2-sdk'
import getLpAddress from 'utils/getLpAddress'

const CAKE_AS_STRING = '0xEd8c5530a0A086a12f57275728128a60DFf04230'
const BUSD_AS_STRING = '0xC0264277fcCa5FCfabd41a8bC01c1FcAF8383E41'
const CAKE_AS_TOKEN = new Token(ChainId.MAINNET, CAKE_AS_STRING, 18)
const BUSD_AS_TOKEN = new Token(ChainId.MAINNET, BUSD_AS_STRING, 18)
const CAKE_BUSD_LP = '0x5371b5fcab00e7e9e59bd0091e4e02153e37991d'

describe('getLpAddress', () => {
  it('returns correct LP address, both tokens are strings', () => {
    expect(getLpAddress(CAKE_AS_STRING, BUSD_AS_STRING)).toBe(CAKE_BUSD_LP)
  })
  it('returns correct LP address, token1 is string, token 2 is Token', () => {
    expect(getLpAddress(CAKE_AS_STRING, BUSD_AS_TOKEN)).toBe(CAKE_BUSD_LP)
  })
  it('returns correct LP address, both tokens are Token', () => {
    expect(getLpAddress(CAKE_AS_TOKEN, BUSD_AS_TOKEN)).toBe(CAKE_BUSD_LP)
  })
  it('returns null if any address is invalid', () => {
    expect(getLpAddress('123', '456')).toBe(null)
    expect(getLpAddress(undefined, undefined)).toBe(null)
    expect(getLpAddress(CAKE_AS_STRING, undefined)).toBe(null)
    expect(getLpAddress(undefined, BUSD_AS_TOKEN)).toBe(null)
    expect(getLpAddress(CAKE_AS_STRING, '456')).toBe(null)
    expect(getLpAddress('123', BUSD_AS_TOKEN)).toBe(null)
  })
})
