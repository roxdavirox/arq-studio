import React from 'react'
import { colors, radii, shadows, spacing, transitions } from '../tokens'

interface CardProps {
  children: React.ReactNode
  interactive?: boolean
  padding?: keyof typeof spacing
  style?: React.CSSProperties
  onClick?: () => void
}

export const Card = ({ children, interactive, padding = 6, style, onClick }: CardProps) => (
  <div
    role={interactive ? 'button' : undefined}
    tabIndex={interactive ? 0 : undefined}
    onClick={onClick}
    onKeyDown={interactive ? e => e.key === 'Enter' && onClick?.() : undefined}
    style={{
      background: colors.stone[50],
      border: `1px solid ${colors.stone[200]}`,
      borderRadius: radii.xl,
      padding: spacing[padding],
      boxShadow: shadows.sm,
      cursor: interactive ? 'pointer' : 'default',
      transition: interactive ? `all ${transitions.fast}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
)
