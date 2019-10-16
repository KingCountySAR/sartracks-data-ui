import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { loadUser, OidcProvider, processSilentRenew } from 'redux-oidc';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';

import App from './App';
import store from './store';
import { Actions as authActions } from './store/oidc';
import userManager from './user-manager';

import * as serviceWorker from './serviceWorker';
import { ThunkDispatch } from 'redux-thunk';

function silentSignin() {
  store.dispatch({type: 'redux-oidc/LOADING_USER'});
  userManager.signinSilent().then(user => {
    // Nothing to do, handled by oidc-client-js internally
    }, err => {
      //@ts-ignore
      userManager.events._raiseSilentRenewError(err);
  });
}

function start() {
  axios.interceptors.request.use(config => {
    const user = store.getState().oidc.user as any
    if (user && user.access_token) {
      config.headers['Authorization'] = 'Bearer ' + user.access_token
    }
    return config
  }, error => Promise.reject(error))

  const dispatch = store.dispatch as ThunkDispatch<{}, {}, any>

  userManager.events.addUserLoaded(() => {
    // After the store gets to reduce this event we want to start loading the user's groups.
    window.setTimeout(() => { dispatch(authActions.loadGroups()) }, 1)
  })

  loadUser(store, userManager)
  .then(user => {
    if (user) {
      dispatch(authActions.loadGroups())
    } else {
      silentSignin();
    }
  }).catch((err) => {
    console.log('loaduser catch', err)
    silentSignin();
  })

  ReactDOM.render(
    <Provider store={store}>
      <i style={{display:'none'}} className='fas fa-spinner' />{/*load the icon font as soon as possible */}
      <OidcProvider store={store} userManager={userManager}>
        <BrowserRouter basename='/'>
          <App />
        </BrowserRouter>
      </OidcProvider>
    </Provider>,
    document.getElementById('root'));


  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
}

if (window.location.pathname.endsWith('silent-renew.html')) {
  processSilentRenew()
} else {
  start();
}