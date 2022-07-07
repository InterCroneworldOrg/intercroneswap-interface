import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Style from '../../styles/footer.module.css';

import styled from 'styled-components';
import { Facebook, Youtube, Twitter, Instagram, Send } from 'react-feather';
import { Divider, ExternalLink, isMobile } from '../../theme';
import PriceCard from '../PriceCard';
import { AutoRow } from '../Row';
import { AutoColumnToRow } from '../earn/styleds';
import { FooterBlockchains } from '../Blockchains';

const FootContent = styled.div`
  display: flex;
  padding: 35px;
  justify-content: space-between;
  width: 85%;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: start;
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
    <AutoRow
      justify="center"
      gap="1rem"
      padding={isMobile ? '2rem 2rem' : '5rem 2rem 0rem 10rem'}
      style={{ width: '75%' }}
    >
      <AutoColumnToRow
        gap={isMobile ? '1rem' : '0rem'}
        style={{ background: 'rgba(0,0,0,0)', width: isMobile ? '100%' : '85%', justifyContent: 'start' }}
      >
        <Col md={3}>
          <p className={Style.iswap}>ISwap</p>
          <ul className={Style.ul}>
            <li>
              <Link to="/swap" className={`${Style.link} nav-link`}>
                Exchange
              </Link>
            </li>
            <li>
              <Link to="/pool" className={`${Style.link} nav-link`}>
                Liquidity
              </Link>
            </li>
            <li>
              <Link to="/stake" className={`${Style.link} nav-link`}>
                Staking
              </Link>
            </li>
            {/* <li>
              <Link to="/dashboard" className={`${Style.link} nav-link`}>
                Dashboard
              </Link>
            </li> */}
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
        <Col md={3}>
          <p className={Style.footerheader}>About</p>
          <ul className={Style.ul}>
            <li>
              <ExternalLink
                href="https://docs.intercroneswap.finance/security/audits"
                className={`${Style.link} nav-link`}
              >
                Audit
              </ExternalLink>
            </li>
            {/* <li>
              <Link to="/white-paper" className={`${Style.link} nav-link`}>
                White Paper
              </Link>
            </li> */}
            <li>
              <ExternalLink href="https://docs.intercroneswap.finance" className={`${Style.link} nav-link`}>
                FAQ
              </ExternalLink>
            </li>

            <li>
              <ExternalLink
                href="https://docs.intercroneswap.finance/road-map/roadmap"
                className={`${Style.link} nav-link`}
              >
                Roadmap
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                href="https://docs.intercroneswap.finance/faq/how-to-swap-trade-token"
                className={`${Style.link} nav-link`}
              >
                Trading Guide
              </ExternalLink>
            </li>
          </ul>
        </Col>
        <Col md={3}>
          <p className={Style.footerheader}>Blockchains</p>
          <FooterBlockchains />
        </Col>
        <Col md={3} className="lastcol">
          <p className={Style.footerheader}>Developers</p>
          <ul className={Style.ul}>
            <li>
              <ExternalLink href="https://docs.intercroneswap.finance" className={`${Style.link} nav-link`}>
                Documentation
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://github.com/InterCroneworldOrg" className={`${Style.link} nav-link`}>
                Github
              </ExternalLink>
            </li>
          </ul>
        </Col>
      </AutoColumnToRow>
      <Divider />
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
    </AutoRow>
  );
};

export default Footer;
