import { Reducer } from "redux";

interface AuthConfigState {
  authority :string
  client_id :string
}

export interface ConfigState {
  apis: Record<string, string>
}

//@ts-ignore
const envConfig = window.envConfig || {}

export const initialState :ConfigState = {
  apis: {
    accounts: 'http://localhost:5100',
    data: 'http://localhost:5300',
    oldData: 'http://localhost:4944/api2',
    messaging: 'http://localhost:5200',
    ...envConfig.apis
  }
}

export const reducer :Reducer<ConfigState> = (state = initialState) => state