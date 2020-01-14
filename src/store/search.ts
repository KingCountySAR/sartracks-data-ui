import { Reducer, ActionCreator, AnyAction } from "redux"
import { Epic, ofType } from 'redux-observable'
import rxAxios from '../util/rx-axios'

import { switchMap, throttleTime, filter, map, withLatestFrom, catchError, startWith } from 'rxjs/operators'
import { StoreState } from "."
import { of } from "rxjs"
import { ACTION_ROUTE_NAVIGATE } from "./global-actions"

const ACTION_SEARCH_SHOW = 'search/show'  // Show the main search drawer
const ACTION_SEARCH_TYPE = 'search/type'  // Process the immediate updates of the search box
const ACTION_SEARCH_QUERY = 'search/query' // Debounced API query
const ACTION_SEARCH_RESULT = 'search/result' // result of search query
const ACTION_SEARCH_ERROR = 'search/error' // error while searching

interface SearchState {
  list?: any[]
  listLoaded?: boolean
  listLoading?: boolean
  open: boolean
  query: string
}

export const initialState :SearchState = {
  open: false,
  query: ''
}

const show :ActionCreator<AnyAction> = (show :boolean) => ({ type: ACTION_SEARCH_SHOW, payload: { show }})
const typing :ActionCreator<AnyAction> = (query: string) => ({type: ACTION_SEARCH_TYPE, payload: { query }})


export const Actions = {
  show,
  typing
}

export const reducer :Reducer<SearchState> = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SEARCH_SHOW:
      return { ...state, open: action.payload.show, ...(action.payload.show ? {} : { listLoading: false, query: '', list: undefined, listLoaded: false })}

    case ACTION_SEARCH_TYPE:
      return { ...state, query: action.payload.query, listLoaded: false, list: undefined }

    case ACTION_SEARCH_QUERY:
      return { ...state, listLoading: true }

    case ACTION_SEARCH_ERROR:
      return { ...state, listLoading: false }

    case ACTION_SEARCH_RESULT:
      return { ...state,
        listLoading: false,
        listLoaded: action.payload.query === state.query,
        list: action.payload.query === state.query ? action.payload.data : state.list
      }

    case ACTION_ROUTE_NAVIGATE:
        return { ...initialState }

    default:
      return state
  }
}

export const debouncedSearchEpic: Epic<AnyAction, AnyAction, StoreState> = (action$, state$) => 
    action$.pipe(
        ofType(ACTION_SEARCH_TYPE),
        throttleTime(600, undefined, { leading: true, trailing: true }),
        filter(act => act.payload.query.length > 3),
        withLatestFrom(state$),
        switchMap(([act, state]) =>
            rxAxios.get(`${state.config.apis.oldData}/search?q=${encodeURIComponent(act.payload.query)}`).pipe(
              map(response => {
                (response as unknown as any[]).forEach(d => {
                  if (d.type === 'Member') d.summary.photo = `${state.config.apis.oldData}/members/${d.summary.id}/photo?access_token=${state.oidc && state.oidc.user && state.oidc.user.access_token}`
                })

                return ({
                  type: ACTION_SEARCH_RESULT,
                  payload: { data: response, query: act.payload.query }
                })
              }),
              catchError(err => of({type: ACTION_SEARCH_ERROR, payload: err})),
              startWith({type: ACTION_SEARCH_QUERY, payload: act.payload })
            )      
        )
    )

export const epics = [
  debouncedSearchEpic
]