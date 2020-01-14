import { createStore, applyMiddleware, combineReducers, Middleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { reducer as oidc, initialState as oidcInit } from './oidc';
import { reducer as config, initialState as configInit } from './config';
import { reducer as search, initialState as searchInit, epics as searchEpics } from './search';
import { reducer as ui, initialState as uiInit } from './ui';

import { reducer as organizations, initialState as orgsInit } from './organizations';
import { combineEpics, createEpicMiddleware } from 'redux-observable';


const rootReducer = combineReducers({
  config,
  oidc,
  search,
  ui,
  organizations
})

export type StoreState = ReturnType<typeof rootReducer>

const initState :StoreState = {
  oidc: oidcInit,
  config: configInit,
  search: searchInit,
  ui: uiInit,
  organizations: orgsInit
}

const epicMiddleware = createEpicMiddleware()
const middleware :Middleware[] = [
  epicMiddleware,
  thunkMiddleware
]

if(process.env.NODE_ENV === 'development' || (localStorage && localStorage.showLogging)) {
	const loggerMiddleware = createLogger({ collapsed: true });
	middleware.push(loggerMiddleware);
}

const store :Store<StoreState> = createStore<StoreState, any, any, any>(
  rootReducer,
  initState,
  applyMiddleware(...middleware)
)

epicMiddleware.run(combineEpics<any>(...searchEpics))

export default store