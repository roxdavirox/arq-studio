import React from 'react'
import { spacing } from '../tokens'

interface StackProps {
  direction?: 'row' | 'column'
  gap?: keyof typeof spacing
  align?: React.CSSProperties['alignItems']
  justify?: React.CSSProperties['justifyContent']
  wrap?: boolean
  children: React.ReactNode
  style?: React.CSSProperties
}

export const Stack = ({
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap,
  children,
  style,
}: StackProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: spacing[gap],
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? 'wrap' : undefined,
      ...style,
    }}
  >
    {children}
  </div>
)
