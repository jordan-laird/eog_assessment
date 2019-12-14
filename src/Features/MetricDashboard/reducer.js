import { createSlice } from 'redux-starter-kit';

const initialState = {
  availableMetrics:[]
}

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    availableMetricsReceived: (state, action) => {
      state.availableMetrics = action.payload
    },
    metricApiErrorReceived: (state, action) => {
      return state
    }
  }
})

export const reducer = slice.reducer
export const actions = slice.actions