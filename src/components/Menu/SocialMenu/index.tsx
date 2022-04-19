import { useEffect, useState } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  Flex,
  LogoutIcon,
  RefreshIcon,
  useModal,
  SocialMenu as UIKitSocialMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  Box,
} from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useRouter } from 'next/router'
import { usePendingTransactions } from 'state/transactions/hooks'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'

const SocialMenu = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account, error } = useWeb3React()
  const { logout } = useAuth()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const { balance, fetchStatus } = useGetBnbBalance()
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')
  const isWrongNetwork: boolean = error && error instanceof UnsupportedChainIdError

  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(t('%num% Pending', { num: pendingNumber }))
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  const UserMenuItems = () => {
    return (
      <>
        <UserMenuItem
          as="button"
          onClick={() => {
            console.log('NFT')
          }}
        >
          NFT
        </UserMenuItem>
      </>
    )
  }
  return (
    <UIKitSocialMenu account={account} text={userMenuText} variant={userMenuVariable}>
      <UserMenuItems />
    </UIKitSocialMenu>
  )
}

export default SocialMenu
