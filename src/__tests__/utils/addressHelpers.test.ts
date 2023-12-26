import { getAddress } from 'utils/addressHelpers'

describe('getAddress', () => {
  const address = {
    207: '0xEd8c5530a0A086a12f57275728128a60DFf04230',
    206: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
  }

  it(`get address for mainnet (chainId 207)`, () => {
    process.env.NEXT_PUBLIC_CHAIN_ID = '207'
    const expected = address[207]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for testnet (chainId 206)`, () => {
    process.env.NEXT_PUBLIC_CHAIN_ID = '206'
    const expected = address[206]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for any other network (chainId 31337)`, () => {
    process.env.NEXT_PUBLIC_CHAIN_ID = '31337'
    const expected = address[207]
    expect(getAddress(address)).toEqual(expected)
  })
})
