import type { ThemeDefinition } from 'vuetify'

export const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#6200EE',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

export const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#4CAF50',
    surface: '#1c1c1c',
    primary: '#61d78e',
    'surface-elevated-1': '#CF6679',
    'primary-darken-1': '#3700B3',
    secondary: '#2196F3',
    'secondary-darken-1': '#03DAC6',
    tertiary: '#ff9800',
    error: '#CF6679',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    tonal: '#FB8C00', // Custom tonal background color
  },
  variables: {
    // 'primary-overlay-multiplier': 0,
    // 'activated-opacity': 0
  },
}

export const defaultTheme = 'dark'
