import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as dashboardReducer } from '../Features/MetricDashboard/reducer';

export default {
  weather: weatherReducer,
  metrics: dashboardReducer 
};
