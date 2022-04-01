import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

export const PoolBodyWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 840px;
  width: 100%;
  z-index: 1;
  box-shadow: 0px 2px 26px rgba(0,0,0,0.15);
  margin-top: 16px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function PoolAppBody({ children }: { children: React.ReactNode }) {
  return <PoolBodyWrapper>{children}</PoolBodyWrapper>
}
