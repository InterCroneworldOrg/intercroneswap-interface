import { ChainId } from '@intercroneswap/v2-sdk'
import { AutoRow } from 'components/Layout/Row'
import { Text } from '@pancakeswap/uikit'
import { BACKEND_URL } from 'config'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useInterval from 'hooks/useInterval'
import React, { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { ThemeContext } from 'styled-components'
import { currencyFormatter } from 'utils'

export const TotalValueLocked: React.FC<any> = (...props) => {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  const [totalValueLocked, setTotalValueLocked] = useState('')
  const fetchData = async () => {
    const response = await (
      await fetch(`${BACKEND_URL}/markets/totalLocked?chainId=${chainId && ChainId.MAINNET}`)
    ).json()
    setTotalValueLocked(response.data.usdAmount)
  }
  useInterval(() => {
    fetchData()
  }, 1000 * 30)
  useEffect(() => {
    fetchData()
  }, [totalValueLocked])

  return (
    <AutoRow justify="center" gap="1rem" style={{ marginBottom: isMobile ? '.5rem' : '2rem' }}>
      <Text fontSize="1.3rem">Total value locked</Text>
      <Text color={theme.colors.primary} fontSize="1.3rem">
        {currencyFormatter.format(Number(totalValueLocked))}
      </Text>
    </AutoRow>
  )
}
