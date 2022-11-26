import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ScrollToTop from 'react-scroll-up'
import { useFetchPublicData } from "state/hooks";
import BigNumber from "bignumber.js";
import { ResetCSS, Flex } from "crox-new-uikit";
import { injected, walletconnect, bsc } from "./utils/connector";
import GlobalStyle from "./style/Global";
import PageLoader from "./components/PageLoader";
import NftGlobalNotification from "./views/Nft/components/NftGlobalNotification";
import Header from "./components/Header";
import HeadImage from "./components/HeadImage";
import Footer from "./components/Footer";
import "@szhsin/react-menu/dist/index.css";
import "react-multi-carousel/lib/styles.css";
import './style/scrollTop.css'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import("./views/Home"));
const Farms = lazy(() => import("./views/Farms"));
const NextGen = lazy(() => import("./views/NextGen"));
const DualFarm = lazy(() => import("./views/NextGen/DualFarm"));
const Referral = lazy(() => import("./views/Referral"));
const Ref = lazy(() => import("./views/Ref"));
const Bridge = lazy(() => import("./views/Bridge"));
// const Lottery = lazy(() => import('./views/Lottery'))
// const Pools = lazy(() => import('./views/Pools'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import("./views/NotFound"));
// const Nft = lazy(() => import('./views/Nft'))
const CroxBalance = lazy(() => import("./views/CroxBalance"));

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const App: React.FC = () => {
  const { account, activate } = useWeb3React();
  useEffect(() => {
    if (!account && window.localStorage.getItem("accountStatus")) {
      activate(injected);
    }
  }, [account, activate]);

  useFetchPublicData();

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/farms">
            <HeadImage />
            <Farms />
          </Route>
          <Route path="/hecopools">
            <HeadImage />
            <NextGen />
          </Route>
          <Route path="/hecofarms">
            <HeadImage />
            <DualFarm />
          </Route>
          <Route path="/nests">
            <Farms tokenMode />
          </Route>
          <Route path="/referral">
            <Referral />
          </Route>
          <Route path="/ref/:ref">
            <Ref />
          </Route>
          <Route path="/croxbalance">
            <CroxBalance />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Footer />
      <ScrollToTop showUnder={160} style={{ zIndex: "100000000000000" }}>
        <Flex className="scrollTop" justifyContent='center' alignItems='center'>
          <KeyboardArrowUpIcon />
        </Flex>
      </ScrollToTop>
      <NftGlobalNotification />
    </Router>
  );
};

export default React.memo(App);
