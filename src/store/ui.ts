import { Reducer, ActionCreator, AnyAction } from "redux";

interface UiState {
  inDrawer: boolean
}

export const initialState :UiState = {
  inDrawer: false
}

const showDrawer :ActionCreator<AnyAction> = (show :boolean) => {
  return { type: 'ui/showDrawer', payload: { show }}
}

export const Actions = {
  showDrawer
}

export const reducer :Reducer<UiState> = (state = initialState, action) => {
  switch (action.type) {
    case 'ui/showDrawer':
      return {...state, inDrawer: action.payload.show }
    
    default:
      return state
  }
}