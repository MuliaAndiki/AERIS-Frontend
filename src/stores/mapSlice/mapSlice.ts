import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EnvironmentalMetric {
  label: string;
  value: number;
  unit: string;
  level: 'good' | 'moderate' | 'poor' | 'unhealthy';
  icon?: string; // Store icon name instead of React component
}

export interface Alert {
  id: string;
  type: 'warning' | 'info';
  title: string;
  description: string;
  icon?: string;
}

export interface GreenSpace {
  id: string;
  name: string;
  distance: number;
  status: string;
  tags: string[];
  latitude?: number;
  longitude?: number;
}

export interface ScoreHistory {
  date: string;
  score: number;
  change: number;
}

export interface Recommendation {
  id: string;
  message: string;
  severity: number; // 0-2 (low, medium, high)
  recommendationType?: string;
  icon?: string;
}

export interface MapState {
  location: string;
  latitude?: number;
  longitude?: number;
  environmentalScore: number;
  metrics: EnvironmentalMetric[];
  alerts: Alert[];
  recommendations: Recommendation[];
  greenSpaces: GreenSpace[];
  scoreHistory: ScoreHistory[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: MapState = {
  location: '',
  environmentalScore: 0,
  metrics: [],
  alerts: [],
  recommendations: [],
  greenSpaces: [],
  scoreHistory: [],
  searchQuery: '',
  loading: true,
  error: null,
  lastUpdated: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // Set all map data
    setMapData(state, action: PayloadAction<Omit<MapState, 'loading' | 'error' | 'lastUpdated'>>) {
      const {
        location,
        latitude,
        longitude,
        environmentalScore,
        metrics,
        alerts,
        recommendations,
        greenSpaces,
        scoreHistory,
        searchQuery,
      } = action.payload;
      state.location = location;
      state.latitude = latitude;
      state.longitude = longitude;
      state.environmentalScore = environmentalScore;
      state.metrics = metrics;
      state.alerts = alerts;
      state.recommendations = recommendations;
      state.greenSpaces = greenSpaces;
      state.scoreHistory = scoreHistory;
      state.searchQuery = searchQuery;
      state.lastUpdated = Date.now();
    },

    // Update environmental score (for real-time WebSocket updates)
    updateEnvironmentalScore(state, action: PayloadAction<number>) {
      state.environmentalScore = action.payload;
      state.lastUpdated = Date.now();
    },

    // Update single metric
    updateMetric(state, action: PayloadAction<{ label: string; value: number; level: string }>) {
      const metricIndex = state.metrics.findIndex((m) => m.label === action.payload.label);
      if (metricIndex !== -1) {
        state.metrics[metricIndex].value = action.payload.value;
        state.metrics[metricIndex].level = action.payload.level as any;
        state.lastUpdated = Date.now();
      }
    },

    // Add new alert
    addAlert(state, action: PayloadAction<Alert>) {
      state.alerts.unshift(action.payload);
      state.lastUpdated = Date.now();
    },

    // Remove alert
    removeAlert(state, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },

    // Update location
    setLocation(
      state,
      action: PayloadAction<{ location: string; latitude?: number; longitude?: number }>
    ) {
      state.location = action.payload.location;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.lastUpdated = Date.now();
    },

    // Set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Set error
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },

    // Reset to initial state
    resetMapData(state) {
      return initialState;
    },
  },
});

export const {
  setMapData,
  updateEnvironmentalScore,
  updateMetric,
  addAlert,
  removeAlert,
  setLocation,
  setLoading,
  setError,
  clearError,
  resetMapData,
} = mapSlice.actions;

export default mapSlice.reducer;
