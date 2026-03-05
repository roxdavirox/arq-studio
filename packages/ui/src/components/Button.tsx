import React from 'react'
import { colors, radii, transitions, touchTargets, fontSizes } from '../tokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'base' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: colors.terracotta[500],
    color: colors.stone[50],
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: colors.stone[700],
    border: `1.5px solid ${colors.stone[300]}`,
  },
  ghost: {
    background: 'transparent',
    color: colors.stone[600],
    border: 'none',
  },
  danger: {
    background: 'transparent',
    color: colors.error,
    border: `1.5px solid ${colors.error}`,
  },
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: touchTargets.min, padding: '0 0.75rem', fontSize: fontSizes.sm },
  base: { height: touchTargets.base, padding: '0 1.25rem', fontSize: fontSizes.base },
  lg: { height: touchTargets.lg, padding: '0 1.75rem', fontSize: fontSizes.md },
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'base', loading, fullWidth, children, style, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 500,
        letterSpacing: '0.01em',
        borderRadius: radii.lg,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        transition: `all ${transitions.fast}`,
        width: fullWidth ? '100%' : 'auto',
        WebkitTapHighlightColor: 'transparent',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {loading ? <Loader size={16} /> : children}
    </button>
  ),
)

Button.displayName = 'Button'

// Inline spinner for loading state
const Loader = ({ size }: { size: number }) => (
  <span
    role="status"
    aria-label="Carregando"
    style={{
      width: size,
      height: size,
      border: `2px solid currentColor`,
      borderTopColor: 'transparent',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'arq-spin 0.7s linear infinite',
    }}
  />
)
