import React from 'react';
import { useSubscription } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Card } from '@material-ui/core';

const metricSubscription = `
subscription {
  newMeasurement{
    value
    metric
    unit
    at
  }
}
`;

const MetricCards = () => {
  const measurements = useSelector(state => state.metrics.measurements)
  const selectedMetrics = useSelector(state => state.metrics.selectedMetrics)
  const dispatch = useDispatch();
  const handleSubscription = (existing ={}, newData) => {
    const { newMeasurement } = newData
    if(selectedMetrics.includes(newMeasurement.metric)){
      dispatch(actions.newMeasurementReceived(newMeasurement))
    }
  }
  useSubscription({
    query: metricSubscription
  }, handleSubscription)

  const metricCard = () => {
    return selectedMetrics.map(metric => {
        const newestMeasurement = measurements.length ? measurements[measurements.length - 1][metric] : '';
        return(<Card>{metric + ":" + newestMeasurement}</Card>)
    })
  }

  return(
    <div>
      {metricCard()}
    </div>
  )
}

export default () => {
  return(
    <MetricCards />
  )
}
