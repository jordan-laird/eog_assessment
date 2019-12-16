import { createSlice } from 'redux-starter-kit';

const initialState = {
  availableMetrics:[],
  selectedMetrics: [],
  measurements: [],
  mostRecentMeasurement: {}
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
    intialMeasurementsReceived: (state, action) => {
      state.measurements = action.payload
    },
    newMeasurementReceived: (state, action) => {
      const newMeasurement = action.payload
      const existingObj = state.measurements.find(existing => existing.at === newMeasurement.at)
      state.mostRecentMeasurement[newMeasurement.metric] = newMeasurement.value
      if(existingObj){
        existingObj[newMeasurement.metric] = newMeasurement.value
      }
      else{
        const obj = {at: newMeasurement.at, [newMeasurement.metric]: newMeasurement.value}
        state.measurements.push(obj)
      }
    },
    metricApiErrorReceived: (state, action) => {
      return state
    }
  }
})

export const reducer = slice.reducer
export const actions = slice.actions