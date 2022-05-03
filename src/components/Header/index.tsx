/* eslint-disable @typescript-eslint/no-unused-vars */
import { Navbar, Container, Nav } from 'react-bootstrap';
import Style from '../../styles/header.module.css';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../../assets/images/ISwap.svg';
import { useActiveWeb3React } from '../../hooks';
import Web3Status from '../Web3Status';
import EthLogo from '../../assets/images/eth-logo.png';
import BTTLogo from '../../assets/images/bttlogo.png';
import BSCLogo from '../../assets/images/bsclogo.png';
import PriceCard from '../PriceCard';
import { ExternalLink, isMobile } from '../../theme';
import downarrow from '../../assets/images/downarrow.png';
import uparrow from '../../assets/images/uparrow.png';
import { useCallback, useState } from 'react';
import Settings from '../Settings';
import { Box } from 'rebass';

const Row = styled(Box)<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  display: flex;
  padding: 0;
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
`};
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

export default function Header() {
  const { account } = useActiveWeb3React();
  const [dropshow, setDropShow] = useState(false);
  const [toggle, setToggle] = useState(false);

  const changeHamIcon = () => {
    setToggle(!toggle);
  };

  const changeDropMenu = () => {
    setDropShow(!dropshow);
  };

  const tokenDropdown = useCallback(() => {
    return (
      <>
        <div className="tokenname">
          <span>TRX</span>
          <span style={{ width: '30px', marginLeft: '7px' }}>
            <img src={EthLogo} alt="" />
            <span onClick={changeDropMenu}>
              <img className={Style.droparrow} width={12} src={dropshow ? uparrow : downarrow} alt="" />
            </span>
          </span>
        </div>
        {dropshow ? (
          <div title="" id="basic-nav-dropdowns">
            <p>Select a Network</p>
            <ExternalLink href="https://trx.intercroneswap.com/" className="trxlogo active">
              <span>TRX</span>
              <span style={{ marginLeft: '7px' }}>
                <img width={25} src={EthLogo} alt="" />
              </span>
            </ExternalLink>
            <ExternalLink href="https://btt.intercroneswap.com/" className="bttlogo">
              <span>BTT</span>
              <span style={{ marginLeft: '7px' }}>
                <img width={25} src={BTTLogo} alt="" />
              </span>
            </ExternalLink>
            <ExternalLink href="https://bsc.intercroneswap.com/" className="bsclogo">
              <span>BSC</span>
              <span style={{ marginLeft: '7px' }}>
                <img width={25} src={BSCLogo} alt="" />
              </span>
            </ExternalLink>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }, [dropshow, toggle]);

  const links = useCallback(() => {
    return (
      <>
        <Link to="/swap" className={`${Style.link} nav-link`}>
          Exchange
        </Link>
        <Link to="/pool" className={`${Style.link} nav-link`}>
          Liquidity
        </Link>
        <Link to="/stake" className={`${Style.link} nav-link`}>
          🔥 Staking
        </Link>
        <ExternalLink href="https://intercroneswap.com/nft/minting/" className={`${Style.link} nav-link`}>
          NFT
        </ExternalLink>
      </>
    );
  }, []);

  const headerLinks = useCallback(() => {
    return (
      <HeaderLinks>
        <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
          <PriceCard />
          <Web3Status />
        </AccountElement>
        <Settings />
      </HeaderLinks>
    );
  }, []);

  // const { t } = useTranslation();

  // const [isDark] = useDarkModeManager()

  return (
    <header id="mainheader">
      <Navbar
        expand="lg"
        className={toggle ? 'yestoggle' : 'notoggle'}
        onToggle={changeHamIcon}
        style={{ width: '100%', background: 'linear-gradient(180deg, #3B3B3B 0%, rgba(59, 59, 59, 0) 100%)' }}
      >
        {isMobile ? (
          <Container fluid>
            <AutoRow justify="space-between">
              {tokenDropdown()}
              <Navbar.Brand href="https://intercroneswap.com/" style={{}}>
                <img width={'115px'} src={Logo} alt="logo" />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">{headerLinks()}</Navbar.Collapse>
            </AutoRow>
            <AutoRow justify="space-between">{links()}</AutoRow>
          </Container>
        ) : (
          <Container fluid>
            <Navbar.Brand href="https://intercroneswap.com/" style={{}}>
              <img width={'115px'} src={Logo} alt="logo" />
            </Navbar.Brand>
            {tokenDropdown()}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">{links()}</Nav>
              {headerLinks()}
            </Navbar.Collapse>
          </Container>
        )}
      </Navbar>
    </header>
  );
}
