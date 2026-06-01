import { theme, type ThemeTokens } from '@/configs/theme.config';

export const getMetricColor = (level: string, t: ThemeTokens = theme): string => {
  switch (level) {
    case 'good':
      return t.success.background;
    case 'moderate':
      return t.warning.background;
    case 'poor':
      return t.destructive.background;
    case 'unhealthy':
      return '#7c2d12';
    default:
      return t.primary.background;
  }
};
