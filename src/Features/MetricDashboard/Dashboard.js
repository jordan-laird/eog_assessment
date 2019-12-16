import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery, subscriptionExchange, dedupExchange, fetchExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Container, LinearProgress } from '@material-ui/core';
import MetricSelector from './MetricSelector';
import MetricChart from './MetricChart';
import MetricCards from './MetricCards';

const subscriptionClient = new SubscriptionClient('wss://react.eogresources.com/graphql', {
  reconnect: true,
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    fetchExchange,
    subscriptionExchange({ forwardSubscription: operation => subscriptionClient.request(operation) }),
  ],
});

const availableMetricsQuery = `
query {
  getMetrics
}
`;
const Dashboard = () => {
  const dispatch = useDispatch();

  const [result] = useQuery({
    query: availableMetricsQuery,
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;

    dispatch(actions.availableMetricsReceived(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <Container>
      <MetricSelector />
      <MetricCards />
      <MetricChart />
    </Container>
  );
};

export default () => {
  return (
    <Provider value={client}>
      <Dashboard />
    </Provider>
  );
};
