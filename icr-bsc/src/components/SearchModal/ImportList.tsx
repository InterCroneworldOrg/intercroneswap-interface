/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, Text, Link, Flex, Checkbox, Message } from '@pancakeswap/uikit'
import Card from 'components/Card'
import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import useTheme from 'hooks/useTheme'
import { ListLogo } from 'components/Logo'
import { TokenList } from '@uniswap/token-lists'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import useFetchListCallback from 'hooks/useFetchListCallback'
import { removeList, enableList } from 'state/lists/actions'
import { useAllLists } from 'state/lists/hooks'
import { useTranslation } from 'contexts/Localization'

interface ImportProps {
  listURL: string
  list: TokenList
  onImport: () => void
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const TextDot = styled.div`
  height: 3px;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
`

function ImportList({ listURL, list, onImport }: ImportProps) {
  const { theme } = useTheme()
  const dispatch = useDispatch<AppDispatch>()

  const { t } = useTranslation()

  // user must accept
  const [confirmed, setConfirmed] = useState(false)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {
        dispatch(enableList(listURL))
        onImport()
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL, onImport])

  handleAddList()

  return <></>
}

export default ImportList
