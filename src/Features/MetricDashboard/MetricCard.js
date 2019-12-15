import React from 'react';
import { useSubscription } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Container, LinearProgress } from '@material-ui/core';

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


const MetricCard = ({props}) => {
  const selectedMetrics = useSelector(state => state.metrics.selectedMetrics)
  const dispatch = useDispatch();
  const handleSubscription = (existing ={}, newData) => {
    const { newMeasurement } = newData
    if(selectedMetrics.includes(newMeasurement.metric)){
      dispatch(actions.newMeasurementReceived(newMeasurement))
    }
  }
  const [result] = useSubscription({
    query: metricSubscription
  }, handleSubscription)

  const { data } = result;

  return(<div>props</div>)
}

export default () => {
  return(
    <MetricCard />
  )
}
