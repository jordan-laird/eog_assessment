import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Select, MenuItem, Chip } from '@material-ui/core';


const MetricSelector = () => {
  const dispatch = useDispatch();
  const availableMetrics = useSelector(state => state.metrics.availableMetrics);
  const selectedMetrics = useSelector(state => state.metrics.selectedMetrics);
  const metricsForSelectDropdown = availableMetrics.filter(metric => !selectedMetrics.includes(metric))

  const selectMetric = (e) => {
    dispatch(actions.metricSelected(e.target.value));
  }

  const deselectMetric = (value) => {
    dispatch(actions.metricDeselected(value));
  }


  return (
    <div>
      <Select
        value={selectedMetrics}
        onChange={selectMetric}
        renderValue={selected => (
          <div>
            {selected.map(value => (
              <Chip value={value} key={`${value}:selected`}onDelete={() => deselectMetric(value)} label={value} />
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
    </div>
  );
}

export default () => {
  return(
    <MetricSelector />
  )
}