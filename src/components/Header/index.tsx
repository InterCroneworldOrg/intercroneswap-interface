import { Navbar, Container, Nav } from 'react-bootstrap';
import Style from '../../styles/header.module.css';
import { HeaderLinks, AccountElement } from '../../styles/header.styles';
import Logo from '../../assets/images/ISwap.svg';
import { useActiveWeb3React } from '../../hooks';
import Web3Status from '../Web3Status';
import EthLogo from '../../assets/images/eth-logo.png';
import BTTLogo from '../../assets/images/bttlogo.png';
import BSCLogo from '../../assets/images/bsclogo.png';
import PriceCard from '../PriceCard';
import { ExternalLink } from '../../theme';
import { Link } from 'react-router-dom';
import downarrow from '../../assets/images/downarrow.png';
import uparrow from '../../assets/images/uparrow.png';
import { useState } from 'react';
import Settings from '../Settings';
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

  return (
    <header id="mainheader">
      <Navbar
        expand="lg"
        className={toggle ? 'yestoggle' : 'notoggle'}
        onToggle={changeHamIcon}
        style={{ width: '100%', background: 'linear-gradient(180deg, #3B3B3B 0%, rgba(59, 59, 59, 0) 100%)' }}
      >
        <Container fluid>
          <Link to="/">
            <Navbar.Brand>
              <img width={'115px'} src={Logo} alt="logo" />
            </Navbar.Brand>
          </Link>
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
              <div className="trxlogo active">
                <span>TRX</span>
                <span style={{ marginLeft: '7px' }}>
                  <img width={25} src={EthLogo} alt="" />
                </span>
              </div>
              <div className="bttlogo">
                <span>BTT</span>
                <span style={{ marginLeft: '7px' }}>
                  <img width={25} src={BTTLogo} alt="" />
                </span>
              </div>
              <div className="bsclogo">
                <span>BSC</span>
                <span style={{ marginLeft: '7px' }}>
                  <img width={25} src={BSCLogo} alt="" />
                </span>
              </div>
            </div>
          ) : (
            ''
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <ExternalLink href="https://trx.intercroneswap.com/#/swap/" className={`${Style.link} nav-link`}>
                Exchange
              </ExternalLink>
              <ExternalLink href="https://trx.intercroneswap.com/#/pool/" className={`${Style.link} nav-link`}>
                Liquidity
              </ExternalLink>
              <ExternalLink href="https://trx.intercroneswap.com/#/stake/" className={`${Style.link} nav-link`}>
                Staking
              </ExternalLink>
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
            {/* <Menu /> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
