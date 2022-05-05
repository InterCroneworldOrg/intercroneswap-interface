import React from "react";
import { Colors } from "../../theme";
import { baseColors, darkColors, lightColors } from "../../theme/colors";
import { Flex, Box } from "../Box";
import { CakePrice } from "../CakePrice";
import { Link } from "../Link";
import {
  StyledFooter,
  StyledFooterContainer,
  StyledIconMobileContainer,
  StyledList,
  StyledListItem,
  StyledText,
  StyledSocialLinks,
  StyledToolsContainer,
} from "./styles";
import { FooterProps } from "./types";

const MenuItem: React.FC<FooterProps> = ({
  items,
  isDark,
  toggleTheme,
  currentLang,
  langs,
  setLang,
  cakePriceUsd,
  buyCakeLabel,
  ...props
}) => {
  return (
    <StyledFooter p={["40px 16px", null, "56px 40px 32px 40px"]} {...props} justifyContent="center" id="styledfooter">
      <StyledFooterContainer>
        <Flex flexDirection="column" width={["100%", null, "1200px;"]}>
          <StyledIconMobileContainer display={["block", null, "none"]}>
            {/* <LogoWithTextIcon isDark width="130px" /> */}
          </StyledIconMobileContainer>
          <Flex
            id="styledfooterflex"
            order={[2, null, 1]}
            flexDirection={["column", null, "row"]}
            justifyContent="space-between"
            alignItems="flex-start"
            mb={["42px", null, "36px"]}
            borderBottom="1px solid rgba(255, 255, 255, 0.22)"
            paddingBottom="20px"
          >
            {items?.map((item) => (
              <StyledList key={item.label}>
                <StyledListItem>{item.label}</StyledListItem>
                {item.items?.map(({ label, href, isHighlighted = false }) => (
                  <StyledListItem key={label}>
                    {href ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        color={isHighlighted ? baseColors.warning : darkColors.text}
                        bold={false}
                      >
                        {label}
                      </Link>
                    ) : (
                      <StyledText>{label}</StyledText>
                    )}
                  </StyledListItem>
                ))}
              </StyledList>
            ))}
            <Box display={["none", null, "block"]}>{/* <LogoWithTextIcon isDark width="160px" /> */}</Box>
          </Flex>
          {/* <StyledSocialLinks order={[2]} pb={["42px", null, "32px"]} mb={["0", null, "32px"]} /> */}
          <StyledToolsContainer
            order={[1, null, 3]}
            flexDirection={["column", null, "row"]}
            justifyContent="space-between"
          >
            <Flex order={[2, null, 1]} alignItems="center">
              <Box mr="20px">
                <CakePrice cakePriceUsd={cakePriceUsd} />
              </Box>
            </Flex>
            <Flex
              id="socialiconparent"
              order={[1, null, 2]}
              mb={["0", null, "0"]}
              justifyContent="flex-end"
              alignItems="center"
            >
              <StyledSocialLinks order={[2]} pb={["0px", null, "0px"]} mb={["0", null, "0px"]} />
            </Flex>
          </StyledToolsContainer>
        </Flex>
      </StyledFooterContainer>
    </StyledFooter>
  );
};

export default MenuItem;
