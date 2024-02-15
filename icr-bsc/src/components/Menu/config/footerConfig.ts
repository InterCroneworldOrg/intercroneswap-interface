import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('ISwap'),
    items: [
      {
        label: t('Exchange'),
        href: '/swap/',
      },
      {
        label: t('Liquidity'),
        href: '/liquidity/',
      },
      {
        label: t('Staking'),
        href: '/stake/',
      },
      // {
      //   label: t('Dashboard'),
      //   href: 'https://',
      // },
      {
        label: t('NFT'),
        href: 'https://intercroneswap.com/nft/minting/',
      },
      // {
      //   label: t('Market'),
      //   href: 'https://',
      // },
    ],
  },
  {
    label: t('About'),
    items: [
      {
        label: t('Audit'),
        href: 'https://docs.intercroneswap.finance/security/audits',
      },
      // {
      //   label: t('White Paper'),
      //   href: '',
      // },
      {
        label: t('FAQ'),
        href: 'https://docs.intercroneswap.finance/',
      },
      {
        label: t('Roadmap'),
        href: 'https://docs.intercroneswap.finance/road-map/roadmap',
      },
      {
        label: t('Trading Guide'),
        href: 'https://docs.intercroneswap.finance/faq/how-to-swap-trade-token',
      },
    ],
  },
  {
    label: t('Blockchains'),
    items: [
      {
        label: t('TRX'),
        href: 'https://trx.intercroneswap.com/',
        withLogo: true,
      },
      {
        label: t('BSC'),
        href: 'https://bsc.intercroneswap.com/',
        withLogo: true,
      },
      {
        label: t('BTT'),
        href: 'https://btt.intercroneswap.com/',
        withLogo: true,
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: t('Documentation'),
        href: 'https://docs.intercroneswap.finance/',
      },
      {
        label: 'Github',
        href: 'https://github.com/InterCroneworldOrg',
      },
    ],
  },
]
