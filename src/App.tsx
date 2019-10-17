import React, { Dispatch } from 'react';
import { Route, Link } from 'react-router-dom';
//@ts-ignore
import useDimensions from 'react-use-dimensions';

import Drawer from './components/drawer';
import Header from './components/header';

import './App.css';
import LoggedInHandler from './components/auth/logged-in'
import { AuthRoute } from './components/auth/AuthRoute';
import { StoreState } from './store';
import { connect } from 'react-redux';
import { OidcState, Actions as oidcActions } from './store/oidc';
import { Actions as uiActions } from './store/ui';
import { User } from 'oidc-client';

const MainPageInner :React.FC<{oidc: OidcState}> = ({oidc}) => (
  <AuthRoute oidc={oidc} loading='loading user' denied='access denied'>
    <div>Welcome {oidc.user && oidc.user.profile.name}</div>
    <Link to="/admin">The restricted area</Link>
  </AuthRoute>
)
const MainPage = connect((store :StoreState) => ({ oidc: store.oidc }))(MainPageInner); 

const RestrictedPageInner :React.FC<{oidc: OidcState}> = ({oidc}) => (
  <AuthRoute oidc={oidc} loading='checking access ...'>This is a restricted area.</AuthRoute>
)
const RestrictedPage = connect((store :StoreState) => ({ oidc: store.oidc }))(RestrictedPageInner)


interface AppProps {
  user? :User
  isLoadingUser? :boolean
  inDrawer :boolean
}
interface AppActions {
  doSignin: () => void,
  doSignout: () => void,
  showDrawer: (show :boolean) => void
}


const App :React.FC<AppProps & AppActions> = (props) => {
  const { user, isLoadingUser, showDrawer, inDrawer, doSignin, doSignout } = props
  const [ref, { width }] = useDimensions();
  const fixedDrawer = width >= 768
  console.log(width, fixedDrawer)
  return (
    <React.Fragment>
      <Header user={user} isLoadingUser={isLoadingUser} hasDrawer={!fixedDrawer} showDrawer={showDrawer} doSignin={doSignin} doSignout={doSignout} />
      <div ref={ref} className='main-container'>
        <Drawer fixed={fixedDrawer} open={inDrawer} showDrawer={showDrawer}>
          Hi there!
        </Drawer>
        <div>
          <Route exact path='/loggedIn' component={LoggedInHandler} />
          <Route exact path='/' component={MainPage} />
          <Route exact path='/admin' component={RestrictedPage} />
        </div>
      </div>
    </React.Fragment>
  );
}

const storeToProps = (store :StoreState) :AppProps => ({
    user: store.oidc.user,
    isLoadingUser: store.oidc.isLoadingUser,
    inDrawer: store.ui.inDrawer
})

const dispatchToProps = (dispatch :Dispatch<any>) :AppActions => ({
  doSignin: () => dispatch(oidcActions.doSignin()),
  doSignout: () => dispatch(oidcActions.doSignout()),
  showDrawer: (show: boolean) => dispatch(uiActions.showDrawer(show))
})

export default connect(storeToProps, dispatchToProps)(App)
