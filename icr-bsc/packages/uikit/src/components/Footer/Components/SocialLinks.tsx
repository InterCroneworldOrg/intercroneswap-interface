import React from "react";
import { darkColors } from "../../../theme";
import { FlexProps } from "../../Box";
import Flex from "../../Box/Flex";
import Dropdown from "../../Dropdown/Dropdown";
import Link from "../../Link/Link";
import { SocialIconType } from "../types";

export interface SocialLinksProps extends FlexProps {
  socials: SocialIconType[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ ...props }) => (
  <Flex {...props} id="sociallinks">
    {props.socials.map((social, index) => {
      const iconProps = {
        width: "40px",
        color: darkColors.textSubtle,
        style: { cursor: "pointer" },
      };
      const Icon = social.icon;
      const mr = index < props.socials.length - 1 ? "24px" : 0;
      return (
        <Link external key={social.label} href={social.href} aria-label={social.label} mr={mr}>
          <Icon {...iconProps} />
        </Link>
      );
    })}
  </Flex>
);

export default React.memo(SocialLinks, () => true);
