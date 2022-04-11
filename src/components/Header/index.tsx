import { Navbar, Container, Nav } from 'react-bootstrap';
import Style from '../../styles/header.module.css';
import { HeaderLinks, AccountElement } from '../../styles/header.styles';
import Logo from '../../assets/images/ISwap.svg';
import { useActiveWeb3React } from '../../hooks';
import Settings from '../Settings';
import Menu from '../Menu';
import Web3Status from '../Web3Status';
import EthLogo from '../../assets/images/eth-logo.png';
import PriceCard from '../PriceCard';
import { ExternalLink } from '../../theme';

export default function Header() {
  const { account } = useActiveWeb3React();

  return (
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
            <Menu />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
