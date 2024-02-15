import { Percent, Price } from '@intercroneswap/v2-sdk'

const getRatePercentageDifference = (currentMarketRate: Price, price: Price) => {
  if (currentMarketRate && price) {
    const percentageAsFraction = price.subtract(currentMarketRate).divide(currentMarketRate)
    return new Percent(percentageAsFraction.numerator, percentageAsFraction.denominator)
  }
  return undefined
}

export default getRatePercentageDifference
