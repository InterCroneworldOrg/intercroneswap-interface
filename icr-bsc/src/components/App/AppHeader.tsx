/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from '@pancakeswap/uikit'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  const [expertMode] = useExpertModeManager()

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'} flex={1}>
        {backTo && (
          <Link passHref href={backTo}>
            <IconButton as="a">
              <ArrowBackIcon width="32px" />
            </IconButton>
          </Link>
        )}
        <Flex flex={1} justifyContent="center" marginLeft={-30} marginTop={10}>
          <Heading as="h2" mb="8px">
            {title}
          </Heading>
        </Flex>
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
