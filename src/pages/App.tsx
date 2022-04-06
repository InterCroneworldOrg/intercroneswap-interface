import { Suspense } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter';
import Header from '../components/Header';
import URLWarning from '../components/Header/URLWarning';
import Popups from '../components/Popups';
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader';

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

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`;

const Marginer = styled.div`
  margin-top: 5rem;
`;

const StyledHeading = styled.h1`
  text-transform: uppercase;
  font-family: Jost;
  font-style: normal;
  font-weight: 900;
  font-size: 56px;
  line-height: 72px;
  text-align: center;
  width: 100%;
  color: ${({ theme }) => theme.primary3};
  background: ${({ theme }) => theme.primary1};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 0px 10px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size:46px;
  line-height: 62px;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size:50px;
  line-height: 66px;
`};
`;

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
        <StyledHeading>Welcome to InterCrone World</StyledHeading>
        <BodyWrapper>
          <Popups />
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  );
}
