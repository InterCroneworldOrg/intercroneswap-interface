import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('ISwap'),
    items: [
      {
        label: t('Exchange'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
      {
        label: t('Liquidity'),
        href: 'https://bsc.intercroneswap.com/liquidity',
      },
      {
        label: t('Staking'),
        href: 'https://bsc.intercroneswap.com/stake',
      },
      {
        label: t('Dashboard'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
      {
        label: t('NFT'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
      {
        label: t('Market'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
    ],
  },
  {
    label: t('About'),
    items: [
      {
        label: t('Audit'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
      {
        label: t('White Paper'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
      {
        label: t('FAQ'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
      {
        label: t('Roadmap'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
      {
        label: t('Trading Guide'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: t('Documentation'),
        href: 'https://bsc.intercroneswap.com/swap',
      },
      {
        label: 'Github',
        href: 'https://bsc.intercroneswap.com/swap',
      },
    ],
  },
]
