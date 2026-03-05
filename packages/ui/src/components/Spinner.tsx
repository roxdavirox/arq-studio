import React from 'react'
import { colors } from '../tokens'

interface SpinnerProps {
  size?: number
  color?: string
  label?: string
}

export const Spinner = ({ size = 24, color = colors.terracotta[500], label = 'Carregando' }: SpinnerProps) => (
  <span
    role="status"
    aria-label={label}
    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'arq-spin 0.7s linear infinite' }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" strokeOpacity="0.2" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </span>
)
