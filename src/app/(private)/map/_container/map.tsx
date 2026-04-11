'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapScreenSection from '@/components/section/(private)/map-screen-section';
import EnvironmentApi from '@/services/env/env.service';
import ScoringApi from '@/services/scoring/scoring.service';
import InsightApi from '@/services/insight/insight.service';
import LocationApi from '@/services/location/location.service';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';
import {
  setMapData,
  setLoading,
  setError,
  setLocation,
  type EnvironmentalMetric,
  type Alert,
  type GreenSpace,
  type ScoreHistory,
  clearError,
} from '@/stores/mapSlice/mapSlice';
import { RootState, AppDispatch } from '@/stores/store';

import { Wind, Flame, Droplets, Volume2, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

export default function MapContainer() {
  // ══ REDUX STATE ══
  const dispatch = useDispatch<AppDispatch>();
  const mapState = useSelector((state: RootState) => state.map);
  const {
    location,
    latitude,
    longitude,
    environmentalScore,
    metrics,
    alerts,
    greenSpaces,
    scoreHistory,
    loading,
    error,
  } = mapState;

  // ══ LOCAL STATE ══
  const [searchQuery, setSearchQuery] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  // ══ WEBSOCKET - Real-time score updates ══
  useMapWebSocket({
    enabled: true,
    pollInterval: 30000, // Poll every 30 seconds
    onScoreUpdate: (score) => {
      console.log('Score updated via WebSocket:', score);
    },
  });

  // ══ DETECT USER LOCATION ON MOUNT ══
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setDetectingLocation(true);
        const response = await LocationApi.Detect();

        if (response.data?.city && response.data?.country) {
          const locationString = `${response.data.city}, ${response.data.country}`;
          dispatch(
            setLocation({
              location: locationString,
              latitude: response.data.latitude ?? undefined,
              longitude: response.data.longitude ?? undefined,
            })
          );
        }
      } catch (err) {
        console.error('Failed to detect location:', err);
        // Keep default location if detection fails
      } finally {
        setDetectingLocation(false);
      }
    };

    detectLocation();
  }, [dispatch]);

  // ══ API CALLS - Fetch all environmental data ══
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        // Fetch all data in parallel
        const [airQualityRes, heatRiskRes, noiseRes, greenSpaceRes, scoreRes, insightRes] =
          await Promise.all([
            EnvironmentApi.AirQuality(),
            EnvironmentApi.HeatRisk(),
            EnvironmentApi.Noise(),
            EnvironmentApi.GreenSpace(),
            ScoringApi.Score(),
            InsightApi.Daily(),
          ]);

        // Transform and set metrics
        const transformedMetrics: EnvironmentalMetric[] = [
          {
            label: 'Air Quality',
            value: (airQualityRes.data?.airQuality as any)?.aqi ?? 58,
            unit: 'AQI',
            level: (airQualityRes.data?.airQuality as any)?.level ?? 'moderate',
            icon: 'wind',
          },
          {
            label: 'Heat Risk',
            value: heatRiskRes.data?.feelsLike ?? 34,
            unit: '°C',
            level: heatRiskRes.data?.level ?? 'poor',
            icon: 'flame',
          },
          {
            label: 'Flood Risk',
            value: (noiseRes.data as any)?.floodRisk ?? 12,
            unit: '%',
            level: (noiseRes.data as any)?.floodLevel ?? 'good',
            icon: 'droplets',
          },
          {
            label: 'Noise',
            value: noiseRes.data?.estimatedNoiseLevel ?? 62,
            unit: 'dB',
            level: (noiseRes.data?.noiseScore ?? 62 > 70) ? 'poor' : 'moderate',
            icon: 'volume',
          },
        ];

        // Transform green spaces
        const greenSpacesData =
          greenSpaceRes.data?.greenAreas ?? greenSpaceRes.data?.greenSpace?.parkData ?? [];
        const transformedGreenSpaces: GreenSpace[] = greenSpacesData.map((space: any) => ({
          id: space.id,
          name: space.name,
          distance: space.distance ?? 0.8,
          status: space.status ?? 'Open now',
          tags: space.tags ?? [],
          latitude: space.latitude,
          longitude: space.longitude,
        }));

        // Transform alerts from insights
        const transformedAlerts: Alert[] = insightRes.data
          ? [
              {
                id: insightRes.data.snapshotId ?? '1',
                type: insightRes.data.severity === 'high' ? 'warning' : 'info',
                title: insightRes.data.title,
                description: insightRes.data.message,
                icon: insightRes.data.severity === 'high' ? 'alert' : 'trending-up',
              },
            ]
          : [];

        // Set score history
        const currentScore = scoreRes.data?.environmentalScore ?? 72;
        const transformedScoreHistory: ScoreHistory[] = [
          { date: 'Today, 10:00 AM', score: currentScore, change: 5 },
          { date: 'Yesterday', score: currentScore - 5, change: -10 },
          { date: '2 days ago', score: currentScore - 5, change: -3 },
          { date: '3 days ago', score: currentScore + 2, change: 8 },
        ];

        // Dispatch all data to Redux
        dispatch(
          setMapData({
            location: mapState.location,
            latitude: mapState.latitude,
            longitude: mapState.longitude,
            environmentalScore: currentScore,
            metrics: transformedMetrics,
            alerts: transformedAlerts,
            greenSpaces: transformedGreenSpaces,
            scoreHistory: transformedScoreHistory,
            searchQuery: '',
          })
        );
      } catch (err) {
        console.error('Failed to fetch map data:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to load map data';
        dispatch(setError(errorMsg));

        // Set fallback data
        dispatch(
          setMapData({
            location: mapState.location,
            latitude: mapState.latitude,
            longitude: mapState.longitude,
            environmentalScore: 72,
            metrics: [
              {
                label: 'Air Quality',
                value: 58,
                unit: 'AQI',
                level: 'moderate',
                icon: 'wind',
              },
              {
                label: 'Heat Risk',
                value: 34,
                unit: '°C',
                level: 'poor',
                icon: 'flame',
              },
              {
                label: 'Flood Risk',
                value: 12,
                unit: '%',
                level: 'good',
                icon: 'droplets',
              },
              {
                label: 'Noise',
                value: 62,
                unit: 'dB',
                level: 'moderate',
                icon: 'volume',
              },
            ],
            alerts: [
              {
                id: '1',
                type: 'warning',
                title: 'High Heat Index',
                description: 'Heat index expected until 5 PM. Feels like 38°C.',
                icon: 'alert',
              },
              {
                id: '2',
                type: 'info',
                title: 'Air Quality Improved',
                description: 'Air quality improved by 12% compared to yesterday.',
                icon: 'trending-up',
              },
            ],
            greenSpaces: [
              {
                id: '1',
                name: 'Taman Sari Park',
                distance: 0.8,
                status: 'Open now',
                tags: ['Low noise'],
              },
              {
                id: '2',
                name: 'Blang Padang Field',
                distance: 1.4,
                status: 'Open now',
                tags: ['Good air'],
              },
              {
                id: '3',
                name: 'Ulee Lheue Beach',
                distance: 3.2,
                status: 'Open',
                tags: ['Breezy'],
              },
            ],
            scoreHistory: [
              { date: 'Today, 10:00 AM', score: 72, change: 5 },
              { date: 'Yesterday', score: 67, change: -10 },
              { date: '2 days ago', score: 67, change: -3 },
              { date: '3 days ago', score: 70, change: 8 },
            ],
            searchQuery: '',
          })
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAllData();
  }, [dispatch, mapState.location, mapState.latitude, mapState.longitude]);

  // ══ EVENT HANDLERS ══
  const handleLocationSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return;

    console.log('Location search query:', query);
    // TODO: Implement location search when backend provides search endpoint
    // For now, LocationApi.Resolve() requires lat/lng/city/country, not text query
    // This feature will be implemented when backend adds location search endpoint
  }, []);

  const handleGreenSpaceClick = useCallback((spaceId: string) => {
    console.log('Green space clicked:', spaceId);
    // TODO: Navigate to green space detail or show modal
  }, []);

  // ══ UTILITY FUNCTION - Map icon names to Lucide components ══
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'wind':
        return <Wind size={20} />;
      case 'flame':
        return <Flame size={20} />;
      case 'droplets':
        return <Droplets size={20} />;
      case 'volume':
        return <Volume2 size={20} />;
      case 'alert':
        return <AlertCircle size={20} />;
      case 'trending-up':
        return <TrendingUp size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  // ══ TRANSFORM REDUX DATA TO COMPONENT PROPS ══
  const transformedMetrics = metrics.map((metric) => ({
    ...metric,
    icon: getIconComponent(metric.icon),
  }));

  const transformedAlerts = alerts.map((alert) => ({
    ...alert,
    icon: getIconComponent(alert.icon),
  }));

  // ══ RENDER ══
  return (
    <MapScreenSection
      state={{
        location,
        latitude,
        longitude,
        environmentalScore,
        metrics: transformedMetrics,
        alerts: transformedAlerts,
        greenSpaces,
        scoreHistory,
        searchQuery,
        loading,
        error,
      }}
      service={{
        onLocationSearch: handleLocationSearch,
        onAlertClick: (alertId: string) => console.log('Alert clicked:', alertId),
        onGreenSpaceClick: handleGreenSpaceClick,
      }}
    />
  );
}
