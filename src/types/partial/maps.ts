export interface EnvironmentalMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  level: 'good' | 'moderate' | 'poor' | 'unhealthy';
  icon: React.ReactNode | string;
  color?: string;
  radiusKm?: number;
  description?: string;
  shape?: 'dot' | 'ring';
  latitude?: number;
  longitude?: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'info';
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Recommendation {
  id: string;
  message: string;
  severity: number;
  recommendationType?: string;
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
