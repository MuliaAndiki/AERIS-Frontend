'use client';

import { useState, useEffect } from 'react';
import MapScreenSection from '@/components/section/(private)/map-screen-section';
import EnvironmentApi from '@/services/env/env.service';
import ScoringApi from '@/services/scoring/scoring.service';
import InsightApi from '@/services/insight/insight.service';

interface EnvironmentalMetric {
  label: string;
  value: number;
  unit: string;
  level: 'good' | 'moderate' | 'poor' | 'unhealthy';
  icon: React.ReactNode;
}

interface Alert {
  id: string;
  type: 'warning' | 'info';
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface GreenSpace {
  id: string;
  name: string;
  distance: number;
  status: string;
  tags: string[];
}

interface ScoreHistory {
  date: string;
  score: number;
  change: number;
}

import {
  Wind,
  Flame,
  Droplets,
  Volume2,
  AlertCircle,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

export default function MapContainer() {
  // ══ STATE ══
  const [location, setLocation] = useState('Banda Aceh, Aceh');
  const [environmentalScore, setEnvironmentalScore] = useState(72);
  const [metrics, setMetrics] = useState<EnvironmentalMetric[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [greenSpaces, setGreenSpaces] = useState<GreenSpace[]>([]);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ══ API CALLS ══
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

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
            icon: <Wind size={20} />,
          },
          {
            label: 'Heat Risk',
            value: heatRiskRes.data?.feelsLike ?? 34,
            unit: '°C',
            level: heatRiskRes.data?.level ?? 'poor',
            icon: <Flame size={20} />,
          },
          {
            label: 'Flood Risk',
            value: (noiseRes.data as any)?.floodRisk ?? 12,
            unit: '%',
            level: (noiseRes.data as any)?.floodLevel ?? 'good',
            icon: <Droplets size={20} />,
          },
          {
            label: 'Noise',
            value: noiseRes.data?.estimatedNoiseLevel ?? 62,
            unit: 'dB',
            level: noiseRes.data?.noiseScore ?? 62 > 70 ? 'poor' : 'moderate',
            icon: <Volume2 size={20} />,
          },
        ];
        setMetrics(transformedMetrics);

        // Set environmental score
        setEnvironmentalScore(scoreRes.data?.environmentalScore ?? 72);

        // Transform green spaces
        const greenSpacesData = greenSpaceRes.data?.greenAreas ?? greenSpaceRes.data?.greenSpace?.parkData ?? [];
        const transformedGreenSpaces: GreenSpace[] = greenSpacesData.map((space: any) => ({
          id: space.id,
          name: space.name,
          distance: space.distance ?? 0.8,
          status: space.status ?? 'Open now',
          tags: space.tags ?? [],
        }));
        setGreenSpaces(transformedGreenSpaces);

        // Transform alerts from insights
        const transformedAlerts: Alert[] = insightRes.data
          ? [
              {
                id: insightRes.data.snapshotId ?? '1',
                type: insightRes.data.severity === 'high' ? 'warning' : 'info',
                title: insightRes.data.title,
                description: insightRes.data.message,
                icon:
                  insightRes.data.severity === 'high' ? (
                    <AlertCircle size={20} />
                  ) : (
                    <TrendingUp size={20} />
                  ),
              },
            ]
          : [];
        setAlerts(transformedAlerts);

        // Set score history (default if not provided)
        setScoreHistory([
          { date: 'Today, 10:00 AM', score: scoreRes.data?.environmentalScore ?? 72, change: 5 },
          { date: 'Yesterday', score: (scoreRes.data?.environmentalScore ?? 72) - 5, change: -10 },
          { date: '2 days ago', score: (scoreRes.data?.environmentalScore ?? 72) - 5, change: -3 },
          { date: '3 days ago', score: (scoreRes.data?.environmentalScore ?? 72) + 2, change: 8 },
        ]);
      } catch (err) {
        console.error('Failed to fetch map data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map data');

        // Set fallback data
        setMetrics([
          {
            label: 'Air Quality',
            value: 58,
            unit: 'AQI',
            level: 'moderate',
            icon: <Wind size={20} />,
          },
          {
            label: 'Heat Risk',
            value: 34,
            unit: '°C',
            level: 'poor',
            icon: <Flame size={20} />,
          },
          {
            label: 'Flood Risk',
            value: 12,
            unit: '%',
            level: 'good',
            icon: <Droplets size={20} />,
          },
          {
            label: 'Noise',
            value: 62,
            unit: 'dB',
            level: 'moderate',
            icon: <Volume2 size={20} />,
          },
        ]);

        setAlerts([
          {
            id: '1',
            type: 'warning',
            title: 'High Heat Index',
            description: 'Heat index expected until 5 PM. Feels like 38°C.',
            icon: <AlertCircle size={20} />,
          },
          {
            id: '2',
            type: 'info',
            title: 'Air Quality Improved',
            description: 'Air quality improved by 12% compared to yesterday.',
            icon: <TrendingUp size={20} />,
          },
        ]);

        setGreenSpaces([
          { id: '1', name: 'Taman Sari Park', distance: 0.8, status: 'Open now', tags: ['Low noise'] },
          { id: '2', name: 'Blang Padang Field', distance: 1.4, status: 'Open now', tags: ['Good air'] },
          { id: '3', name: 'Ulee Lheue Beach', distance: 3.2, status: 'Open', tags: ['Breezy'] },
        ]);

        setScoreHistory([
          { date: 'Today, 10:00 AM', score: 72, change: 5 },
          { date: 'Yesterday', score: 67, change: -10 },
          { date: '2 days ago', score: 67, change: -3 },
          { date: '3 days ago', score: 70, change: 8 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ══ EVENT HANDLERS ══
  const handleLocationSearch = async (query: string) => {
    setSearchQuery(query);
    // TODO: Implement location search if backend supports it
    // const result = await LocationApi.Resolve({ query });
    console.log('Location search:', query);
  };

  const handleAlertClick = (alertId: string) => {
    console.log('Alert clicked:', alertId);
    // TODO: Navigate to alert detail or show modal
  };

  const handleGreenSpaceClick = (spaceId: string) => {
    console.log('Green space clicked:', spaceId);
    // TODO: Navigate to green space detail or show modal
  };

  // ══ RENDER ══
  return (
    <MapScreenSection
      state={{
        location,
        environmentalScore,
        metrics,
        alerts,
        greenSpaces,
        scoreHistory,
        searchQuery,
        loading,
        error,
      }}
      service={{
        onLocationSearch: handleLocationSearch,
        onAlertClick: handleAlertClick,
        onGreenSpaceClick: handleGreenSpaceClick,
      }}
    />
  );
}
