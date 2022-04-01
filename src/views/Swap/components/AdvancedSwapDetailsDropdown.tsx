import styled from 'styled-components'
import useLastTruthy from 'hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'
import { Text } from '@pancakeswap/uikit'
import { AdvancedPriceDetails } from './AdvancedPriceDetails'


const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '16px' : 0)};
  padding-top: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
  max-width: 560px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.normalCard};

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  height: 180px;
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <div>
      <AdvancedDetailsFooter show={Boolean(trade)}>
        <AdvancedPriceDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
      </AdvancedDetailsFooter>
      <AdvancedDetailsFooter show={Boolean(trade)}>
        <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
      </AdvancedDetailsFooter>
    </div>
    
  )
}
