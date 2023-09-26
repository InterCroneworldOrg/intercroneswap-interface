import { Trade, TradeType } from '@intercroneswap/v2-sdk'
import { Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

import TradePrice from './TradePrice'
import { useState } from 'react'
import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #424242;
  border: none;
  margin: 15px 0px
`;

interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedPriceDetails({ trade }: AdvancedSwapDetailsProps) {
  const price = trade?.executionPrice
  const unitPrice = price?.toSignificant(6)
  const reverseUnitPrice = price?.invert()?.toSignificant(6)
  const textColor = '#F3C914';
  return (
    // <TradePrice
    //     price={trade?.executionPrice}
    //     showInverted={showInverted}
    //     setShowInverted={setShowInverted}
    // />
    <AutoColumn gap="2px" style={{ padding: '0 10px' }}>
      <RowBetween>
        <RowFixed>
          <Text color="white">
            Price
          </Text>
        </RowFixed>
      </RowBetween>
      <Divider />
      <RowBetween>
        <RowFixed>
          <Text color="white" style={{paddingRight: 5}}>
            { unitPrice } 
          </Text>
          <Text color={textColor} style={{paddingRight: 5}}>
            {price?.quoteCurrency?.symbol}
          </Text>
          <Text color="white" style={{paddingRight: 5}}>
            per
          </Text>
          <Text color={textColor} style={{paddingRight: 5}}>
            {price?.baseCurrency?.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <Text color="white" style={{paddingRight: 5}}>
            { reverseUnitPrice } 
          </Text>
          
          <Text color={textColor} style={{paddingRight: 5}}>
            {price?.baseCurrency?.symbol}
          </Text>
          <Text color="white" style={{paddingRight: 5}}>
            per
          </Text>
          <Text color={textColor} style={{paddingRight: 5}}>
            {price?.quoteCurrency?.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
    </AutoColumn>
  )
}
