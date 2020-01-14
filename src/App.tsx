import React, { Dispatch, useEffect } from 'react';
import { Route, Link, withRouter, useHistory } from 'react-router-dom';
import { Location } from 'history';
//@ts-ignore
import useDimensions from 'react-use-dimensions';
import { Drawer as MuiDrawer } from './components/material';
import Drawer from './components/drawer';
import Header from './components/header';
import MainMenu from './components/main-menu';

import './App.scss';
import LoggedInHandler from './components/auth/logged-in'
import { AuthRoute } from './components/auth/AuthRoute';
import SearchDrawer from './components/search-drawer';
import { StoreState } from './store';
import { ACTION_ROUTE_NAVIGATE } from './store/global-actions';
import { connect } from 'react-redux';
import { OidcState, Actions as oidcActions } from './store/oidc';
import { Actions as uiActions } from './store/ui';
import { Actions as searchActions } from './store/search';
import { User } from 'oidc-client';

import pages from './pages';

const MainPageInner :React.FC<{oidc: OidcState}> = ({oidc}) => (
  <AuthRoute oidc={oidc} loading='loading user' denied='access denied'>
    <div>Welcome {oidc.user && oidc.user.profile.name}</div>
    <Link to="/admin">The restricted area</Link>
  </AuthRoute>
)
//const MainPage = connect((store :StoreState) => ({ oidc: store.oidc }))(MainPageInner); 

const RestrictedPageInner :React.FC<{oidc: OidcState}> = ({oidc}) => (
  <AuthRoute oidc={oidc} loading='checking access ...'>This is a restricted area.</AuthRoute>
)
const RestrictedPage = connect((store :StoreState) => ({ oidc: store.oidc }))(RestrictedPageInner)


interface AppProps {
  user? :User
  isLoadingUser? :boolean
  inDrawer :boolean
  inSearch :boolean
}
interface AppActions {
  doSignin: () => void,
  doSignout: () => void,
  showDrawer: (show :boolean) => void,
  showSearch: (show :boolean) => void
  announceNavigate: (location: Location<any>) => void
}


const App :React.FC<AppProps & AppActions & { location :Location }> = (props) => {
  const { user, isLoadingUser, showDrawer, inDrawer, showSearch, inSearch, doSignin, doSignout, announceNavigate } = props
  const [ref, { width }] = useDimensions();
  const fixedDrawer = width >= 768
  const history = useHistory()

  useEffect(() => history.listen(location => { announceNavigate(location) }), [history, announceNavigate])
 
  return (
    <React.Fragment>
      <Header user={user} isLoadingUser={isLoadingUser} hasDrawer={!fixedDrawer} showDrawer={showDrawer} showSearch={showSearch} doSignin={doSignin} doSignout={doSignout} />
      <div ref={ref} className='main-container'>
        {user ? <Drawer fixed={fixedDrawer} open={inDrawer} showDrawer={showDrawer}>
          <MainMenu location={props.location} onActed={() => showDrawer(false)} />
        </Drawer> : null }
        <div className='main-content'>
          <Route path='/' onChange={(args :any) => { console.log(args) }}>
            <Route exact path='/loggedIn' component={LoggedInHandler} />
            <Route exact path='/' component={pages.MainPage} />
            <Route exact path='/units' component={pages.UnitsPage} />
            <Route exact path='/units/:id' component={pages.UnitDetailsPage} />
            <Route exact path='/admin' component={RestrictedPage} />
          </Route>
        </div>
        <MuiDrawer anchor="right" style={{maxWidth: '80%'}} open={inSearch} onClose={() => showSearch(false)}>
          <SearchDrawer />
        </MuiDrawer>
      </div>
    </React.Fragment>
  );
}

const storeToProps = (store :StoreState) :AppProps => ({
    user: store.oidc.user,
    isLoadingUser: store.oidc.isLoadingUser,
    inDrawer: store.ui.inDrawer,
    inSearch: store.search.open
})

const dispatchToProps = (dispatch :Dispatch<any>) :AppActions => ({
  doSignin: () => dispatch(oidcActions.doSignin()),
  doSignout: () => dispatch(oidcActions.doSignout()),
  showDrawer: (show: boolean) => dispatch(uiActions.showDrawer(show)),
  showSearch: (show: boolean) => dispatch(searchActions.show(show)),
  announceNavigate: (location: Location<any>) => dispatch({type: ACTION_ROUTE_NAVIGATE, payload: location })
})

export default withRouter(connect(storeToProps, dispatchToProps)(App))
