import { createStore, applyMiddleware, combineReducers, Middleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { reducer as oidc, initialState as oidcInit } from './oidc';
import { reducer as config, initialState as configInit } from './config';


const rootReducer = combineReducers({
  config,
  oidc
})

export type StoreState = ReturnType<typeof rootReducer>

const initState :StoreState = {
  oidc: oidcInit,
  config: configInit
}

const middleware :Middleware[] = [
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

export default store