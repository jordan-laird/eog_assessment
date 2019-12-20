import React from 'react';
import { useSubscription } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Card, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles({
  card: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    maxWidth: 200,
    textAlign: 'center',
  },
});

const MetricCards = () => {
  const classes = useStyles();
  const mostRecentMeasurements = useSelector(state => state.metrics.mostRecentMeasurement);
  const selectedMetrics = useSelector(state => state.metrics.selectedMetrics);
  const dispatch = useDispatch();
  const handleSubscription = (existing = {}, newData) => {
    const { newMeasurement } = newData;
    if (selectedMetrics.includes(newMeasurement.metric)) {
      dispatch(actions.newMeasurementReceived(newMeasurement));
    }
  };
  useSubscription(
    {
      query: metricSubscription,
    },
    handleSubscription,
  );

  const metricCard = () => {
    return selectedMetrics.map(metric => {
      return (
        <Grid item xs={2} key={metric}>
          <Card className={classes.card} key={metric}>
            <Typography variant="h5">{metric}</Typography>
            <Typography variant="h6">{mostRecentMeasurements[metric]}</Typography>
          </Card>
        </Grid>
      );
    });
  };

  return <Grid container>{metricCard()}</Grid>;
};

export default () => {
  return <MetricCards />;
};
