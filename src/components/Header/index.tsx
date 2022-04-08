/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { darken } from 'polished';
// import { useTranslation } from 'react-i18next';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Style from '../../styles/header.module.css';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../../assets/images/ISwap.svg';
// import Logo from '../../assets/svg/logo.svg'
// import LogoDark from '../../assets/svg/logo_white.svg'
import { useActiveWeb3React } from '../../hooks';
// import { useDarkModeManager } from '../../state/user/hooks'
import Settings from '../Settings';
import Menu from '../Menu';
// import LeftMenu from '../LeftMenu';
import { Box } from 'rebass/styled-components';
import Web3Status from '../Web3Status';
// import Modal from '../Modal';
import EthLogo from '../../assets/images/eth-logo.png';
import PriceCard from '../PriceCard';
import { ExternalLink } from '../../theme';

// const HeaderFrame = styled.div`
//   // display: grid;
//   grid-template-columns: 1fr 120px;
//   align-items: center;
//   justify-content: space-between;
//   align-items: center;
//   flex-direction: row;
//   width: 100%;

//   top: 0;
//   position: relative;
//   // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
//   // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
//   padding: 1rem;
//   z-index: 2;
//   background: ${({ theme }) => theme.bg2};

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     grid-template-columns: 1fr;
//     padding: 0 1rem;
//     width: calc(100%);
//     position: relative;
//   `};

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//         padding: 0.5rem 1rem;
//   `}
// `;

// const HeaderControls = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-self: flex-end;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     flex-direction: row;
//     justify-content: space-between;
//     justify-self: center;
//     width: 100%;
//     max-width: 960px;
//     padding: 1rem;
//      position: fixed;
//     bottom: 0px;
//     left: 0px;

//     width: 100%;
//     z-index: 99;
//     height: 72px;
//     border-radius: 12px 12px 0 0;
//     background-color: ${({ theme }) => theme.bg1};
//   `};
// `;

// const HeaderElement = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   position: fixed;
//   left: 0;
//   bottom: 16px;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//    flex-direction: row-reverse;
//     align-items: center;
//   `};
// `;

// const HeaderElementWrap = styled.div`
//   display: flex;
//   position: fixed;
//   right: 17px;
//   bottom: 16px;
//   -webkit-align-items: center;
//   -webkit-box-align: center;
//   -ms-flex-align: center;
//   align-items: center;
// `;
const Row = styled(Box)<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  // width: 100%;
  display: flex;
  padding: 0;
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;
export const PercentageDiv = styled(Row)<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  display: flex;
  padding: 0;
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

// const HeaderRowFixed = styled(Row)<{ gap?: string; justify?: string }>`
//   // width: fit-content;
//   // background-color: red;
//   justify-content: space-between;
//   margin: ${({ gap }) => gap && `-${gap}`};
// `;

// const HeaderRow = styled(HeaderRowFixed)`
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//    width: 100%;

//   `};
// `;

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
    
`};
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  // background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  // border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`;

// const Title = styled.a`
//   display: flex;
//   align-items: center;
//   pointer-events: auto;
//   justify-self: flex-start;
//   margin-right: 12px;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     justify-self: center;
//   `};
//   :hover {
//     cursor: pointer;
//   }
// `;

// const IswapIcon = styled.div`
//   filter: ${({ theme }) => theme.pngLOGOCOLOR};
//   transition: transform 0.3s ease;
//   :hover {
//     transform: rotate(-5deg);
//   }
// `;

// const activeClassName = 'ACTIVE';

// const StyledNavVoteLink = styled(NavLink).attrs({
//   activeClassName
// })`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;
//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;
//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }
//     ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: none;
//       `}
// `
// const StyledNavLink = styled(NavLink).attrs({
//   activeClassName,
// })`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;
//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;
//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }
// `;

// const StyledExternalLink = styled(ExternalLink).attrs({
//   activeClassName,
// })<{ isActive?: boolean }>`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;

//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;

//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: none;
// `}
// `;
// const StyledExternalLocalLink = styled(ExternalLink).attrs({
//   activeClassName
// }) <{ isActive?: boolean }>`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;

//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;

//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: block;
// `}
// `
// const LinksContainer = styled.div`
//   position: relative;
//   :hover > div,
//   :focus > div {
//     display: block;
//   }
// `;
// const StyledDropDown = styled.div`
// position:absolute;
// bottom:0;
// left:0;
// background-color: ${({ theme }) => theme.settingCardbg};
// border-radius:10px;
// transform:translate(-25%,100%);
// padding:10px;
// display:none;
// z-index:1000;
// `
// const StyledHeaderElements = styled.div`
//   display: flex;
//   alignitems: center;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     display: none;
//   `};
// `;

export default function Header() {
  const {
    account,
    //  chainId
  } = useActiveWeb3React();
  // const { t } = useTranslation();

  // const [isDark] = useDarkModeManager()

  // const [showIswapBalanceModal, setShowIswapBalanceModal] = useState(false);
  // const showClaimPopup = useShowClaimPopup()

  // const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  // const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  // TODO: Redesign HEADER
  return (
    // <HeaderFrame>
    //   {/* <ClaimModal /> */}
    //   <Modal isOpen={showIswapBalanceModal} onDismiss={() => setShowIswapBalanceModal(false)}></Modal>
    //   <HeaderRow>
    //     <Title href=".">
    //       <IswapIcon>
    //         <img width={'115px'} src={Logo} alt="logo" />
    //       </IswapIcon>
    //     </Title>
    //     <StyledHeaderElements>
    //       <LinksContainer>
    //         <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
    //           {t('swap')}
    //         </StyledNavLink>
    //       </LinksContainer>
    //       <StyledNavLink
    //         id={`pool-nav-link`}
    //         to={'/pool'}
    //         isActive={(match, { pathname }) =>
    //           Boolean(match) ||
    //           pathname.startsWith('/add') ||
    //           pathname.startsWith('/remove') ||
    //           pathname.startsWith('/create') ||
    //           pathname.startsWith('/find')
    //         }
    //       >
    //         {t('pool')}
    //       </StyledNavLink>
    //       <LinksContainer>
    //         <StyledNavLink id={`stake-nav-link`} to={'/stake'}>
    //           {t('Stake')}
    //         </StyledNavLink>
    //       </LinksContainer>
    //     </StyledHeaderElements>
    //     <HeaderLinks>
    //       <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
    //         {account && userEthBalance ? (
    //           <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
    //             {userEthBalance?.toSignificant(4)} TRX
    //           </BalanceText>
    //         ) : null}
    //         <Web3Status />
    //       </AccountElement>
    //       <Settings />
    //       {/* <LeftMenu /> */}
    //       <Menu />
    //     </HeaderLinks>
    //   </HeaderRow>
    //   {/* <HeaderControls>
    //     <HeaderElement>
    //       <HideSmall>
    //         {chainId && NETWORK_LABELS[chainId] && (
    //           <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
    //         )}
    //       </HideSmall> */}
    //   {/* {availableClaim && !showClaimPopup} */}
    //   {/* <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
    //         {account && userEthBalance ? (
    //           <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
    //             {userEthBalance?.toSignificant(4)} TRX
    //           </BalanceText>
    //         ) : null}
    //         <Web3Status />
    //       </AccountElement>
    //     </HeaderElement>
    //     <HeaderElementWrap>
    //       <Settings />
    //       <Menu />
    //     </HeaderElementWrap>
    //   </HeaderControls> */}
    // </HeaderFrame>
    <header id="mainheader">
      <Navbar
        expand="lg"
        style={{ width: '100%', background: 'linear-gradient(180deg, #3B3B3B 0%, rgba(59, 59, 59, 0) 100%)' }}
      >
        <Container fluid>
          <Navbar.Brand href="#home">
            <img width={'115px'} src={Logo} alt="logo" />
          </Navbar.Brand>
          <div className="tokenname">
            <span>TRX</span>
            <span style={{ width: '30px', marginLeft: '7px' }}>
              <img src={EthLogo} alt="" />
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
              <Link to="/swap" className={`${Style.link} nav-link`}>
                Exchange
              </Link>
              <Link to="/pool" className={`${Style.link} nav-link`}>
                Liquidity
              </Link>
              <Link to="/stake" className={`${Style.link} nav-link`}>
                Staking
              </Link>
              <ExternalLink href="https://intercroneswap.com/nft/minting/" className={`${Style.link} nav-link`}>
                NFT
              </ExternalLink>
              {/* <NavDropdown title="" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
            <HeaderLinks>
              <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
                <PriceCard />
                <Web3Status />
              </AccountElement>
              <Settings />
            </HeaderLinks>
            <Menu />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
