import throttle from "lodash/throttle";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
// import BottomNav from "../../components/BottomNav";
import { Box } from "../../components/Box";
import Flex from "../../components/Box/Flex";
import Footer from "../../components/Footer";
import MenuItems from "../../components/MenuItems/MenuItems";
import { SubMenuItems } from "../../components/SubMenuItems";
import { useMatchBreakpoints } from "../../hooks";
import CakePrice from "../../components/CakePrice/CakePrice";
// import Logo from "./components/Logo";
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from "./config";
import { NavProps } from "./types";
// import LangSelector from "../../components/LangSelector/LangSelector";
import { MenuContext } from "./context";
import { Navbar, Container, Nav } from "react-bootstrap";
import Style from "../../styles/header.module.css";
import { HeaderLinks, AccountElement } from "../../styles/header.styles";
import Image from "next/image";
import Logo from "../../assets/images/ISwap.svg";
import EthLogo from "../../assets/images/eth-logo.png";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  background: linear-gradient(180deg, #3b3b3b 0%, rgba(59, 59, 59, 0) 100%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  transform: translate3d(0, 0, 0);

  padding-left: 16px;
  padding-right: 16px;
`;

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
`;

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`;

const Menu: React.FC<NavProps> = ({
  linkComponent = "a",
  bnbMenu,
  userMenu,
  banner,
  globalMenu,
  SocialMenu,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  langs,
  buyCakeLabel,
  children,
}) => {
  const { isMobile, isMd } = useMatchBreakpoints();
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);

  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;

  const totalTopMenuHeight = banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(false);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight]);

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");

  const subLinksWithoutMobile = subLinks?.filter((subLink) => !subLink.isMobileOnly);
  const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly);

  return (
    <MenuContext.Provider value={{ linkComponent }}>
      <Wrapper>
        <header id="mainheader">
          <Navbar
            expand="lg"
            style={{ width: "100%", background: "linear-gradient(180deg, #3B3B3B 0%, rgba(59, 59, 59, 0) 100%)" }}
          >
            <Container fluid>
              <Navbar.Brand href="https://intercroneswap.com">
                <Image src={Logo} alt="logo" width={115} height={40} />
              </Navbar.Brand>
              <div className={Style.tokenname}>
                <span>TRX</span>
                <span style={{ width: "30px", marginLeft: "7px" }}>
                  <Image src={EthLogo} alt="logo" width="26" height="25" />
                </span>
              </div>
              {/* <NavDropdown title="" id="basic-nav-dropdowns">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown> */}
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                  <a href="/swap/" className={`${Style.link} nav-link`}>
                    Exchange
                  </a>
                  <a href="/liquidity/" className={`${Style.link} nav-link`}>
                    Liquidity
                  </a>
                  {/* <a href="/stake/" className={`${Style.link} nav-link`}>
                    Staking
                  </a> */}
                  <a href="https://intercroneswap.com/nft/minting/" className={`${Style.link} nav-link`}>
                    NFT
                  </a>
                  {/* <NavDropdown title="" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
                </Nav>
                <HeaderLinks id="conntbtn">
                  <AccountElement style={{ pointerEvents: "auto" }}>{userMenu}</AccountElement>
                </HeaderLinks>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        <BodyWrapper mt={!subLinks ? `${totalTopMenuHeight + 1}px` : "0"}>
          <Inner isPushed={false} showMenu={showMenu}>
            {children}
            <Footer
              items={footerLinks}
              isDark={isDark}
              toggleTheme={toggleTheme}
              langs={langs}
              setLang={setLang}
              currentLang={currentLang}
              cakePriceUsd={cakePriceUsd}
              buyCakeLabel={buyCakeLabel}
              mb={[`${MOBILE_MENU_HEIGHT}px`, null, "0px"]}
            />
          </Inner>
        </BodyWrapper>
        {/* {isMobile && <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />} */}
      </Wrapper>
    </MenuContext.Provider>
  );
};

export default Menu;
