import React from 'react'
import { colors, radii } from '../tokens'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 32 | 40 | 48 | 56
}

export const Avatar = ({ src, name, size = 40 }: AvatarProps) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div
      aria-label={name}
      role="img"
      style={{
        width: size,
        height: size,
        borderRadius: radii.full,
        background: src ? 'transparent' : colors.terracotta[100],
        color: colors.terracotta[700],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size * 0.35,
        overflow: 'hidden',
        flexShrink: 0,
        border: `1.5px solid ${colors.stone[200]}`,
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials
      )}
    </div>
  )
}
