'use client';

import { AlertCircle, CheckCircle, Droplets, Flame, TrendingUp, Volume2, Wind } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';

import MapScreenSection from '@/components/section/(private)/user/map/map-screen-section';
import { SidebarLayout } from '@/core/layouts/sidebar.layout';
import EnvironmentApi from '@/services/env/env.service';
import InsightApi from '@/services/insight/insight.service';
import LocationApi from '@/services/location/location.service';
import RecommendationApi from '@/services/recommendation/recommendation.service';
import ScoringApi from '@/services/scoring/scoring.service';
import SnapshotApi from '@/services/snapshot/snapshot.service';
import { useAuthStore } from '@/stores/auth.store';

import { SearchLocation } from '@/types/res/location.res';

/* ─── Types ─── */
interface EnvironmentalMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  level: 'good' | 'moderate' | 'poor' | 'unhealthy';
  icon?: string;
  color?: string;
  radiusKm?: number;
  description?: string;
  shape?: 'dot' | 'ring';
  latitude?: number;
  longitude?: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'info';
  title: string;
  description: string;
  icon?: string;
}

interface GreenSpace {
  id: string;
  name: string;
  distance: number;
  status: string;
  tags: string[];
  latitude?: number;
  longitude?: number;
}

interface ScoreHistory {
  date: string;
  score: number;
  change: number;
}

interface Recommendation {
  id: string;
  message: string;
  severity: number;
  recommendationType?: string;
  icon?: string;
}

interface MapData {
  location: string;
  latitude?: number;
  longitude?: number;
  environmentalScore: number;
  metrics: EnvironmentalMetric[];
  alerts: Alert[];
  recommendations: Recommendation[];
  greenSpaces: GreenSpace[];
  scoreHistory: ScoreHistory[];
}

/* ─── Constants ─── */
const LOGIN_GEO_STORAGE_KEY = 'aeris:login-geolocation';
const GEO_TIMEOUT_MS = 8000; // Max wait for browser geolocation

type StoredLoginGeolocation = {
  latitude: number;
  longitude: number;
  capturedAt: string;
};

/* ─── Helpers ─── */
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
    if (!isNumber(parsed.latitude) || !isNumber(parsed.longitude)) return null;
    return {
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      capturedAt: typeof parsed.capturedAt === 'string' ? parsed.capturedAt : '',
    };
  } catch {
    return null;
  }
}

/**
 * Request browser geolocation with a timeout.
 * Returns coords or null — never hangs.
 */
function requestBrowserGeolocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      resolve(null);
      return;
    }

    const timeout = setTimeout(() => {
      console.warn('[Map] Browser geolocation timed out');
      resolve(null);
    }, GEO_TIMEOUT_MS);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeout);
        // Also store for future use
        try {
          window.sessionStorage.setItem(
            LOGIN_GEO_STORAGE_KEY,
            JSON.stringify({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              capturedAt: new Date().toISOString(),
            })
          );
        } catch {
          /* noop */
        }
        resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      (err) => {
        clearTimeout(timeout);
        console.warn('[Map] Browser geolocation denied/failed:', err.message);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: GEO_TIMEOUT_MS, maximumAge: 30000 }
    );
  });
}

function formatSnapshotLabel(snapshotTime: string) {
  const parsed = new Date(snapshotTime);
  if (Number.isNaN(parsed.getTime())) return snapshotTime;
  return parsed.toLocaleString();
}

export default function MapContainer() {
  const { currentUser } = useAuthStore();

  // ══ MAP STATE ══
  const [mapData, setMapData] = useState<MapData>({
    location: '',
    environmentalScore: 0,
    metrics: [],
    alerts: [],
    recommendations: [],
    greenSpaces: [],
    scoreHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ══ LOCATION STATE ══
  const [locationPhase, setLocationPhase] = useState<'detecting' | 'resolved' | 'failed'>(
    'detecting'
  );
  const [detectedLocation, setDetectedLocation] = useState<{
    lat: number;
    lon: number;
    city: string;
  } | null>(null);
  const [isCurrentLocationDetected, setIsCurrentLocationDetected] = useState(true);

  // ══ DATA FETCH TRACKING ══
  const hasFetchedData = useRef(false);
  const locationDetectionRan = useRef(false);

  // ══ STEP 1: DETECT LOCATION (runs once on mount) ══
  useEffect(() => {
    if (locationDetectionRan.current) return;
    locationDetectionRan.current = true;

    const detectLocation = async () => {
      try {
        setLocationPhase('detecting');
        setLoading(true);

        // 1) Check sessionStorage for coordinates stored during login
        const storedGeo = readStoredLoginGeolocation();

        // 2) Try browser geolocation (with timeout, won't hang)
        let coords = storedGeo
          ? { latitude: storedGeo.latitude, longitude: storedGeo.longitude }
          : null;

        if (!coords) {
          coords = await requestBrowserGeolocation();
        }

        // 3) Fallback: IP-based detection
        let detectedCity = '';
        let detectedCountry = '';
        let detectedState = '';

        if (!coords) {
          try {
            const ipResponse = await LocationApi.Detect();
            if (isNumber(ipResponse.data?.latitude) && isNumber(ipResponse.data?.longitude)) {
              coords = { latitude: ipResponse.data.latitude, longitude: ipResponse.data.longitude };
              detectedCity = ipResponse.data?.city?.trim() || '';
              detectedCountry = ipResponse.data?.country?.trim() || '';
            }
          } catch (e) {
            console.warn('[Map] IP detection failed:', e);
          }
        }

        // 4) No coordinates at all — show error
        if (!coords) {
          setLocationPhase('failed');
          setIsCurrentLocationDetected(false);
          setError('Lokasi tidak terdeteksi. Izinkan akses lokasi atau cari lokasi manual.');
          setLoading(false);
          return;
        }

        // 5) Reverse geocode if we don't have a city name
        if (!detectedCity) {
          try {
            const geoInfo = await LocationApi.Reverse(coords.latitude, coords.longitude);
            if (geoInfo?.data) {
              detectedCity = geoInfo.data.city || 'Current Location';
              detectedCountry = geoInfo.data.country || '';
              detectedState = geoInfo.data.state || '';
            } else {
              detectedCity = 'Current Location';
            }
          } catch {
            detectedCity = 'Current Location';
          }
        }

        // 6) Resolve location to backend (creates UserLocation for snapshot job)
        try {
          await LocationApi.Resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
            city: detectedCity,
            state: detectedState || detectedCity,
            country: detectedCountry || 'Unknown',
            radius: 10,
          });
        } catch (e) {
          console.warn('[Map] Location resolve failed (non-blocking):', e);
        }

        // 7) Update state
        setDetectedLocation({
          lat: coords.latitude,
          lon: coords.longitude,
          city: detectedCity,
        });

        setMapData((prev) => ({
          ...prev,
          location: `${detectedCity}${detectedCountry ? `, ${detectedCountry}` : ''}`,
          latitude: coords!.latitude,
          longitude: coords!.longitude,
        }));

        setIsCurrentLocationDetected(true);
        setLocationPhase('resolved');
        setError(null);
      } catch (err) {
        console.error('[Map] Location detection error:', err);
        setLocationPhase('failed');
        setIsCurrentLocationDetected(false);
        setError(err instanceof Error ? err.message : 'Failed to detect location');
        setLoading(false);
      }
    };

    void detectLocation();
  }, []);

  // ══ STEP 2: FETCH ENVIRONMENTAL DATA (only after location resolved) ══
  useEffect(() => {
    if (locationPhase !== 'resolved') return;
    if (!isNumber(mapData.latitude) || !isNumber(mapData.longitude)) return;
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[Map] Fetching environmental data for:', mapData.latitude, mapData.longitude);

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

        // ── Transform metrics ──
        const transformedMetrics: EnvironmentalMetric[] = [];

        const airQualityPayload =
          (airQualityRes?.data?.airQuality as Record<string, unknown> | undefined) ??
          ((airQualityRes as any)?.airQuality as Record<string, unknown> | undefined);
        const airQualityAqi = Number(airQualityPayload?.overall_aqi ?? airQualityPayload?.aqi);
        if (isNumber(airQualityAqi)) {
          transformedMetrics.push({
            id: 'air-quality',
            label: 'Air Quality',
            value: airQualityAqi,
            unit: 'AQI',
            level: airQualityAqi <= 50 ? 'good' : airQualityAqi <= 100 ? 'moderate' : 'poor',
            icon: 'wind',
            color: '#3b82f6',
            radiusKm: 5,
            description:
              'Monitoring radius for Air Quality Index (AQI). Measures PM2.5, PM10, O3, and other pollutants within this area.',
            shape: 'ring',
          });
        }

        const heatFeelsLike = Number(heatRiskRes?.data?.feelsLike);
        const heatScore = Number(heatRiskRes?.data?.heatScore);
        if (isNumber(heatFeelsLike)) {
          transformedMetrics.push({
            id: 'heat-risk',
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
            color: '#f97316',
            radiusKm: 3,
            description:
              'Heat risk zone based on apparent temperature (feels-like). Covers urban heat island effects within this radius.',
            shape: 'ring',
            latitude: mapData.latitude,
            longitude: mapData.longitude,
          });
        }

        const floodScore = Number(disasterRiskRes?.data?.floodScore);
        if (isNumber(floodScore)) {
          transformedMetrics.push({
            id: 'flood-risk',
            label: 'Flood Risk',
            value: floodScore,
            unit: '%',
            level: floodScore > 70 ? 'poor' : floodScore > 50 ? 'moderate' : 'good',
            icon: 'droplets',
            color: '#ef4444',
            radiusKm: 5,
            description:
              'Flood risk assessment from ThinkHazard database. Covers flood-prone areas around your location.',
            shape: 'ring',
            latitude: mapData.latitude,
            longitude: mapData.longitude,
          });
        }

        const noiseLevel = Number(noiseRes?.data?.estimatedNoiseLevel);
        if (isNumber(noiseLevel)) {
          transformedMetrics.push({
            id: 'noise',
            label: 'Noise Level',
            value: noiseLevel,
            unit: 'dB',
            level: noiseLevel > 70 ? 'poor' : noiseLevel > 60 ? 'moderate' : 'good',
            icon: 'volume',
            color: '#8b5cf6',
            radiusKm: 2,
            description:
              'Noise estimation zone based on major road density analysis. Shows predicted noise levels in dB.',
            shape: 'ring',
            latitude: mapData.latitude,
            longitude: mapData.longitude,
          });
        }

        // ── Green spaces ──
        const greenSpacesRaw =
          greenSpaceRes?.data?.greenAreas ?? greenSpaceRes?.data?.greenSpace?.parkData ?? [];
        const transformedGreenSpaces: GreenSpace[] = Array.isArray(greenSpacesRaw)
          ? greenSpacesRaw.map((space: any, index: number) => ({
              id: String(space?.id ?? `${space?.name ?? 'green-space'}-${index}`),
              name: String(space?.name ?? 'Unknown Green Space'),
              distance: isNumber(Number(space?.distanceKm ?? space?.distance))
                ? Number(space?.distanceKm ?? space?.distance)
                : 0,
              status: typeof space?.status === 'string' ? space.status : 'Unknown',
              tags: Array.isArray(space?.tags)
                ? space.tags.filter((tag: unknown) => typeof tag === 'string')
                : [],
              latitude: isNumber(Number(space?.latitude)) ? Number(space?.latitude) : undefined,
              longitude: isNumber(Number(space?.longitude)) ? Number(space?.longitude) : undefined,
            }))
          : [];

        // ── Alerts ──
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

        // ── Recommendations ──
        const recommendationItems = recommendationRes?.data?.items ?? [];
        const transformedRecommendations: Recommendation[] = Array.isArray(recommendationItems)
          ? recommendationItems.map((rec: any, index: number) => {
              const severity = isNumber(Number(rec?.severity)) ? Number(rec?.severity) : 0;
              return {
                id: String(rec?.id ?? `recommendation-${index}`),
                message: String(rec?.message ?? ''),
                severity,
                recommendationType:
                  typeof rec?.recommendationType === 'string' ? rec.recommendationType : undefined,
                icon: severity >= 2 ? 'alert' : severity === 1 ? 'info' : 'check',
              };
            })
          : [];

        // ── Score history ──
        const historyItems = Array.isArray(snapshotHistoryRes?.data)
          ? [...snapshotHistoryRes.data]
          : [];
        historyItems.sort(
          (a, b) => new Date(a.snapshotTime).getTime() - new Date(b.snapshotTime).getTime()
        );

        const transformedScoreHistory: ScoreHistory[] = historyItems.map((item, index) => {
          const score = isNumber(Number(item.environmentalScore))
            ? Number(item.environmentalScore)
            : 0;
          const prevScore =
            index > 0
              ? isNumber(Number(historyItems[index - 1]?.environmentalScore))
                ? Number(historyItems[index - 1]?.environmentalScore)
                : score
              : score;
          return {
            date: formatSnapshotLabel(item.snapshotTime),
            score,
            change: index === 0 ? 0 : score - prevScore,
          };
        });

        const scoreFromSummary = Number(scoreRes?.data?.environmentalScore);
        const currentScore = isNumber(scoreFromSummary)
          ? scoreFromSummary
          : transformedScoreHistory.length > 0
            ? transformedScoreHistory[transformedScoreHistory.length - 1].score
            : 0;

        setMapData((prev) => ({
          ...prev,
          environmentalScore: currentScore,
          metrics: transformedMetrics,
          alerts: transformedAlerts,
          recommendations: transformedRecommendations,
          greenSpaces: transformedGreenSpaces,
          scoreHistory: transformedScoreHistory,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    };

    void fetchAllData();
  }, [locationPhase, mapData.latitude, mapData.longitude]);

  // ══ LOCATION SEARCH ══
  const handleLocationSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const searchRes = await LocationApi.Search(query);
      if (searchRes.data && searchRes.data.length > 0) {
        const found = searchRes.data[0] as SearchLocation;
        await LocationApi.Resolve({
          latitude: found.latitude,
          longitude: found.longitude,
          city: found.city,
          state: found.state,
          country: found.country,
          radius: 10,
        });
        // Reset fetch flag so data re-fetches for new location
        hasFetchedData.current = false;
        setMapData((prev) => ({
          ...prev,
          location: `${found.city}, ${found.state}`,
          latitude: found.latitude,
          longitude: found.longitude,
        }));
        setLocationPhase('resolved');
        setIsCurrentLocationDetected(false);
        setError(null);
      } else {
        setError(`Location "${query}" not found. Please try another search.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGreenSpaceClick = useCallback((spaceId: string) => {
    console.log('Green space clicked:', spaceId);
  }, []);

  // ══ ICON MAPPER ══
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

  const transformedMetrics = mapData.metrics.map((m) => ({ ...m, icon: getIconComponent(m.icon) }));
  const transformedAlerts = mapData.alerts.map((a) => ({ ...a, icon: getIconComponent(a.icon) }));

  return (
    <SidebarLayout onSearch={handleLocationSearch}>
      <main className="w-full min-h-screen overflow-x-hidden">
        <MapScreenSection
          state={{
            location: mapData.location,
            latitude: mapData.latitude,
            longitude: mapData.longitude,
            environmentalScore: mapData.environmentalScore,
            metrics: transformedMetrics,
            alerts: transformedAlerts,
            recommendations: mapData.recommendations,
            greenSpaces: mapData.greenSpaces,
            scoreHistory: mapData.scoreHistory,
            loading,
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
