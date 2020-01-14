import { Reducer, ActionCreator, AnyAction } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import axios from "axios"
import { StoreState } from "."
import { Actions as toastActions } from './toasts'

interface OrganizationsState {
  list?: any[]
  listLoaded?: boolean
  listLoading?: boolean
  current?: any
  currentLoading?: boolean
}

export interface Organization {
  id: string
}

export type OrganizationWacLevel = 'None' | 'Support' | 'Novice' | 'Field'

export interface OrganizationStatus {
  id: string
  unit: Organization
  name: string
  isActive: boolean
  getsAccount: boolean
  wacLevel: OrganizationWacLevel
  _u: boolean
  _d: boolean
  _deleting?: boolean
  _saving?: boolean
}

export const initialState :OrganizationsState = {
}

const loadList :ActionCreator<ThunkAction<void, {}, {}, AnyAction>> = () =>
  async (dispatch :ThunkDispatch<{}, {}, AnyAction>, getState: () => any) :Promise<any> => {
    const state = getState()
    dispatch({type: 'organizations/list/loading'})
    const msg = await axios.get(`${state.config.apis.oldData}/units`);
    dispatch({ type: 'organizations/list/loaded', payload: msg.data });
  }

const loadDetail :ActionCreator<ThunkAction<void, {}, {}, AnyAction>> = (id :string, keepMessages?: boolean) =>
  async (dispatch :ThunkDispatch<{}, {}, AnyAction>, getState: () => any) :Promise<any> => {
    const state = getState()
    dispatch({type: 'organizations/current/loading', payload: { id }})
    const [detail, reports, statuses] = await Promise.all([
      axios.get(`${state.config.apis.oldData}/units/${id}`),
      axios.get(`${state.config.apis.oldData}/units/${id}/reports`).catch(() => ({ data: [] })),
      axios.get(`${state.config.apis.oldData}/units/${id}/statusTypes`)
    ]);
    
    dispatch({type: 'organizations/current/loaded', payload: { ...detail.data, reports: reports.data, statuses: statuses.data }})
  }

const deleteStatus :ActionCreator<ThunkAction<void, StoreState, {}, AnyAction>> = (orgId: string, id :string) =>
  async (dispatch :ThunkDispatch<StoreState, {}, AnyAction>, getState: () => StoreState) :Promise<any> => {
    const state = getState()
    axios.delete(`${state.config.apis.oldData}/units/${orgId}/statusabc/${id}`)
    .then(() => {
      dispatch({type: 'organizations/status/deleted', payload: { id }})
      dispatch(toastActions.show('Deleted unit status', 2000, 'success'))
    })
    .catch((err) => {
      console.log(err);
      dispatch(loadDetail(orgId));
      dispatch({type: 'organizations/status/delete-fail', payload: { id } });
      dispatch(toastActions.show('Failed to delete status', 0, 'error'))
    })
    return dispatch({type: 'organizations/status/deleting', payload: { id }})
  }

const saveStatus :ActionCreator<ThunkAction<void, StoreState, {}, AnyAction>> = (orgId: string, row: OrganizationStatus) =>
  async (dispatch :ThunkDispatch<StoreState, {}, AnyAction>, getState: () => StoreState) :Promise<any> => {
    const state = getState()
    const preUrl = `${state.config.apis.oldData}/units/${orgId}/statusabc`
    const call = row.id ? axios.put(`${preUrl}/${row.id}`) : axios.post(preUrl)
    call.then(result => {
          dispatch({type: 'organizations/status/saved', payload: { isNew: !row.id, data: result.data }})
          dispatch(toastActions.show('Saved unit status', 2000, 'success'))
        })
        .catch((err) => {
          console.log(err);
          dispatch(loadDetail(orgId));
          dispatch({type: 'organizations/status/save-fail', payload: { data: row } });
          dispatch(toastActions.show('Failed to save status', 0, 'error'))
    })    
    return dispatch({type: 'organizations/status/saving', payload: { data: { ...row, id: row.id || 'pending' } }})
  }

export const Actions = {
  loadList,
  loadDetail,
  deleteStatus,
  saveStatus
}

const getSummary = (state :OrganizationsState, id: string) => {
  if (state.current && state.current.id === id) return state.current
  if (state.listLoaded) {
    const summaries = state.list && state.list.filter(f => f.id === id)
    return summaries && summaries.length ? summaries[0] : undefined
  }
  return undefined
}

const currentReducer :Reducer<any> = (state = initialState.current, action) => {
  if (!state) return state

  const p = action.payload
  switch (action.type) {
    case 'organizations/status/saving':

      return { ...state, statuses: {
          ...state.statuses,
          items: state.statuses.items.concat(p.data.id === 'pending' ? [p.data] : [])
                                     .map((f :OrganizationStatus) => (f.id === p.data.id) ? { ...f, _saving: true } : f)
        }
      }

    case 'organizations/status/saved':
      return { ...state, statuses: {
          ...state.statuses,
          items: state.statuses.items.map((f :OrganizationStatus) => (f.id === p.data.id || f.id === 'pending') ? p.data : f)
        }
      }

    case 'organizations/status/save-fail':
      return { ...state, statuses: {
          ...state.statuses,
          items: state.statuses.items.filter((f :OrganizationStatus) => (f.id !== 'pending'))
                                     .map((f :OrganizationStatus) => (f.id === p.data.id) ? { ...f, _saving: undefined } : f)
        }
      }

    case 'organizations/status/deleting':
      return { ...state, statuses: {
          ...state.statuses,
          items: state.statuses.items.map((f: OrganizationStatus) => (f.id === p.id) ? { ...f, _deleting: true } : f)
        }
      }

    case 'organizations/status/deleted':
      return { ...state, statuses: {
          ...state.statuses,
          items: state.statuses.items.filter((f: OrganizationStatus) => f.id !== p.id)
        }
      }

    case 'organizations/status/delete-fail':
      return { ...state, statuses: {
          ...state.statuses,
          items: state.statuses.items.map((f: OrganizationStatus) => (f.id === p.id) ? { ...f, _deleting: undefined } : f)
        }
      }

    default:
      return state
  }
}

export const reducer :Reducer<OrganizationsState> = (state = initialState, action) => {
  const newCurrent = currentReducer(state.current, action)
  if (newCurrent !== state.current) state = { ...state, current: newCurrent }
  
  switch (action.type) {
    case 'organizations/list/loading':
      return { ...state, listLoading: true }

    case 'organizations/list/loaded':
      return { ...state, listLoaded: true, listLoading: false, list: action.payload.items, canCreate: action.payload.c }

    case 'organizations/current/loading':
      return { ...state, current: getSummary(state, action.payload.id), currentLoading: true}

    case 'organizations/current/loaded':
      return { ...state, current: action.payload, currentLoading: false}

    default:
      return state
  }
}