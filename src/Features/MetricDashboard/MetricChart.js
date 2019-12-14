import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { useQuery } from 'urql';
import { LinearProgress } from '@material-ui/core';
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const initialMeasurementsQuery = `
query($input: [MeasurementQuery!]){
  getMultipleMeasurements(input: $input){
    metric
    measurements{
      at
      value
      unit
    }
  }
}
`;

const convertMeasurementData = (data) => {
  const dataPoints = []
  data.forEach(metric => {
    metric.measurements.forEach(measurement => {
      const existingObj = dataPoints.find(existing => existing.at === measurement.at)
      if(existingObj){
        existingObj[metric.metric] = measurement.value
      }else{
        const obj = {at: measurement.at, [metric.metric]: measurement.value}
        dataPoints.push(obj)
      }
    })
  })
  return dataPoints
}

const MetricChart = () => {
  const dispatch = useDispatch();
  const selectedMetrics = useSelector(state => state.metrics.selectedMetrics).map(metric =>({
    metricName: metric,
    after: new Date().getTime() - 18E5
  }))

  const [result] = useQuery({
    query: initialMeasurementsQuery,
    variables:{
      input: selectedMetrics
    }
  })

  const { fetching, data, error } = result;

  useEffect(() => {
    if(error){
      dispatch(actions.metricApiErrorReceived({error: error.message}));
      return;
    }
    if(!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.intialMeasurementsReceived(convertMeasurementData(getMultipleMeasurements)));
  }, [dispatch, data, error])
  
  return(
    <div>HERE</div>
  )
}

export default () => {
  return(
    <MetricChart />
  )
}