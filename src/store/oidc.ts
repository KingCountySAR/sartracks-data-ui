import { reducer as oidc, UserState } from 'redux-oidc';
import axios from 'axios';
import { AnyAction, ActionCreator, Action, Reducer } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import userManager from '../user-manager';

export const SIGNING_OUT = 'oidc/SIGNING_OUT';
export const LOADING_GROUPS = 'oidc/LOADING_GROUPS';
export const LOADED_GROUPS = 'oidc/LOADED_GROUPS';

export interface OidcState extends UserState {
  isSigningOut? :boolean
  loadingGroups? :boolean,
  groups?: string[]
}

export const initialState :OidcState = {
  isLoadingUser: false
}

const doSignin :ActionCreator<ThunkAction<void, {}, {}, AnyAction>> = () =>
  (_dispatch :ThunkDispatch<{}, {}, AnyAction>, getState: () => any) :Promise<any> => {
      var state = getState();
      if (!state.oidc.user || !state.oidc.user.token_type) {
        const origin = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
        sessionStorage.setItem('redirect', window.location.href.substring(origin.length))
        return userManager.signinRedirect();
      }
      return Promise.resolve()
    }

const doSignout :ActionCreator<ThunkAction<void, {}, {}, AnyAction>> = () =>
   (dispatch :ThunkDispatch<{}, {}, AnyAction>) :Action => {
     userManager.signoutRedirect();
     return dispatch({type: SIGNING_OUT })
   }

const loadGroups :ActionCreator<ThunkAction<void, {}, {}, AnyAction>> = () =>
(dispatch :ThunkDispatch<{}, {}, AnyAction>, getState: () => any) :Promise<any> => {
  const state = getState()
  if (!state.oidc.user) return Promise.resolve();

  dispatch({type: LOADING_GROUPS, state: getState() });
  return axios.get(`${state.config.apis.accounts}/Account/${state.oidc.user.profile.sub}/Groups`)
  .then((msg) => {
    dispatch({type: LOADED_GROUPS, payload: { groups: msg.data.data, userId: state.oidc.user.profile.sub }})
  })
}

export const Actions = {
  doSignin,
  doSignout,
  loadGroups
}

export const reducer :Reducer<OidcState> = (state = initialState, action) => {
  const newState = oidc(state, action) as OidcState

  switch (action.type) {
    // case PRELOAD:
    //   return {...newState, ...action.payload, preload: true, signedIn: true, isLoadingUser: true }

    case SIGNING_OUT:
      return ({...newState, isLoadingUser: true});

    case LOADING_GROUPS:
      return ({...newState, loadingGroups: true});

    case LOADED_GROUPS:
      return ({...newState, loadingGroups: false, groups: action.payload.groups })

    case 'redux-oidc/SESSION_TERMINATED':
      // If the user is signing out it may be a few seconds before the redirect kicks in. Instead we immediately
      // want to show we don't have an associated user anymore
      return { ...newState, isLoadingUser: true };

    default:
      return newState.isSigningOut ? {...newState, isSigningOut: false } : newState;
  }
}