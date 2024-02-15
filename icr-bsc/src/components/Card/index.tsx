import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1.25rem'};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius ?? '16px'};
  background-color: ${({ theme }) => theme.colors.background};
`
export default Card

export const LightCard = styled(Card)`
  box-shadow: 0px 2px 26px rgba(0, 0, 0, 0.15);
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px;
`

export const LightGreyCard = styled(Card)`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.backgroundAlt2};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt2};
`
