import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { useQuery } from 'urql';
import { LinearProgress } from '@material-ui/core';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

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

const convertTime = (timeStamp) => {
  const timeConverted = new Date(timeStamp).toLocaleTimeString()
  return timeConverted
} 

const metricToUnit ={
  waterTemp: "F",
  flareTemp: "F",
  oilTemp: "F",
  tubingPressure: "psi",
  casingPressure: "psi",
  injValveOpen: "%"
}

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

const timeThirtyMinutesAgo = new Date().getTime() - 18E5

const MetricChart = () => {
  const dispatch = useDispatch();
  const selectedMetrics = useSelector(state => state.metrics.selectedMetrics)
  const selectedMetricsInput = selectedMetrics.map(metric =>({
    metricName: metric,
    after: timeThirtyMinutesAgo
  }))

  const [result] = useQuery({
    query: initialMeasurementsQuery,
    variables:{
      input: selectedMetricsInput
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

  const graphData = useSelector(state => state.metrics.measurements)

  if(fetching) return <LinearProgress />;
  
  if(graphData.length > 0){
    return (
      <LineChart width={1000} height={500} data={graphData}>
        <XAxis dataKey="at" />
        <YAxis />
        {selectedMetrics.map(metric => {
          return (<Line key={`lineChart-${metric}`} dataKey={metric} dot={false} />)
        })}
      </LineChart>
    );
  }else{
    return(<div />)
  }
}

export default () => {
  return(
    <MetricChart />
  )
}