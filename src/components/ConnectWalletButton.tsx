import { Button, useWalletModal, ButtonProps } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import Trans from './Trans'

const ButtonWrapper = styled.div`
padding: 5px;
  > button {
    background: linear-gradient(90deg, rgb(255, 184, 7) 8.49%, rgb(255, 234, 0) 100%);
    color: rgb(0, 0, 0);
    font-weight: 500;
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    -webkit-box-align: center;
    align-items: center;
    padding: 22px;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
  }
  @media (max-width: 768px) {
    padding:20px;
  }
`;


const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)

  return (
    <ButtonWrapper>
    <Button onClick={onPresentConnectModal} {...props}>
      {children || <Trans>Connect Wallet</Trans>}
    </Button>
    </ButtonWrapper>
  )
}

export default ConnectWalletButton
