import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { SocialMenu as UIKitSocialMenu, UserMenuItem, UserMenuVariant } from '@pancakeswap/uikit'
import { useProfile } from 'state/profile/hooks'
import { usePendingTransactions } from 'state/transactions/hooks'
import { useTranslation } from 'contexts/Localization'

const SocialMenu = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const { profile } = useProfile()
  const avatarSrc = profile?.nft?.image?.thumbnail
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')

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
        <UserMenuItem as="button">NFT</UserMenuItem>
      </>
    )
  }
  return (
    <UIKitSocialMenu account={account} avatarSrc={avatarSrc} text={userMenuText} variant={userMenuVariable}>
      <UserMenuItems />
    </UIKitSocialMenu>
  )
}

export default SocialMenu
