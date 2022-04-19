import { Token, ChainId, WETH } from '@intercroneswap/v2-sdk'
import farms from './farms'
import { Ifo } from './types'

export const cakeBnbLpToken = WETH[ChainId.TESTNET]

const ifos: Ifo[] = []

export default ifos
