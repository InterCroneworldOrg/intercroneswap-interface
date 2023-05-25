import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, JSBI, Token, Trade } from '@intercroneswap/v2-sdk'
import Rocket from '@pancakeswap/uikit/src/components/Svg/Icons/Rocket'
import PlaentzLogo from '@pancakeswap/uikit/src/components/Svg/Icons/PlaentzLogo'
import {
  Button,
  Text,
  ArrowDownIcon,
  Box,
  useModal,
  Flex,
  BottomDrawer,
  useMatchBreakpoints,
  LinkExternal,
  ChtLogo,
} from '@pancakeswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import Footer from 'components/Menu/Footer'
import { useRouter } from 'next/router'
import { useTranslation } from 'contexts/Localization'
import { EXCHANGE_DOCS_URLS, LAUNCH_START_TIME } from 'config/constants'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import { StyledSocialLinks } from '@pancakeswap/uikit/src/components/Footer/styles'
import { launchSocials } from '@pancakeswap/uikit/src/components/Footer/config'
import { Divider } from 'theme'
import { LaunchCountDown } from 'components/earn/Countdown'
import useRefreshBlockNumberID from '../Swap/hooks/useRefreshBlockNumber'
import AddressInputPanel from '../Swap/components/AddressInputPanel'
import { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmSwapModal from '../Swap/components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import AdvancedSwapDetailsDropdown from '../Swap/components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from '../Swap/components/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, Wrapper } from '../Swap/components/styleds'
import ImportTokenWarningModal from '../Swap/components/ImportTokenWarningModal'
import ProgressSteps from '../Swap/components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
  useSingleTokenSwapInfo,
  useDefaultsForLaunchPad,
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSingleHopOnly, useExchangeChartManager } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import SwapWarningModal from '../Swap/components/SwapWarningModal'
import PriceChartContainer from '../Swap/components/Chart/PriceChartContainer'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from '../Swap/styles'

export default function LaunchPad() {
  const router = useRouter()
  const loadedUrlParams = useDefaultsForLaunchPad()
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const { refreshBlockNumber } = useRefreshBlockNumberID()

  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const allowedSlippage = 2000

  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrencyId,
    inputCurrency,
    outputCurrencyId,
    outputCurrency,
    recipient,
  )

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />)

  const shouldShowSwapWarning = (swapCurrency) => {
    const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
      const warningTokenData = warningTokenConfig[1]
      return swapCurrency.address === warningTokenData.address
    })
    return Boolean(isWarningToken)
  }

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)
      const showSwapWarning = shouldShowSwapWarning(currencyInput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyInput)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)
      const showSwapWarning = shouldShowSwapWarning(currencyOutput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyOutput)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => router.push('/swap')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  const hasAmount = Boolean(parsedAmount)

  const StyledHeading = styled.h1`
    font-family: Jost;
    font-style: normal;
    font-weight: 900;
    font-size: 56px;
    line-height: 72px;
    text-align: center;
    width: 100%;
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <LaunchCountDown exactStart={LAUNCH_START_TIME} />
      <StyledHeading id="tknhead">
        InterCrone Launchpad <Rocket />
      </StyledHeading>
      <Flex width="100%" justifyContent="center" position="relative" style={{ paddingTop: 20 }}>
        <BottomDrawer
          content={
            <PriceChartContainer
              inputCurrencyId={inputCurrencyId}
              inputCurrency={currencies[Field.INPUT]}
              outputCurrencyId={outputCurrencyId}
              outputCurrency={currencies[Field.OUTPUT]}
              isChartExpanded={isChartExpanded}
              setIsChartExpanded={setIsChartExpanded}
              isChartDisplayed={isChartDisplayed}
              currentSwapPrice={singleTokenPrice}
              isMobile
            />
          }
          isOpen={isChartDisplayed}
          setIsOpen={setIsChartDisplayed}
        />
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr' }}>
          <Flex flexDirection="column">
            <StyledSwapContainer $isChartExpanded={isChartExpanded}>
              <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
                <AppBody>
                  {/* <CurrencyInputHeader
                  title={t('Swap')}
                  subtitle={t('Trade tokens in an instant')}
                  setIsChartDisplayed={setIsChartDisplayed}
                  isChartDisplayed={isChartDisplayed}
                  hasAmount={hasAmount}
                  onRefreshPrice={onRefreshPrice}
                /> */}
                  <Wrapper id="swap-page" style={{ minHeight: '600px' }}>
                    <AutoColumn gap="sm">
                      <CurrencyInputPanel
                        label={
                          independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                        }
                        value={formattedAmounts[Field.INPUT]}
                        showMaxButton={!atMaxAmountInput}
                        currency={currencies[Field.INPUT]}
                        onUserInput={handleTypeInput}
                        onMax={handleMaxInput}
                        onCurrencySelect={handleInputSelect}
                        otherCurrency={currencies[Field.OUTPUT]}
                        id="swap-currency-input"
                      />

                      <CurrencyInputPanel
                        value={formattedAmounts[Field.OUTPUT]}
                        onUserInput={handleTypeOutput}
                        label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                        showMaxButton={false}
                        disableCurrencySelect
                        currency={currencies[Field.OUTPUT]}
                        onCurrencySelect={handleOutputSelect}
                        otherCurrency={currencies[Field.INPUT]}
                        id="swap-currency-output"
                      />

                      {isExpertMode && recipient !== null && !showWrap ? (
                        <>
                          <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                            <ArrowWrapper clickable={false}>
                              <ArrowDownIcon width="16px" />
                            </ArrowWrapper>
                            <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                              {t('- Remove send')}
                            </Button>
                          </AutoRow>
                          <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                        </>
                      ) : null}
                    </AutoColumn>
                    <Box mt="0.25rem">
                      {swapIsUnsupported ? (
                        <Button width="100%" disabled>
                          {t('Unsupported Asset')}
                        </Button>
                      ) : !account ? (
                        <ConnectWalletButton id="swapbutton" width="100%" />
                      ) : showWrap ? (
                        <Button width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                          {wrapInputError ??
                            (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                        </Button>
                      ) : noRoute && userHasSpecifiedInputOutput ? (
                        <GreyCard style={{ textAlign: 'center', padding: '0.75rem' }}>
                          <Text color="textSubtle">{t('Insufficient liquidity for this trade.')}</Text>
                          {singleHopOnly && <Text color="textSubtle">{t('Try enabling multi-hop trades.')}</Text>}
                        </GreyCard>
                      ) : showApproveFlow ? (
                        <RowBetween>
                          <Button
                            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                            onClick={approveCallback}
                            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                            width="48%"
                          >
                            {approval === ApprovalState.PENDING ? (
                              <AutoRow gap="6px" justify="center">
                                {t('Approving')} <CircleLoader stroke="white" />
                              </AutoRow>
                            ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                              t('Approved')
                            ) : (
                              t('Approve %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                            )}
                          </Button>
                          <Button
                            variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                            onClick={() => {
                              if (isExpertMode) {
                                handleSwap()
                              } else {
                                setSwapState({
                                  tradeToConfirm: trade,
                                  attemptingTxn: false,
                                  swapErrorMessage: undefined,
                                  txHash: undefined,
                                })
                                onPresentConfirmModal()
                              }
                            }}
                            width="48%"
                            id="swap-button"
                            disabled={
                              !isValid ||
                              approval !== ApprovalState.APPROVED ||
                              (priceImpactSeverity > 3 && !isExpertMode)
                            }
                          >
                            {priceImpactSeverity > 3 && !isExpertMode
                              ? t('Price Impact High')
                              : priceImpactSeverity > 2
                              ? t('Swap Anyway')
                              : t('Swap')}
                          </Button>
                        </RowBetween>
                      ) : (
                        <Button
                          variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                txHash: undefined,
                              })
                              onPresentConfirmModal()
                            }
                          }}
                          id="swap-button"
                          width="100%"
                          disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                        >
                          {swapInputError ||
                            (priceImpactSeverity > 3 && !isExpertMode
                              ? t('Price Impact Too High')
                              : priceImpactSeverity > 2
                              ? t('Swap Anyway')
                              : t('Swap'))}
                        </Button>
                      )}
                      {showApproveFlow && (
                        <Column style={{ marginTop: '1rem' }}>
                          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                        </Column>
                      )}
                      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                    </Box>
                  </Wrapper>
                </AppBody>
              </StyledInputCurrencyWrapper>
            </StyledSwapContainer>

            {isChartExpanded && (
              <Box display={['none', null, null, 'block']} width="100%" height="100%">
                <Footer variant="side" helpUrl={EXCHANGE_DOCS_URLS} />
              </Box>
            )}
          </Flex>
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AutoRow justify="space-between">
                <AppBody>
                  <AutoColumn gap=".5rem" style={{ padding: '2rem' }}>
                    <ChtLogo />
                    <Divider />
                    <Text>
                      Welcome to CHT, become a part of the best community. CHT is not an ordinary meme token, but a
                      token with benefits. Spotbot, Arbitrage, Trader, Liquidity pool staking.
                    </Text>
                    <LinkExternal href="https://cryptohuntertrading.io">https://cryptohuntertrading.io</LinkExternal>
                  </AutoColumn>
                </AppBody>
                <AppBody>
                  <AutoColumn gap="2rem" style={{ padding: '2rem' }}>
                    <Text>
                      In launchpad the slippage is set higher to help not lose TRX due to failed transactions.
                    </Text>
                    <Text>
                      Crypto Hunter Trading is a private funded Trading Community. Revenue generated from trading goes
                      into additional liquidity pools. CHT is a perfect combination of CEX and DEX trading with a steady
                      growing masterminded Crypto community.
                    </Text>
                  </AutoColumn>
                </AppBody>
              </AutoRow>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
          {!swapIsUnsupported ? (
            trade && <AdvancedSwapDetailsDropdown trade={trade} />
          ) : (
            <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
          )}
        </div>
      </Flex>
      <Flex
        id="socialiconparent"
        flexDirection="column"
        order={[1, null, 2]}
        justifyContent="flex-end"
        alignItems="center"
        mt="3rem"
        mb="3rem"
      >
        <Text p="2rem">Follow CHT on social media</Text>
        <StyledSocialLinks socials={launchSocials} order={[2]} pb={['0px', null, '0px']} mb={['0', null, '0px']} />
      </Flex>
    </Page>
  )
}
