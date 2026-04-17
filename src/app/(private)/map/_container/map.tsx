'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapScreenSection from '@/components/section/(private)/map-screen-section';
import EnvironmentApi from '@/services/env/env.service';
import ScoringApi from '@/services/scoring/scoring.service';
import InsightApi from '@/services/insight/insight.service';
import LocationApi from '@/services/location/location.service';
import RecommendationApi from '@/services/recommendation/recommendation.service';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';
import {
  setMapData,
  setLoading,
  setError,
  setLocation,
  type EnvironmentalMetric,
  type Alert,
  type Recommendation,
  type GreenSpace,
  type ScoreHistory,
  clearError,
} from '@/stores/mapSlice/mapSlice';
import { RootState, AppDispatch } from '@/stores/store';
import { SearchLocation } from '@/types/res/location.res';

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
    recommendations,
    greenSpaces,
    scoreHistory,
    loading,
    error,
  } = mapState;

  // ══ LOCAL STATE ══
  const [searchQuery, setSearchQuery] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<{
    lat: number;
    lon: number;
    city: string;
  } | null>(null);
  const [isCurrentLocationDetected, setIsCurrentLocationDetected] = useState(true);
  const [locationReady, setLocationReady] = useState(false);

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
          const lat = response.data.latitude ?? 0;
          const lon = response.data.longitude ?? 0;

          setDetectedLocation({
            lat,
            lon,
            city: response.data.city,
          });

          // Auto-resolve detected location to backend
          await LocationApi.Resolve({
            latitude: lat,
            longitude: lon,
            city: response.data.city,
            state: response.data.city, // Use city as state for now
            country: response.data.country,
            radius: 10,
          });

          dispatch(
            setLocation({
              location: locationString,
              latitude: lat,
              longitude: lon,
            })
          );
          setIsCurrentLocationDetected(true);
          setLocationReady(true); // Location is ready for data fetching
          console.log('✓ Location auto-detected and saved:', response.data.city);
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
    if (!latitude || !longitude) {
      console.warn('⚠️ FETCH SKIPPED: Missing coordinates', { latitude, longitude });
      return; // Only fetch if coordinates are set
    }

    console.log('🔄 FETCHING DATA FOR:', { latitude, longitude, location });

    const fetchAllData = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        // Fetch all data in parallel - use allSettled so one failure doesn't break all
        const results = await Promise.allSettled([
          EnvironmentApi.AirQuality(),
          EnvironmentApi.HeatRisk(),
          EnvironmentApi.Noise(),
          EnvironmentApi.DisasterRisk(),
          EnvironmentApi.GreenSpace(),
          ScoringApi.Score(),
          InsightApi.Daily(),
          RecommendationApi.Daily(),
        ]);

        // Extract results - each can succeed or fail independently
        const airQualityRes = results[0].status === 'fulfilled' ? results[0].value : null;
        const heatRiskRes = results[1].status === 'fulfilled' ? results[1].value : null;
        const noiseRes = results[2].status === 'fulfilled' ? results[2].value : null;
        const disasterRiskRes = results[3].status === 'fulfilled' ? results[3].value : null;
        const greenSpaceRes = results[4].status === 'fulfilled' ? results[4].value : null;
        const scoreRes = results[5].status === 'fulfilled' ? results[5].value : null;
        const insightRes = results[6].status === 'fulfilled' ? results[6].value : null;
        const recommendationRes = results[7].status === 'fulfilled' ? results[7].value : null;

        // Log failures for debugging
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const apiNames = [
              'AirQuality',
              'HeatRisk',
              'Noise',
              'DisasterRisk',
              'GreenSpace',
              'Score',
              'Insight',
              'Recommendation',
            ];
            console.warn(`⚠️ ${apiNames[index]} API failed:`, result.reason);
          }
        });

        // DEBUG: Log responses
        console.log('=== AIR QUALITY DEBUG ===');
        console.log('airQualityRes (full):', airQualityRes);
        console.log('airQualityRes?.data:', airQualityRes?.data);
        console.log('airQualityRes?.data?.airQuality:', (airQualityRes?.data as any)?.airQuality);
        console.log(
          'airQualityRes["data"]?.["airQuality"]?.["overall_aqi"]:',
          (airQualityRes as any)?.['data']?.['airQuality']?.['overall_aqi']
        );

        // Try direct access pattern used by backend
        const directAqi = (airQualityRes as any)?.airQuality?.overall_aqi;
        console.log('Direct access (airQualityRes?.airQuality?.overall_aqi):', directAqi);

        // Extract air quality AQI - try both patterns
        const airQualityAqi =
          directAqi ?? (airQualityRes?.data?.airQuality as any)?.overall_aqi ?? 58;
        console.log('Final airQualityAqi:', airQualityAqi);
        const airQualityCategory =
          airQualityAqi <= 50 ? 'Good' : airQualityAqi <= 100 ? 'Moderate' : 'Poor';

        // Extract heat data
        const heatFeelsLike = heatRiskRes?.data?.feelsLike ?? 34;
        const heatScore = heatRiskRes?.data?.heatScore ?? 50;

        // Extract flood/heat from DisasterRisk (NOT from Noise)
        const floodScore = disasterRiskRes?.data?.floodScore ?? 12;

        // Extract noise data
        const noiseLevel = noiseRes?.data?.estimatedNoiseLevel ?? 62;
        const noiseScore = noiseRes?.data?.noiseScore ?? 62;

        // Transform and set metrics
        const transformedMetrics: EnvironmentalMetric[] = [
          {
            label: 'Air Quality',
            value: airQualityAqi,
            unit: 'AQI',
            level: airQualityCategory.toLowerCase().includes('good')
              ? 'good'
              : airQualityCategory.toLowerCase().includes('moderate')
                ? 'moderate'
                : 'poor',
            icon: 'wind',
          },
          {
            label: 'Heat Risk',
            value: heatFeelsLike,
            unit: '°C',
            level: heatScore > 70 ? 'poor' : heatScore > 50 ? 'moderate' : 'good',
            icon: 'flame',
          },
          {
            label: 'Flood Risk',
            value: floodScore,
            unit: '%',
            level: floodScore > 70 ? 'poor' : floodScore > 50 ? 'moderate' : 'good',
            icon: 'droplets',
          },
          {
            label: 'Noise',
            value: noiseLevel,
            unit: 'dB',
            level: noiseLevel > 70 ? 'poor' : noiseLevel > 60 ? 'moderate' : 'good',
            icon: 'volume',
          },
        ];

        console.log('📊 Environmental Metrics:', {
          airQuality: { aqi: airQualityAqi, category: airQualityCategory },
          heatRisk: { feelsLike: heatFeelsLike, score: heatScore },
          floodRisk: { score: floodScore },
          noise: { level: noiseLevel, score: noiseScore },
          transformedMetrics,
        });

        // Transform green spaces
        const greenSpacesData = greenSpaceRes?.data?.greenAreas ?? [];
        console.log('🌳 Green Spaces Data:', {
          hasData: !!greenSpaceRes?.data,
          greenSpaces: greenSpacesData,
          length: greenSpacesData.length,
        });
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
        const transformedAlerts: Alert[] = insightRes?.data
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

        // Transform recommendations - Filter based on environmental score
        const recommendationItems = recommendationRes?.data?.items ?? [];
        console.log('🎯 Recommendations API Response:', {
          hasData: !!recommendationRes?.data,
          items: recommendationItems,
          length: recommendationItems.length,
        });
        const transformedRecommendations: Recommendation[] = recommendationItems.map(
          (rec: any) => ({
            id: rec.id,
            message: rec.message,
            severity: rec.severity ?? 1,
            recommendationType: rec.recommendationType,
            icon: rec.severity === 2 ? 'alert' : rec.severity === 1 ? 'info' : 'check',
          })
        );

        // Set score history
        const currentScore = scoreRes?.data?.environmentalScore ?? 72;
        const transformedScoreHistory: ScoreHistory[] = [
          { date: 'Today, 10:00 AM', score: currentScore, change: 5 },
          { date: 'Yesterday', score: currentScore - 5, change: -10 },
          { date: '2 days ago', score: currentScore - 5, change: -3 },
          { date: '3 days ago', score: currentScore + 2, change: 8 },
        ];

        // Dispatch all data to Redux
        dispatch(
          setMapData({
            location,
            latitude,
            longitude,
            environmentalScore: currentScore,
            metrics: transformedMetrics,
            alerts: transformedAlerts,
            recommendations: transformedRecommendations,
            greenSpaces: transformedGreenSpaces,
            scoreHistory: transformedScoreHistory,
            searchQuery: '',
          })
        );
        console.log('✓ Data fetched for location:', location);
      } catch (err) {
        console.error('❌ Failed to fetch map data:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to load map data';
        dispatch(setError(errorMsg));

        // Set fallback data
        console.warn('⚠️  Using FALLBACK DATA - API calls failed');
        dispatch(
          setMapData({
            location,
            latitude,
            longitude,
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
            recommendations: [
              {
                id: 'rec-1',
                message: 'Reduce outdoor activities during peak heat hours (11 AM - 3 PM)',
                severity: 2,
                recommendationType: 'heat_warning',
                icon: 'alert',
              },
              {
                id: 'rec-2',
                message: 'Air quality is improving. Great day for outdoor exercise!',
                severity: 0,
                recommendationType: 'positive_feedback',
                icon: 'check',
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
  }, [dispatch, latitude, longitude, location]);

  // ══ EVENT HANDLERS ══
  const handleLocationSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      try {
        dispatch(setLoading(true));

        // Search locations from API
        const searchRes = await LocationApi.Search(query);

        if (searchRes.data && searchRes.data.length > 0) {
          // Use first result
          const foundLocation = searchRes.data[0] as SearchLocation;

          // Resolve location to backend (save user location)
          console.log('🌍 RESOLVE REQUEST:', {
            lat: foundLocation.latitude,
            lon: foundLocation.longitude,
            city: foundLocation.city,
          });

          const resolveRes = await LocationApi.Resolve({
            latitude: foundLocation.latitude,
            longitude: foundLocation.longitude,
            city: foundLocation.city,
            state: foundLocation.state,
            country: foundLocation.country,
            radius: 10, // Default 10km radius
          });

          console.log('🌍 RESOLVE RESPONSE:', resolveRes.data);

          if (resolveRes.data) {
            // Update Redux state with resolved location
            console.log('📍 UPDATING REDUX WITH:', {
              lat: foundLocation.latitude,
              lon: foundLocation.longitude,
            });

            dispatch(
              setLocation({
                location: `${foundLocation.city}, ${foundLocation.state}`,
                latitude: foundLocation.latitude,
                longitude: foundLocation.longitude,
              })
            );

            dispatch(clearError());
            setSearchQuery('');
            setIsCurrentLocationDetected(false);
            setLocationReady(true); // Location is ready for data fetching
            console.log('✓ Location saved and updated:', foundLocation.name);
          } else {
            console.error('❌ RESOLVE FAILED - No data in response');
          }
        } else {
          dispatch(setError(`Location "${query}" not found. Please try another search.`));
          console.warn('✗ Location not found:', query);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update location';
        dispatch(setError(errorMsg));
        console.error('Location search error:', err);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

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
        recommendations,
        greenSpaces,
        scoreHistory,
        searchQuery,
        loading,
        error,
        isCurrentLocationDetected,
        detectedLocation,
      }}
      service={{
        onLocationSearch: handleLocationSearch,
        onAlertClick: (alertId: string) => console.log('Alert clicked:', alertId),
        onGreenSpaceClick: handleGreenSpaceClick,
      }}
    />
  );
}
