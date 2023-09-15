import { ChainId } from '@intercroneswap/v2-sdk'
import { AutoRow } from 'components/Layout/Row'
import { Text } from '@pancakeswap/uikit'
import { BACKEND_URL } from 'config'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { isMobile } from 'react-device-detect'
import { ThemeContext } from 'styled-components'
import { currencyFormatter } from 'utils'

export const TotalValueLocked: React.FC<any> = () => {
  const theme = useContext(ThemeContext);
  const { chainId } = useActiveWeb3React();

  const [totalValueLocked, setTotalValueLocked] = useState('');

  const fetchData = useCallback(async () => {
    const response = await (
      await fetch(`${BACKEND_URL}/markets/totalLocked?chainId=${chainId && ChainId.MAINNET}`)
    ).json();
    setTotalValueLocked(response.data.usdAmount);
  }, [chainId]); // Hier 'chainId' als Abhängigkeit hinzugefügt

  useEffect(() => {
    fetchData();
  }, [totalValueLocked, fetchData]);

  return (
    <AutoRow justify="center" gap="1rem" style={{ marginBottom: isMobile ? '.5rem' : '2rem' }}>
      <Text fontSize="1.3rem">Total value locked</Text>
      <Text color={theme.colors.primary} fontSize="1.3rem">
        {currencyFormatter.format(Number(totalValueLocked))}
      </Text>
    </AutoRow>
  )
}
