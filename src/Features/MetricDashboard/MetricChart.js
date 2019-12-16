import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { useQuery } from 'urql';
import { LinearProgress } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';

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

const metricToUnit = {
  waterTemp: 'temperature',
  flareTemp: 'temperature',
  oilTemp: 'temperature',
  tubingPressure: 'pressure',
  casingPressure: 'pressure',
  injValveOpen: 'percentage'
};
const metricToColor = {
  waterTemp: '#4263f5',
  flareTemp: '#f54242',
  oilTemp: '#f54242',
  tubingPressure: '#139c20',
  casingPressure: '#5a139c',
  injValveOpen: '#ffa200'
};
const temperature = ['flareTemp', 'waterTemp', 'oilTemp'];
const pressure = ['tubingPressure', 'casingPressure'];

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
      <ResponsiveContainer height={500}>
        <LineChart data={graphData}>
          <XAxis dataKey={'at'} tickFormatter={convertTime} interval={300} />
          {selectedMetrics.some(metric => temperature.includes(metric)) ? (
            <YAxis yAxisId={'temperature'} datakey={'temperature'} dy={-4}>
              <Label value={'°F'} position={'insideTopLeft'} />
            </YAxis>
          ) : null}
          {selectedMetrics.some(metric => pressure.includes(metric)) ? (
            <YAxis yAxisId={'pressure'} datakey={'pressure'} dy={-4}>
              <Label value={'psi'} position={'insideTopLeft'} />
            </YAxis>
          ) : null}
          {selectedMetrics.includes('injValveOpen') ? (
            <YAxis yAxisId={'percentage'} datakey={'percentage'} dy={-4}>
              <Label value={'%'} position={'insideTopLeft'} />
            </YAxis>
          ) : null}
          {selectedMetrics.map(metric => (
            <Line
              key={`lineChart-${metric}`}
              yAxisId={metricToUnit[metric]}
              dataKey={metric}
              dot={false}
              stroke={metricToColor[metric]}
            />
          ))}
          <Tooltip labelFormatter={time => convertTime(time)} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
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