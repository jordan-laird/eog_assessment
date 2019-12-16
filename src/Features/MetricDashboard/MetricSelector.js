import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Select, MenuItem, Chip, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  metricSelector: {
    minWidth: 150,
    marginTop: 10,
    marginBottom: 10,
  },
  selectedChip: {
    marginLeft: 2,
    marginRight: 2,
  },
});

const MetricSelector = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const availableMetrics = useSelector(state => state.metrics.availableMetrics);
  const selectedMetrics = useSelector(state => state.metrics.selectedMetrics);
  const metricsForSelectDropdown = availableMetrics.filter(metric => !selectedMetrics.includes(metric));

  const selectMetric = e => {
    dispatch(actions.metricSelected(e.target.value));
  };

  const deselectMetric = value => {
    dispatch(actions.metricDeselected(value));
  };

  return (
    <div>
      <FormControl className={classes.metricSelector}>
        <InputLabel id="metricSelect">Select Metric</InputLabel>
        <Select
          labelId="metricSelect"
          value={selectedMetrics.length ? selectedMetrics : ''}
          onChange={selectMetric}
          renderValue={selected => (
            <div>
              {selected.map(value => (
                <Chip
                  className={classes.selectedChip}
                  value={value}
                  key={`${value}:selected`}
                  onDelete={() => deselectMetric(value)}
                  label={value}
                />
              ))}
            </div>
          )}
        >
          {metricsForSelectDropdown.map(metric => (
            <MenuItem key={metric} value={metric}>
              {metric}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default () => {
  return <MetricSelector />;
};
