import { createSlice } from 'redux-starter-kit';

const initialState = {
  availableMetrics:[],
  selectedMetrics: [],
}

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    availableMetricsReceived: (state, action) => {
      state.availableMetrics = action.payload
    },
    metricSelected: (state, action) => {
      state.selectedMetrics = [...state.selectedMetrics, action.payload]
    },
    metricDeselected: (state, action) => {
      state.selectedMetrics = state.selectedMetrics.filter(metric => metric !== action.payload)
    },
    metricApiErrorReceived: (state, action) => {
      return state
    }
  }
})

export const reducer = slice.reducer
export const actions = slice.actions