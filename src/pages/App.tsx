import { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter';
// import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header';
import Footer from '../components/Footer';
// import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning';
import Popups from '../components/Popups';
import Web3ReactManager from '../components/Web3ReactManager';
// import { ApplicationModal } from '../state/application/actions'
// import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader';
import AddLiquidity from './AddLiquidity';
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './AddLiquidity/redirects';
import { VoteComingSoon } from './Vote/vote';
// import Earn from './Earn'
// import Manage from './Earn/Manage'
// import MigrateV from './MigrateV'
// import MigrateVExchange from './MigrateV/MigrateVExchange'
// import RemoveVExchange from './MigrateV/RemoveVExchange'
import Pool from './Pool';
import Stake from './Stake';
import PoolFinder from './PoolFinder';
import RemoveLiquidity from './RemoveLiquidity';
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects';
import Swap from './Swap';
import Sample from './Sample';
// import Home from './Home';
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects';
import { RedirectToReferal } from './Stake/redirects';
import ChessLarge from '../assets/images/chess-big-icon.png';
import { isMobile } from '../theme';
import Markets from './Markets';
// import Vote from './Vote'
// import VotePage from './Vote/VotePage'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  // overflow-x: hidden;
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;
const FooterWrapper = styled.footer`
  display: flex;
  width: 100%;
  padding: 30px 0 15px 0;
  justify-content: space-between;
  background: linear-gradient(180deg, rgba(28, 28, 28, 0) 0%, rgba(51, 51, 51, 0.4) 18.21%, #333333 38.13%);
`;

const ChessIcon = styled.div`
  background: url(${ChessLarge});
  height: 581px;
  width: 294px;
  overflow: hidden;
  margin-left: 7rem;
  margin-bottom: -15px;
  border-radius: 0px;
  opacity: 0.7;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  // justify-content: center;
  padding-top: 0px;
  align-items: center;
  flex: 1;
  overflow-y: hidden;
  overflow-x: hidden;
  z-index: 10;

  /* ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `}; */

  z-index: 1;
`;

const Marginer = styled.div`
  margin-top: 5rem;
`;

export const StyledHeading = styled.h1`
  font-style: normal;
  font-weight: 900;
  font-size: 56px;
  line-height: 72px;
  text-align: center;
  width: 100%;
  color: ${({ theme }) => theme.gradient1};
  background: ${({ theme }) => theme.gradient1};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 20px 20px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size:46px;
  line-height: 62px;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size:50px;
  line-height: 66px;
`};
`;

// function TopLevelModals() {
//   const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
//   const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
//   return <AddressClaimModal isOpen={open} onDismiss={toggle} />
// }

export default function App() {
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <URLWarning />
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          {/* <YellowStar></YellowStar>
          <CGreen></CGreen>
          <BrownStar></BrownStar>
          <HexaGon></HexaGon>
          <BlueCircle></BlueCircle>
          <CGreenSimpleDiv></CGreenSimpleDiv>
          <DarkGreenStar></DarkGreenStar>
          <BlueStar></BlueStar>
          <LeftLine></LeftLine>
          <LeftLine1></LeftLine1>
          <RightLine></RightLine>
          <RightLine1></RightLine1> */}
          <Popups />
          {/* <Polling /> */}
          {/* <TopLevelModals /> */}
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/nft" component={Sample} />
              <Route exact strict path="/dashboard" component={Sample} />
              <Route exact strict path="/market" component={Sample} />
              <Route exact strict path="/audit" component={Sample} />
              <Route exact strict path="/white-paper" component={Sample} />
              <Route exact strict path="/faq" component={Sample} />
              <Route exact strict path="/roadmap" component={Sample} />
              <Route exact strict path="/travel-guide" component={Sample} />

              {/* <Route exact strict path="/" component={Home} /> */}
              {/* <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} /> */}
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/stake" component={Stake} />
              <Route exact strict path="/stake/:referal" component={RedirectToReferal} />
              <Route exact strict path="/markets" component={Markets} />
              {/* <Route exact strict path="/vote" component={Vote} /> */}
              <Route exact strict path="/votepage" component={VoteComingSoon} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              {/* <Route exact strict path="/remove/v/:address" component={RemoveVExchange} /> */}
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              {/* <Route exact strict path="/migrate/v" component={MigrateV} /> */}
              {/* <Route exact strict path="/migrate/v/:address" component={MigrateVExchange} /> */}
              {/* <Route exact strict path="/vote/:id" component={VotePage} /> */}
              <Route component={RedirectPathToSwapOnly} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
        </BodyWrapper>
        <FooterWrapper>
          <Footer />
          {!isMobile && <ChessIcon />}
        </FooterWrapper>
      </AppWrapper>
    </Suspense>
  );
}
