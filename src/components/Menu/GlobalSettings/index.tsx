/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flex, IconButton, CogIcon, useModal } from '@pancakeswap/uikit'
import SettingsModal from './SettingsModal'

type Props = {
  color?: string
  mr?: string
}

const GlobalSettings = ({ color, mr = '8px' }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  return (
    <Flex style={{ marginLeft: 10 }}>
      <IconButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id="open-settings-dialog-button"
        style={{ backgroundColor: '#c4c4c41a', borderRadius: 5 }}
      >
        <CogIcon height={24} width={24} color="primary" />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
