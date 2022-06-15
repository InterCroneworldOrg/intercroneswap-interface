import styled from 'styled-components'
import { RowBetween } from '../../../packages/uikit/src/styles/header.styles'

export const MarketHeader = styled(RowBetween)`
  padding: 0 3rem;
  ${({ theme }) => theme.mediaQueries.tab} {
    display: none;
  } ;
`
