// Design tokens — Michelangelo architecture theme
// OKLCH color space for perceptual uniformity

export const colors = {
  // Brand — warm concrete + warm white inspired by architecture
  stone: {
    50: 'oklch(98% 0.005 60)',
    100: 'oklch(96% 0.008 60)',
    200: 'oklch(91% 0.012 60)',
    300: 'oklch(84% 0.016 60)',
    400: 'oklch(72% 0.020 60)',
    500: 'oklch(60% 0.024 60)',
    600: 'oklch(50% 0.024 60)',
    700: 'oklch(40% 0.020 60)',
    800: 'oklch(28% 0.016 60)',
    900: 'oklch(18% 0.012 60)',
    950: 'oklch(10% 0.008 60)',
  },
  // Accent — terracotta, architectural warmth
  terracotta: {
    50: 'oklch(97% 0.015 38)',
    100: 'oklch(93% 0.030 38)',
    200: 'oklch(86% 0.060 38)',
    300: 'oklch(77% 0.100 38)',
    400: 'oklch(68% 0.140 38)',
    500: 'oklch(58% 0.165 38)',  // primary
    600: 'oklch(50% 0.155 38)',
    700: 'oklch(42% 0.135 38)',
    800: 'oklch(32% 0.100 38)',
    900: 'oklch(22% 0.065 38)',
  },
  // Status
  success: 'oklch(68% 0.16 145)',
  warning: 'oklch(80% 0.17 80)',
  error: 'oklch(60% 0.20 25)',
  info: 'oklch(65% 0.18 230)',
} as const

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const

export const radii = {
  none: '0',
  sm: '0.25rem',
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 3px oklch(0% 0 0 / 0.08)',
  base: '0 2px 8px oklch(0% 0 0 / 0.08)',
  md: '0 4px 16px oklch(0% 0 0 / 0.10)',
  lg: '0 8px 32px oklch(0% 0 0 / 0.12)',
  xl: '0 16px 48px oklch(0% 0 0 / 0.16)',
} as const

export const transitions = {
  fast: '120ms ease-out',
  base: '200ms ease-out',
  slow: '350ms ease-in-out',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

export const fontSizes = {
  xs: 'clamp(0.7rem, 0.68rem + 0.15vw, 0.75rem)',
  sm: 'clamp(0.8rem, 0.78rem + 0.2vw, 0.875rem)',
  base: 'clamp(0.9rem, 0.88rem + 0.25vw, 1rem)',
  md: 'clamp(1rem, 0.96rem + 0.3vw, 1.125rem)',
  lg: 'clamp(1.125rem, 1.05rem + 0.5vw, 1.375rem)',
  xl: 'clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem)',
  '2xl': 'clamp(1.5rem, 1.3rem + 1.2vw, 2.25rem)',
  '3xl': 'clamp(1.875rem, 1.6rem + 1.6vw, 3rem)',
  '4xl': 'clamp(2.25rem, 1.8rem + 2.5vw, 4rem)',
} as const

// Touch targets — WCAG 2.2 minimum 24px, comfortable 44px
export const touchTargets = {
  min: '1.5rem',     // 24px — WCAG 2.2 minimum
  base: '2.75rem',   // 44px — comfortable mobile
  lg: '3.5rem',      // 56px — FABs and primary CTAs
} as const

// Mobile-first breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const
