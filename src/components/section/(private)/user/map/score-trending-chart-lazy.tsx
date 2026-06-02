'use client';

import dynamic from 'next/dynamic';

import type { ScoreHistoryData } from './score-trending-chart';

const ScoreTrendingChart = dynamic(() => import('./score-trending-chart'), {
  ssr: false,
  loading: () => (
    <div className="w-full animate-pulse rounded-lg bg-muted" style={{ height: 200 }} aria-hidden />
  ),
});

export type { ScoreHistoryData };

export default ScoreTrendingChart;
