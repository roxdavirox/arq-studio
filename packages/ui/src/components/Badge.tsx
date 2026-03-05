import React from 'react'
import { colors, radii, fontSizes } from '../tokens'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
}

const variantMap: Record<BadgeVariant, { bg: string; color: string }> = {
  default: { bg: colors.stone[100], color: colors.stone[700] },
  success: { bg: 'oklch(95% 0.06 145)', color: 'oklch(38% 0.12 145)' },
  warning: { bg: 'oklch(96% 0.07 80)', color: 'oklch(42% 0.14 80)' },
  error: { bg: 'oklch(95% 0.07 25)', color: 'oklch(42% 0.16 25)' },
  info: { bg: 'oklch(95% 0.07 230)', color: 'oklch(40% 0.14 230)' },
}

export const Badge = ({ variant = 'default', children }: BadgeProps) => {
  const { bg, color } = variantMap[variant]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2em 0.6em',
        borderRadius: radii.full,
        fontSize: fontSizes.xs,
        fontWeight: 600,
        background: bg,
        color,
        lineHeight: 1.5,
      }}
    >
      {children}
    </span>
  )
}
