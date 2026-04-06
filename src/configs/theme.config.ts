interface ColorConfig {
  background: string;
  foreground: string;
}

interface ThemeConfig {
  light: {
    background: string;
    foreground: string;
    card: ColorConfig;
    popover: ColorConfig;
    primary: ColorConfig;
    secondary: ColorConfig;
    muted: ColorConfig;
    accent: ColorConfig;
    destructive: ColorConfig;
    warning: ColorConfig;
    success: ColorConfig;
    info: ColorConfig;
    border: string;
    input: string;
    ring: string;
  };
  dark: {
    background: string;
    foreground: string;
    card: ColorConfig;
    popover: ColorConfig;
    primary: ColorConfig;
    secondary: ColorConfig;
    muted: ColorConfig;
    accent: ColorConfig;
    destructive: ColorConfig;
    warning: ColorConfig;
    success: ColorConfig;
    info: ColorConfig;
    border: string;
    input: string;
    ring: string;
  };
}

export const themeConfig: ThemeConfig = {
  light: {
    background: '#EAF7F2',
    foreground: '#036666',
    card: {
      background: '#F7FCFA',
      foreground: '#036666',
    },
    popover: {
      background: '#F7FCFA',
      foreground: '#036666',
    },
    primary: {
      background: '#248277',
      foreground: '#F7FCFA',
    },
    secondary: {
      background: '#88D4AB',
      foreground: '#036666',
    },
    muted: {
      background: '#D8EFE5',
      foreground: 'rgba(3, 102, 102, 0.65)',
    },
    accent: {
      background: '#67B99A',
      foreground: '#F7FCFA',
    },
    destructive: {
      background: '#B95757',
      foreground: '#F7FCFA',
    },
    warning: {
      background: '#A7B96A',
      foreground: '#113C34',
    },
    success: {
      background: '#248277',
      foreground: '#F7FCFA',
    },
    info: {
      background: '#469D89',
      foreground: '#F7FCFA',
    },
    border: 'rgba(3, 102, 102, 0.2)',
    input: 'rgba(3, 102, 102, 0.2)',
    ring: 'rgba(36, 130, 119, 0.35)',
  },
  dark: {
    background: '#042F2F',
    foreground: '#D8EFE5',
    card: {
      background: '#0A3F3F',
      foreground: '#D8EFE5',
    },
    popover: {
      background: '#0A3F3F',
      foreground: '#D8EFE5',
    },
    primary: {
      background: '#67B99A',
      foreground: '#063A3A',
    },
    secondary: {
      background: '#248277',
      foreground: '#D8EFE5',
    },
    muted: {
      background: '#0B4A4A',
      foreground: 'rgba(216, 239, 229, 0.72)',
    },
    accent: {
      background: '#469D89',
      foreground: '#EAF7F2',
    },
    destructive: {
      background: '#A84B58',
      foreground: '#F7FCFA',
    },
    warning: {
      background: '#7F9252',
      foreground: '#EAF7F2',
    },
    success: {
      background: '#67B99A',
      foreground: '#063A3A',
    },
    info: {
      background: '#469D89',
      foreground: '#EAF7F2',
    },
    border: 'rgba(136, 212, 171, 0.2)',
    input: 'rgba(136, 212, 171, 0.22)',
    ring: 'rgba(103, 185, 154, 0.4)',
  },
};
