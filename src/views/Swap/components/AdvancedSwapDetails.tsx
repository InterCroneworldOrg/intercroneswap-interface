import { Trade, TradeType } from '@intercroneswap/v2-sdk'
import { Text } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { t } = useTranslation()
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const textColor = '#F3C914';
  return (
    <AutoColumn gap="2px" style={{ padding: '0 16px' }}>
      <RowBetween>
        <RowFixed>
          <Text fontSize="18px" color="white">
            {isExactIn ? t('Minimum received') : t('Maximum sold')}
          </Text>
          {/* <QuestionHelper
            text={t(
              'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
            )}
            ml="4px"
            placement="top-start"
          /> */}
        </RowFixed>
        <RowFixed>
          <Text fontSize="18px" color={textColor}>
            {isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <Text fontSize="18px" color="white">
            {t('Price Impact')}
          </Text>
          {/* <QuestionHelper
            text={t('The difference between the market price and estimated price due to trade size.')}
            ml="4px"
            placement="top-start"
          /> */}
        </RowFixed>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <Text fontSize="18px" color="white">
            {t('Liquidity Provider Fee')}
          </Text>
          {/* <QuestionHelper
            text={
              <>
                <Text mb="12px">{t('For each trade a %amount% fee is paid', { amount: '0.25%' })}</Text>
                <Text>- {t('%amount% to LP token holders', { amount: '0.17%' })}</Text>
                <Text>- {t('%amount% to the Treasury', { amount: '0.03%' })}</Text>
                <Text>- {t('%amount% towards CAKE buyback and burn', { amount: '0.05%' })}</Text>
              </>
            }
            ml="4px"
            placement="top-start"
          /> */}
        </RowFixed>
        <Text fontSize="18px" color={textColor}>
          {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
        </Text>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <Text fontSize="18px" color="white">
            {t('Slippage tolerance')}
          </Text>
          {/* <QuestionHelper
            text={
              <>
                <Text mb="12px">{t('For each trade a %amount% fee is paid', { amount: '0.25%' })}</Text>
                <Text>- {t('%amount% to LP token holders', { amount: '0.17%' })}</Text>
                <Text>- {t('%amount% to the Treasury', { amount: '0.03%' })}</Text>
                <Text>- {t('%amount% towards CAKE buyback and burn', { amount: '0.05%' })}</Text>
              </>
            }
            ml="4px"
            placement="top-start"
          /> */}
        </RowFixed>
        <Text fontSize="18px" color={textColor}>
          {allowedSlippage / 100}%
        </Text>
      </RowBetween>
    </AutoColumn>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '6px 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Text fontSize="14px" color="textSubtle">
                    {t('Route')}
                  </Text>
                  <QuestionHelper
                    text={t('Routing through these tokens resulted in the best price for your trade.')}
                    ml="4px"
                    placement="top-start"
                  />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
