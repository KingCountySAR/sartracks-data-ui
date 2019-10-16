import React, { Dispatch } from 'react';
import { Route, Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import LoggedInHandler from './components/auth/logged-in'
import { AuthRoute } from './components/auth/AuthRoute';
import { StoreState } from './store';
import { connect } from 'react-redux';
import { OidcState, Actions as oidcActions } from './store/oidc';
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
}
interface AppActions {
  doSignin: () => void,
  doSignout: () => void
}

class App extends React.Component<AppProps & AppActions, { isOpen :boolean }> {
  state = {
    isOpen: false
  }

  toggleAuth = () => {
    const { user, doSignin, doSignout } = this.props
    if (user && user.token_type) {
      doSignout()
    } else {
      doSignin()
    }
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  render() {
    const { user, isLoadingUser } = this.props

    return (
      <React.Fragment>
        <Navbar color='dark' dark expand="md">
          <Link to='/' className='navbar-brand'>SITE_NAME</Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className='ml-auto' navbar>
              <NavItem>
                {isLoadingUser
                  ? <span className='navbar-text'><FontAwesomeIcon icon={faSpinner} spin /></span>
                  : <button className='nav-link' onClick={this.toggleAuth}>Sign {user && user.token_type ? 'out' : 'in'}</button>
              }</NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Route exact path='/loggedIn' component={LoggedInHandler} />
        <Route exact path='/' component={MainPage} />
        <Route exact path='/admin' component={RestrictedPage} />
      </React.Fragment>
    );
  }
}

const storeToProps = (store :StoreState) :AppProps => ({
    user: store.oidc.user,
    isLoadingUser: store.oidc.isLoadingUser
})

const dispatchToProps = (dispatch :Dispatch<any>) :AppActions => ({
  doSignin: () => dispatch(oidcActions.doSignin()),
  doSignout: () => dispatch(oidcActions.doSignout())
})

export default connect(storeToProps, dispatchToProps)(App)
