import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

// Max-width container, centered, full-width on mobile
export const Container = ({ children, style }: ContainerProps) => (
  <div
    style={{
      width: '100%',
      maxWidth: '1280px',
      marginInline: 'auto',
      paddingInline: 'clamp(1rem, 4vw, 2rem)',
      ...style,
    }}
  >
    {children}
  </div>
)
