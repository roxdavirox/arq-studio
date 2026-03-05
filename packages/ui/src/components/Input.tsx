import React from 'react'
import { colors, radii, transitions, fontSizes, touchTargets } from '../tokens'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, style, ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <label
          htmlFor={inputId}
          style={{ fontSize: fontSizes.sm, fontWeight: 500, color: colors.stone[700] }}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={[error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          style={{
            height: touchTargets.base,
            padding: '0 0.875rem',
            fontSize: fontSizes.base,
            border: `1.5px solid ${error ? colors.error : colors.stone[300]}`,
            borderRadius: radii.lg,
            background: colors.stone[50],
            color: colors.stone[900],
            outline: 'none',
            transition: `border-color ${transitions.fast}`,
            width: '100%',
            boxSizing: 'border-box',
            ...style,
          }}
          {...props}
        />
        {hint && !error && (
          <span id={hintId} style={{ fontSize: fontSizes.xs, color: colors.stone[500] }}>
            {hint}
          </span>
        )}
        {error && (
          <span id={errorId} role="alert" style={{ fontSize: fontSizes.xs, color: colors.error }}>
            {error}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
