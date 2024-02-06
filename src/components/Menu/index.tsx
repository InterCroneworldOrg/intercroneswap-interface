/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Menu as UikitMenu, Text } from '@pancakeswap/uikit'
import { CHAIN_ID } from 'config/constants/networks'
import { languageList } from 'config/localization/languages'
import { formatBigNumber } from 'utils/formatBalance'
import useTheme from 'hooks/useTheme'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import { useIcrBusdPrice } from 'hooks/useBUSDPrice'
import { footerLinks } from './config/footerConfig'
import { useMenuItems } from './hooks/useMenuItems'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import SocialMenu from './SocialMenu'
import UserMenu from './UserMenu'

const Menu = (props) => {
  const { isDark, setTheme } = useTheme()
  const cakePriceUsd = useIcrBusdPrice()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()

  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })
  const { balance, fetchStatus } = useGetBnbBalance()

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  return (
    <UikitMenu
      linkComponent={(linkProps) => {
        return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
      }}
      bnbMenu={
        fetchStatus === FetchStatus.Fetched ? (
          <Text style={{ marginRight: 10 }}>{formatBigNumber(balance, 6)} BNB</Text>
        ) : (
          <></>
        )
      }
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      SocialMenu={<SocialMenu />}
      banner={false && typeof window !== 'undefined' && <PhishingWarningBanner />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd?.toFixed(4)}
      links={menuItems}
      subLinks={[]}
      footerLinks={footerLinks(t)}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      buyCakeLabel={t('Buy CAKE')}
      chainId={CHAIN_ID}
      {...props}
    />
  )
}

export default Menu
