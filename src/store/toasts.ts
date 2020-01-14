import { Reducer, ActionCreator, AnyAction } from "redux"

let nextId = 1
type ToastSeverity = 'error' | 'success'

export interface Toast {
  id: number
  text: string
  severity?: ToastSeverity
  timeout: number
}

interface ToastState {
  items: Toast[]
}

export const initialState :ToastState = {
  items: []
}

const show :ActionCreator<AnyAction> = (text :string, timeout?: number, severity?: ToastSeverity) => ({ type: 'toast/add', payload: { id: nextId++, text, severity, timeout: timeout||0 }})

const finish :ActionCreator<AnyAction> = (id: number) => ({ type: 'toast/finish', payload: { id }})

export const Actions = {
  show,
  finish
}

export const reducer :Reducer<ToastState> = (state = initialState, action) => {
  switch (action.type) {
    case 'toast/add':
      const newItems = [...state.items, action.payload]
      if (newItems.length > 1) {
        const before = newItems[newItems.length - 2]
        if (before.timeout > 1000) newItems[newItems.length - 2] = { ...before, timeout: 1000 }
      }
      return { ...state, items: newItems }

    case 'toast/finish':
      return { ...state, items: state.items.filter(f => f.id !== action.payload.id)}

    default:
      return state
  }
}