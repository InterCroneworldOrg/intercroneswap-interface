/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { Token, Currency } from '@intercroneswap/v2-sdk'
import { Button, Text, ErrorIcon, Flex, Message, Checkbox, Link, Tag, Grid } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Layout/Column'
import { useAddUserToken } from 'state/user/hooks'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { ListLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  tokens.forEach((token) => addToken(token))
  if (handleCurrencySelect) {
    handleCurrencySelect(tokens[0])
  }

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  return <></>
}

export default ImportToken
