import { themeConfig } from '@/configs/theme.config';

export const getMetricColor = (level: string, theme: typeof themeConfig.light): string => {
  switch (level) {
    case 'good':
      return theme.success.background;
    case 'moderate':
      return theme.warning.background;
    case 'poor':
      return theme.destructive.background;
    case 'unhealthy':
      return '#7C2D12';
    default:
      return theme.primary.background;
  }
};
