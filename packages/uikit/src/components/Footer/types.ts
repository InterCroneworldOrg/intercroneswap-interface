import { Language } from "../LangSelector/types";
import { FlexProps } from "../Box";
import React from "react";
import { SvgProps } from "../Svg";

export type FooterLinkType = {
  label: string;
  items: { label: string; href?: string; withLogo?: boolean; isHighlighted?: boolean }[];
};

export type SocialIconType = {
  label: string;
  icon: React.FC<SvgProps>;
  href: string;
};

export type FooterProps = {
  items: FooterLinkType[];
  buyCakeLabel: string;
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
  cakePriceUsd?: number;
  currentLang: string;
  langs: Language[];
  setLang: (lang: Language) => void;
} & FlexProps;
