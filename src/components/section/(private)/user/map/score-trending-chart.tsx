'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { themeConfig } from '@/configs/theme.config';

export interface ScoreHistoryData {
  date: string;
  score: number;
  change: number;
}

interface ScoreTrendingChartProps {
  data: ScoreHistoryData[];
  height?: number;
}

const ScoreTrendingChart: React.FC<ScoreTrendingChartProps> = ({ data, height = 250 }) => {
  const theme = themeConfig.light;

  // Transform data for Recharts - extract simple labels from date strings
  const chartData = useMemo(() => {
    return data.map((item) => {
      // Parse date string like "Today, 10:00 AM" to simple label
      const dateLabel = item.date.includes('Today')
        ? 'Today'
        : item.date.includes('Yesterday')
          ? 'Yesterday'
          : item.date.replace(' ago', '').replace('days', 'd').replace('day', 'd');

      return {
        name: dateLabel,
        score: item.score,
        change: item.change,
        fullDate: item.date,
      };
    });
  }, [data]);

  // Custom tooltip for hover
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="p-2 rounded-lg border shadow-lg"
          style={{
            backgroundColor: 'white',
            borderColor: theme.border,
          }}
        >
          <p style={{ color: theme.foreground }} className="text-xs font-semibold">
            {data.fullDate}
          </p>
          <p style={{ color: theme.primary.background }} className="text-xs font-bold">
            Score: {data.score}/100
          </p>
          <p
            style={{
              color: data.change > 0 ? theme.success.background : theme.destructive.background,
            }}
            className="text-xs"
          >
            {data.change > 0 ? '+' : ''}
            {data.change}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${theme.border}40`} />
          <XAxis
            dataKey="name"
            stroke={theme.muted.foreground}
            style={{
              fontSize: '11px',
              fontWeight: 500,
            }}
            tick={{ fill: theme.muted.foreground }}
            axisLine={{ stroke: theme.border }}
          />
          <YAxis
            stroke={theme.muted.foreground}
            domain={[0, 100]}
            style={{
              fontSize: '11px',
              fontWeight: 500,
            }}
            tick={{ fill: theme.muted.foreground }}
            axisLine={{ stroke: theme.border }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke={theme.primary.background}
            strokeWidth={2.5}
            dot={{
              fill: theme.primary.background,
              r: 4,
              strokeWidth: 2,
              stroke: 'white',
            }}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              stroke: 'white',
            }}
            isAnimationActive={true}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats Summary */}
      <div className="mt-4 flex gap-4">
        {/* Current Score */}
        <div style={{ backgroundColor: theme.background }} className="flex-1 p-3 rounded-lg">
          <p style={{ color: theme.muted.foreground }} className="text-[10px] font-semibold">
            Current Score
          </p>
          <p style={{ color: theme.primary.background }} className="text-lg font-bold mt-1">
            {chartData[chartData.length - 1]?.score || 0}
          </p>
        </div>

        {/* Highest Score */}
        <div style={{ backgroundColor: theme.background }} className="flex-1 p-3 rounded-lg">
          <p style={{ color: theme.muted.foreground }} className="text-[10px] font-semibold">
            Highest Score
          </p>
          <p style={{ color: theme.success.background }} className="text-lg font-bold mt-1">
            {Math.max(...chartData.map((d) => d.score))}
          </p>
        </div>

        {/* Lowest Score */}
        <div style={{ backgroundColor: theme.background }} className="flex-1 p-3 rounded-lg">
          <p style={{ color: theme.muted.foreground }} className="text-[10px] font-semibold">
            Lowest Score
          </p>
          <p style={{ color: theme.destructive.background }} className="text-lg font-bold mt-1">
            {Math.min(...chartData.map((d) => d.score))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreTrendingChart;
