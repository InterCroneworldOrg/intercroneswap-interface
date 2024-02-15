import styled, { css } from 'styled-components'
import { AutoRow } from 'components/Layout/Row'
import { Text } from '@pancakeswap/uikit'

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
  display: flex;
  justify-content: center;
  padding: 2px;
  width: 5%;
  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`

export const AutoRowToColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
  display: grid;
  width: 100%
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
  ${({ theme }) => theme.mediaQueries.tab} {
    display: flex;
    padding: 0;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
`

export const AutoColumnToRow = styled(AutoRow)`
  ${({ theme }) => theme.mediaQueries.tab} {
    display: grid;
    margin: 0.5rem 0;
    padding: 0;
    width: 100%;
    grid-auto-rows: auto;
    justify-content: space-between;
  }
`

export const SpacedToCenteredAutoRow = styled(AutoRow)`
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.tab} {
    justify-content: space-between;
  }
`

export const RowBetweenToDiv = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding: 0 1rem;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.tab} {
    justify-content: space-between;
    width: 100%;
    padding: 0;
    gap: 0;
  }
`

export const ResponsiveSizedTextNormal = styled(Text)`
  font-size: 1rem;
`

export const ResponsiveSizedTextMedium = styled(Text)`
  font-weight: 400;
  font-size: 1rem;
`
export const ButtonAutoRow = styled(AutoRow)`
  width: 450px;
  ${({ theme }) => theme.mediaQueries.tab} {
    width: 100%;
  }
`
