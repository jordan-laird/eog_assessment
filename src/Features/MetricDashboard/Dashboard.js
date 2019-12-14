import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer'
import { Provider, createClient, useQuery } from 'urql';
import { Container, LinearProgress } from '@material-ui/core';
import MetricSelector from './MetricSelector'

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const availableMetricsQuery = `
query {
  getMetrics
}
`
const Dashboard = () => {
  const dispatch = useDispatch();

  const [result] = useQuery({
    query: availableMetricsQuery
  });
  
  const { fetching, data, error } = result;

  useEffect(() => {
    if(error){
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if(!data) return;
    const { getMetrics } = data;

    dispatch(actions.availableMetricsReceived(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />

  

  return(
    <Container>
      <MetricSelector />
    </Container>
  )
}

export default () => {
  return(
    <Provider value={client}>
      <Dashboard />
    </Provider>
  )
}