import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Style from '../../styles/footer.module.css';
import chessIcon from '../../assets/images/chessicon.png';
import styled from 'styled-components';
import { Facebook, Youtube, Twitter, Instagram, Send, Info, BookOpen, Image, Activity } from 'react-feather';
import { ExternalLink } from '../../theme';

const ImageWrapper = styled.div`
  width: 100%;
  position: relative;
  top: -375px;
`;
const FootContent = styled.div`
  display: flex;
  padding: 35px;
  justify-content: space-between;
`;
const SocialIconWrapper = styled.div`
  display: flex;
`;
const AmountWrapper = styled.div`
  font-family: Poppins;
  font-size: 16px;
  font-weight: 400;
  color: rgba(243, 201, 20, 1);
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
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
    <Container>
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
        <Col md={4}>
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

        {/* <ImageWrapper>
          <img className={Style.image} width={'150px'} src={chessIcon} alt="logo" />
        </ImageWrapper> */}
      </Row>
      <hr />
      <FootContent>
        <AmountWrapper>
          <span>
            <img width={20} src={chessIcon} alt="" />
          </span>
          $0,002752842788 USD
        </AmountWrapper>
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
