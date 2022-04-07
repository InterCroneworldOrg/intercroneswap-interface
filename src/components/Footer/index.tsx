import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Style from '../../styles/footer.module.css';

import styled from 'styled-components';
import { Facebook, Youtube, Twitter, Instagram, Send } from 'react-feather';
import { ExternalLink } from '../../theme';
import PriceCard from '../PriceCard';

const FootContent = styled.div`
  display: flex;
  padding: 35px;
  justify-content: space-between;
  width: 85%;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
`;
const SocialIconWrapper = styled.div`
  display: flex;
`;
const MenuItem = styled(ExternalLink)`
  flex: 1;
  color: black;

  > svg {
    background: white;
    margin: 0 10px;
    width: 35px;
    height: 35px;
    padding: 7px;
    border-radius: 50%;
  }
`;
const Footer = () => {
  return (
    <Container className={Style.footcontainer}>
      <Row>
        <Col md={4}>
          <p className={Style.iswap}>ISwap</p>
          <ul className={Style.ul}>
            <li>
              <Link to="/exchange" className={`${Style.link} nav-link`}>
                Exchange
              </Link>
            </li>
            <li>
              <Link to="/liquidity" className={`${Style.link} nav-link`}>
                Liquidity
              </Link>
            </li>
            <li>
              <Link to="/staking" className={`${Style.link} nav-link`}>
                Staking
              </Link>
            </li>

            <li>
              <Link to="/dashboard" className={`${Style.link} nav-link`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/nft" className={`${Style.link} nav-link`}>
                NFT
              </Link>
            </li>
            <li>
              <Link to="/market" className={`${Style.link} nav-link`}>
                Market
              </Link>
            </li>
          </ul>
        </Col>
        <Col md={4}>
          <p className={Style.footerheader}>About</p>
          <ul className={Style.ul}>
            <li>
              <Link to="/exchange" className={`${Style.link} nav-link`}>
                Audit
              </Link>
            </li>
            <li>
              <Link to="/liquidity" className={`${Style.link} nav-link`}>
                White Paper
              </Link>
            </li>
            <li>
              <Link to="/staking" className={`${Style.link} nav-link`}>
                FAQ
              </Link>
            </li>

            <li>
              <Link to="/dashboard" className={`${Style.link} nav-link`}>
                Roadmap
              </Link>
            </li>
            <li>
              <Link to="/nft" className={`${Style.link} nav-link`}>
                Trading Guide
              </Link>
            </li>
          </ul>
        </Col>
        <Col md={4} className="lastcol">
          <p className={Style.footerheader}>Developers</p>
          <ul className={Style.ul}>
            <li>
              <Link to="/exchange" className={`${Style.link} nav-link`}>
                Documentation
              </Link>
            </li>
            <li>
              <Link to="/liquidity" className={`${Style.link} nav-link`}>
                Github
              </Link>
            </li>
          </ul>
        </Col>
      </Row>
      <hr />
      <FootContent>
        <PriceCard />
        <SocialIconWrapper>
          <MenuItem id="link" href="https://twitter.com/IntercroneWorld">
            <Twitter />
          </MenuItem>
          <MenuItem id="link" href="https://www.instagram.com/intercrone">
            <Instagram />
          </MenuItem>
          <MenuItem id="link" href="https://www.facebook.com/InterCrone">
            <Facebook />
          </MenuItem>
          <MenuItem id="link" href="https://t.me/intercroneworld">
            <Send />
          </MenuItem>
          <MenuItem id="link" href="https://www.youtube.com/c/InterCroneWorld">
            <Youtube />
          </MenuItem>
        </SocialIconWrapper>
      </FootContent>
    </Container>
  );
};

export default Footer;
