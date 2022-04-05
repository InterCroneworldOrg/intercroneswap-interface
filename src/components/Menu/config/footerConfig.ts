import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('ISwap'),
    items: [
      {
        label: t('Exchange'),
        href: 'https://',
      },
      {
        label: t('Liquidity'),
        href: 'https://',
      },
      {
        label: t('Staking'),
        href: 'https://',
      },
      {
        label: t('Dashboard'),
        href: 'https://',
      },
      {
        label: t('NFT'),
        href: 'https://',
      },
      {
        label: t('Market'),
        href: 'https://',
      },
    ],
  },
  {
    label: t('About'),
    items: [
      {
        label: t('Audit'),
        href: 'https://',
      },
      {
        label: t('White Paper'),
        href: 'https://',
      },
      {
        label: t('FAQ'),
        href: 'https://',
      },
      {
        label: t('Roadmap'),
        href: 'https://',
      },
      {
        label: t('Trading Guide'),
        href: 'https://',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: t('Documentation'),
        href: 'https://',
      },
      {
        label: 'Github',
        href: 'https://',
      },
    ],
  },
]
