import { Language } from "../LangSelector/types";
import { FooterLinkType, SocialIconType } from "./types";
import {
  TwitterIcon,
  TelegramIcon,
  RedditIcon,
  InstagramIcon,
  GithubIcon,
  DiscordIcon,
  MediumIcon,
  SocialMenuIcon,
  TikTokIcon,
} from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.pancakeswap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://pancakeswap.medium.com/",
      },
      {
        label: "Community",
        href: "https://docs.pancakeswap.finance/contact-us/telegram",
      },
      {
        label: "CAKE",
        href: "https://docs.pancakeswap.finance/tokenomics/cake",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://pancakeswap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.pancakeswap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.pancakeswap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.pancakeswap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/InterCroneworldOrg",
      },
      {
        label: "Documentation",
        href: "https://docs.pancakeswap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@pancakeswap-1/s/pancakeswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://turingpoint.de/en/security-assessments/certificate/smart_contract_audit_intercroneswap-b2793351ca/",
      },
      {
        label: "Careers",
        href: "https://docs.pancakeswap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials: SocialIconType[] = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/intercroneworld",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "https://www.instagram.com/intercrone",
  },
  {
    label: "Facebook",
    icon: RedditIcon,
    href: "https://www.facebook.com/InterCrone",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    href: "https://t.me/intercroneworld",
  },
  {
    label: "Youtube",
    icon: MediumIcon,
    href: "https://www.youtube.com/c/InterCroneWorld",
  },
];

export const launchSocials: SocialIconType[] = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/CHT_thereal",
  },
  {
    label: "TikTok",
    icon: TikTokIcon,
    href: "https://www.tiktok.com/@cryptohuntertrading",
  },
  // {
  //   label: "Instagram",
  //   icon: InstagramIcon,
  //   href: "https://www.instagram.com/plaentz_com",
  // },
  // {
  //   label: "Facebook",
  //   icon: RedditIcon,
  //   href: "https://www.facebook.com/plaentz",
  // },
  // {
  //   label: "Telegram",
  //   icon: TelegramIcon,
  //   href: "https://t.me/+2K4XHVj5ln0zODk8",
  // },
  // {
  //   label: "Youtube",
  //   icon: MediumIcon,
  //   href: "https://www.youtube.com/channel/UCFhk0JazFaU5iR2TmJ46Rdw",
  // },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
