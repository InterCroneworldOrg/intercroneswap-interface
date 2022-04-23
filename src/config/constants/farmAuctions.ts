import { ChainId } from '@intercroneswap/v2-sdk'
import getLpAddress from 'utils/getLpAddress'
import { CHAIN_ID } from './networks'
import tokens from './tokens'
import { FarmAuctionBidderConfig } from './types'

export const whitelistedBidders: FarmAuctionBidderConfig[] =
  Number(CHAIN_ID) === ChainId.MAINNET
    ? [].map((bidderConfig) => ({
        ...bidderConfig,
        lpAddress: getLpAddress(bidderConfig.tokenAddress, bidderConfig.quoteToken),
      }))
    : []

const UNKNOWN_BIDDER: FarmAuctionBidderConfig = {
  account: '',
  tokenAddress: '',
  quoteToken: tokens.wbtt,
  farmName: 'Unknown',
  tokenName: 'Unknown',
}

export const getBidderInfo = (account: string): FarmAuctionBidderConfig => {
  const matchingBidder = whitelistedBidders.find((bidder) => bidder.account.toLowerCase() === account.toLowerCase())
  if (matchingBidder) {
    return matchingBidder
  }
  return { ...UNKNOWN_BIDDER, account }
}
