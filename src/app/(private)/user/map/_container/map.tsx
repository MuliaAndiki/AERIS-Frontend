'use client';

import { AlertCircle, CheckCircle, Droplets, Flame, TrendingUp, Volume2, Wind } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGeolocation } from 'react-use';

import MapScreenSection from '@/components/section/(private)/user/map/map-screen-section';
import { SidebarLayout } from '@/core/layouts/sidebar.layout';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';
import EnvironmentApi from '@/services/env/env.service';
import InsightApi from '@/services/insight/insight.service';
import LocationApi from '@/services/location/location.service';
import RecommendationApi from '@/services/recommendation/recommendation.service';
import ScoringApi from '@/services/scoring/scoring.service';
import SnapshotApi from '@/services/snapshot/snapshot.service';
import {
  type Alert,
  clearError,
  type EnvironmentalMetric,
  type GreenSpace,
  type Recommendation,
  type ScoreHistory,
  setError,
  setLoading,
  setLocation,
  setMapData,
} from '@/stores/mapSlice/mapSlice';

import { AppDispatch, RootState } from '@/stores/store';
import { SearchLocation } from '@/types/res/location.res';

const LOGIN_GEO_STORAGE_KEY = 'aeris:login-geolocation';

type StoredLoginGeolocation = {
  latitude: number;
  longitude: number;
  capturedAt: string;
};

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function getFulfilledValue<T>(result: PromiseSettledResult<T>) {
  return result.status === 'fulfilled' ? result.value : null;
}

function readStoredLoginGeolocation(): StoredLoginGeolocation | null {
  if (typeof window === 'undefined') return null;

  const raw = window.sessionStorage.getItem(LOGIN_GEO_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredLoginGeolocation>;
    if (!isNumber(parsed.latitude) || !isNumber(parsed.longitude)) {
      return null;
    }

    return {
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      capturedAt: typeof parsed.capturedAt === 'string' ? parsed.capturedAt : '',
    };
  } catch {
    return null;
  }
}



function formatSnapshotLabel(snapshotTime: string) {
  const parsed = new Date(snapshotTime);
  if (Number.isNaN(parsed.getTime())) return snapshotTime;
  return parsed.toLocaleString();
}

export default function MapContainer() {
  // ══ REDUX STATE ══
  const dispatch = useDispatch<AppDispatch>();
  const authToken = useSelector((state: RootState) => state.auth.currentUser?.user?.token);
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
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<{
    lat: number;
    lon: number;
    city: string;
  } | null>(null);
  const [isCurrentLocationDetected, setIsCurrentLocationDetected] = useState(true);

  const hasResolvedCoordinates = isNumber(latitude) && isNumber(longitude);
  const canPollScore = Boolean(authToken && hasResolvedCoordinates && !detectingLocation);

  const handleScoreUpdate = useCallback((score: any) => {
    console.log('Score updated via WebSocket:', score);
  }, []);

  // ══ WEBSOCKET - Real-time score updates ══
  useMapWebSocket({
    enabled: canPollScore,
    pollInterval: 60000,
    onScoreUpdate: handleScoreUpdate,
  });

  // ══ GEOLOCATION HOOK ══
  const browserGeo = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000,
  });

  // ══ REVERSE GEOCODING ══
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await LocationApi.Reverse(lat, lon);
      if (res.data) {
        return {
          city: res.data.city,
          country: res.data.country,
          state: res.data.state,
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  // ══ DETECT USER LOCATION ON MOUNT ══
  useEffect(() => {
    const detectLocation = async () => {
      // Only proceed if geolocation has resolved or failed
      if (browserGeo.loading) return;

      try {
        setDetectingLocation(true);

        const storedBrowserGeo = readStoredLoginGeolocation();
        
        // Use coordinates from browser or stored geo
        let detectedLatitude = browserGeo.latitude ?? storedBrowserGeo?.latitude;
        let detectedLongitude = browserGeo.longitude ?? storedBrowserGeo?.longitude;
        
        // Fallback to IP-based detection if browser geo fails
        let detectedCity = 'Detected Location';
        let detectedCountry = 'Unknown';
        let detectedState = '';

        if (!isNumber(detectedLatitude) || !isNumber(detectedLongitude)) {
          const ipResponse = await LocationApi.Detect();
          detectedLatitude = ipResponse.data?.latitude ?? detectedLatitude;
          detectedLongitude = ipResponse.data?.longitude ?? detectedLongitude;
          detectedCity = ipResponse.data?.city?.trim() || 'City via IP';
          detectedCountry = ipResponse.data?.country?.trim() || 'Unknown';
        } else {
          // If we have precise browser coords, try to get precise city name
          const geoInfo = await reverseGeocode(detectedLatitude, detectedLongitude);
          if (geoInfo) {
            detectedCity = geoInfo.city;
            detectedCountry = geoInfo.country;
            detectedState = geoInfo.state;
          } else {
            detectedCity = 'Current Location';
          }
        }

        if (!isNumber(detectedLatitude) || !isNumber(detectedLongitude)) {
          setIsCurrentLocationDetected(false);
          dispatch(
            setError('Lokasi tidak terdeteksi. Izinkan akses lokasi atau cari lokasi manual.')
          );
          return;
        }

        try {
          await LocationApi.Resolve({
            latitude: detectedLatitude,
            longitude: detectedLongitude,
            city: detectedCity,
            state: detectedState || detectedCity,
            country: detectedCountry,
            radius: 10,
          });
        } catch (error) {
          console.warn('[Map] Failed to resolve location to backend:', error);
          // Don't stop here, we still have coordinates for the map
        }

        setDetectedLocation({
          lat: detectedLatitude,
          lon: detectedLongitude,
          city: detectedCity,
        });

        dispatch(
          setLocation({
            location: `${detectedCity}, ${detectedCountry}`,
            latitude: detectedLatitude,
            longitude: detectedLongitude,
          })
        );

        setIsCurrentLocationDetected(true);
        dispatch(clearError());
      } catch (err) {
        setIsCurrentLocationDetected(false);
        const errorMsg = err instanceof Error ? err.message : 'Failed to detect location';
        dispatch(setError(errorMsg));
      } finally {
        setDetectingLocation(false);
        dispatch(setLoading(false));
      }
    };

    void detectLocation();
  }, [dispatch, browserGeo.loading, browserGeo.latitude, browserGeo.longitude]);

  // ══ API CALLS - Fetch all environmental data ══
  // Use a ref for location to avoid circular dependency:
  // setMapData dispatches `location` back → location changes → effect re-fires → ∞
  const locationRef = useRef(location);
  locationRef.current = location;

  useEffect(() => {
    if (!isNumber(latitude) || !isNumber(longitude)) {
      if (!detectingLocation) {
        dispatch(setLoading(false));
      }
      return;
    }

    // Skip fetch while still detecting location
    if (detectingLocation) return;

    const fetchAllData = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const results = await Promise.allSettled([
          EnvironmentApi.AirQuality(),
          EnvironmentApi.HeatRisk(),
          EnvironmentApi.Noise(),
          EnvironmentApi.DisasterRisk(),
          EnvironmentApi.GreenSpace(),
          ScoringApi.Score(),
          InsightApi.Daily(),
          RecommendationApi.Daily(),
          SnapshotApi.History({ limit: '7' }),
        ]);

        const airQualityRes = getFulfilledValue(results[0]);
        const heatRiskRes = getFulfilledValue(results[1]);
        const noiseRes = getFulfilledValue(results[2]);
        const disasterRiskRes = getFulfilledValue(results[3]);
        const greenSpaceRes = getFulfilledValue(results[4]);
        const scoreRes = getFulfilledValue(results[5]);
        const insightRes = getFulfilledValue(results[6]);
        const recommendationRes = getFulfilledValue(results[7]);
        const snapshotHistoryRes = getFulfilledValue(results[8]);

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
              'SnapshotHistory',
            ];
            console.warn(`[Map] ${apiNames[index]} API failed:`, result.reason);
          }
        });

        const transformedMetrics: EnvironmentalMetric[] = [];

        const airQualityPayload =
          (airQualityRes?.data?.airQuality as Record<string, unknown> | undefined) ??
          ((airQualityRes as any)?.airQuality as Record<string, unknown> | undefined);
        const airQualityAqi = Number(airQualityPayload?.overall_aqi ?? airQualityPayload?.aqi);
        if (isNumber(airQualityAqi)) {
          transformedMetrics.push({
            label: 'Air Quality',
            value: airQualityAqi,
            unit: 'AQI',
            level: airQualityAqi <= 50 ? 'good' : airQualityAqi <= 100 ? 'moderate' : 'poor',
            icon: 'wind',
          });
        }

        const heatFeelsLike = Number(heatRiskRes?.data?.feelsLike);
        const heatScore = Number(heatRiskRes?.data?.heatScore);
        if (isNumber(heatFeelsLike)) {
          transformedMetrics.push({
            label: 'Heat Risk',
            value: heatFeelsLike,
            unit: '°C',
            level: isNumber(heatScore)
              ? heatScore > 70
                ? 'poor'
                : heatScore > 50
                  ? 'moderate'
                  : 'good'
              : heatFeelsLike > 35
                ? 'poor'
                : heatFeelsLike > 31
                  ? 'moderate'
                  : 'good',
            icon: 'flame',
          });
        }

        const floodScore = Number(disasterRiskRes?.data?.floodScore);
        if (isNumber(floodScore)) {
          transformedMetrics.push({
            label: 'Flood Risk',
            value: floodScore,
            unit: '%',
            level: floodScore > 70 ? 'poor' : floodScore > 50 ? 'moderate' : 'good',
            icon: 'droplets',
          });
        }

        const noiseLevel = Number(noiseRes?.data?.estimatedNoiseLevel);
        if (isNumber(noiseLevel)) {
          transformedMetrics.push({
            label: 'Noise',
            value: noiseLevel,
            unit: 'dB',
            level: noiseLevel > 70 ? 'poor' : noiseLevel > 60 ? 'moderate' : 'good',
            icon: 'volume',
          });
        }

        const greenSpacesRaw =
          greenSpaceRes?.data?.greenAreas ?? greenSpaceRes?.data?.greenSpace?.parkData ?? [];
        const transformedGreenSpaces: GreenSpace[] = Array.isArray(greenSpacesRaw)
          ? greenSpacesRaw.map((space: any, index: number) => {
              const parsedLatitude = Number(space?.latitude);
              const parsedLongitude = Number(space?.longitude);
              const parsedDistance = Number(space?.distanceKm ?? space?.distance);

              return {
                id: String(space?.id ?? `${space?.name ?? 'green-space'}-${index}`),
                name: String(space?.name ?? 'Unknown Green Space'),
                distance: isNumber(parsedDistance) ? parsedDistance : 0,
                status: typeof space?.status === 'string' ? space.status : 'Unknown',
                tags: Array.isArray(space?.tags)
                  ? space.tags.filter((tag: unknown) => typeof tag === 'string')
                  : [],
                latitude: isNumber(parsedLatitude) ? parsedLatitude : undefined,
                longitude: isNumber(parsedLongitude) ? parsedLongitude : undefined,
              };
            })
          : [];

        const transformedAlerts: Alert[] = insightRes?.data
          ? [
              {
                id: insightRes.data.snapshotId ?? insightRes.data.title,
                type: insightRes.data.severity === 'high' ? 'warning' : 'info',
                title: insightRes.data.title,
                description: insightRes.data.message,
                icon: insightRes.data.severity === 'high' ? 'alert' : 'trending-up',
              },
            ]
          : [];

        const recommendationItems = recommendationRes?.data?.items ?? [];
        const transformedRecommendations: Recommendation[] = Array.isArray(recommendationItems)
          ? recommendationItems.map((rec: any, index: number) => {
              const severity = Number(rec?.severity);
              const safeSeverity = isNumber(severity) ? severity : 0;
              return {
                id: String(rec?.id ?? `recommendation-${index}`),
                message: String(rec?.message ?? ''),
                severity: safeSeverity,
                recommendationType:
                  typeof rec?.recommendationType === 'string' ? rec.recommendationType : undefined,
                icon: safeSeverity >= 2 ? 'alert' : safeSeverity === 1 ? 'info' : 'check',
              };
            })
          : [];

        const historyItems = Array.isArray(snapshotHistoryRes?.data)
          ? [...snapshotHistoryRes.data]
          : [];

        historyItems.sort(
          (a, b) => new Date(a.snapshotTime).getTime() - new Date(b.snapshotTime).getTime()
        );

        const transformedScoreHistory: ScoreHistory[] = historyItems.map((item, index) => {
          const score = Number(item.environmentalScore);
          const safeScore = isNumber(score) ? score : 0;

          if (index === 0) {
            return {
              date: formatSnapshotLabel(item.snapshotTime),
              score: safeScore,
              change: 0,
            };
          }

          const prevScoreValue = Number(historyItems[index - 1]?.environmentalScore);
          const prevScore = isNumber(prevScoreValue) ? prevScoreValue : safeScore;

          return {
            date: formatSnapshotLabel(item.snapshotTime),
            score: safeScore,
            change: safeScore - prevScore,
          };
        });

        const scoreFromSummary = Number(scoreRes?.data?.environmentalScore);
        const currentScore = isNumber(scoreFromSummary)
          ? scoreFromSummary
          : transformedScoreHistory.length > 0
            ? transformedScoreHistory[transformedScoreHistory.length - 1].score
            : 0;

        dispatch(
          setMapData({
            location: locationRef.current,
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
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load map data';
        dispatch(setError(errorMsg));
      } finally {
        dispatch(setLoading(false));
      }
    };

    void fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, latitude, longitude]);

  // ══ EVENT HANDLERS ══
  const handleLocationSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      try {
        dispatch(setLoading(true));

        // Search locations from API
        const searchRes = await LocationApi.Search(query);

        if (searchRes.data && searchRes.data.length > 0) {
          const foundLocation = searchRes.data[0] as SearchLocation;

          const resolveRes = await LocationApi.Resolve({
            latitude: foundLocation.latitude,
            longitude: foundLocation.longitude,
            city: foundLocation.city,
            state: foundLocation.state,
            country: foundLocation.country,
            radius: 10,
          });

          if (resolveRes.data) {
            dispatch(
              setLocation({
                location: `${foundLocation.city}, ${foundLocation.state}`,
                latitude: foundLocation.latitude,
                longitude: foundLocation.longitude,
              })
            );

            dispatch(clearError());
            setIsCurrentLocationDetected(false);
          }
        } else {
          dispatch(setError(`Location "${query}" not found. Please try another search.`));
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update location';
        dispatch(setError(errorMsg));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const handleGreenSpaceClick = useCallback((spaceId: string) => {
    console.log('Green space clicked:', spaceId);
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
    <SidebarLayout onSearch={handleLocationSearch}>
      <main className="w-full min-h-screen overflow-hidden">
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
            loading: loading || detectingLocation,
            error,
            isCurrentLocationDetected,
            detectedLocation,
          }}
          service={{
            onAlertClick: (alertId: string) => console.log('Alert clicked:', alertId),
            onGreenSpaceClick: handleGreenSpaceClick,
          }}
        />
      </main>
    </SidebarLayout>
  );
}
