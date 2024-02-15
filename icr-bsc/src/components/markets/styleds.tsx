import { AutoColumnToRow } from 'components/earn/styleds'
import styled from 'styled-components'
import { Divider } from 'theme'
import StyledButton from '../../../packages/uikit/src/components/Button/StyledButton'
import { Link } from '../../../packages/uikit/src/components/Link'
import { Text } from '../../../packages/uikit/src/components/Text'
import { RowBetween } from '../../../packages/uikit/src/styles/header.styles'

export const CardRow = styled(RowBetween)`
  width: 13%;
  ${({ theme }) => theme.mediaQueries.tab} {
    width: 100%;
  } ;
`

export const MobileOnlyText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.tab} {
    display: block;
  }
`

export const MobileCenteredCurrencyLink = styled(Link)`
  width: 20%;
  display: flex;
  ${({ theme }) => theme.mediaQueries.tab} {
    width: 100%;
    justify-content: center;
  }
`

export const MobileOnlyDivider = styled(Divider)`
  display: none;
  ${({ theme }) => theme.mediaQueries.tab} {
    display: block;
  }
`

export const MobileHiddenButtons = styled(RowBetween)`
  width: 20%;
  ${({ theme }) => theme.mediaQueries.tab} {
    display: none;
  }
`

export const DetailsButton = styled(StyledButton)`
  background-color: rgba(0, 0, 0, 0%);
  height: 3rem;
  width: 100%;
`
export const DetailCard = styled(AutoColumnToRow)`
  padding: 0 2rem;
  ${({ theme }) => theme.mediaQueries.tab} {
    display: none;
  }
`
