import { Col, Container, Row } from 'react-bootstrap';
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
              <ExternalLink href="https://trx.intercroneswap.com/#/swap" className={`${Style.link} nav-link`}>
                Exchange
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://trx.intercroneswap.com/#/pool" className={`${Style.link} nav-link`}>
                Liquidity
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://trx.intercroneswap.com/#/stake" className={`${Style.link} nav-link`}>
                Staking
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://trx.intercroneswap.com/#/nft" className={`${Style.link} nav-link`}>
                NFT
              </ExternalLink>
            </li>
            {/* <li>
              <Link to="/market" className={`${Style.link} nav-link`}>
                Market
              </Link>
            </li> */}
          </ul>
        </Col>
        <Col md={4}>
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
        <Col md={4} className="lastcol">
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
