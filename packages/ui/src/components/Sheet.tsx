import React from 'react'
import { colors, radii, shadows, transitions } from '../tokens'

// Mobile-first bottom sheet / drawer
interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Sheet = ({ open, onClose, title, children }: SheetProps) => (
  <>
    {/* Backdrop */}
    <div
      aria-hidden="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'oklch(0% 0 0 / 0.5)',
        zIndex: 40,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: `opacity ${transitions.base}`,
      }}
    />

    {/* Sheet */}
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.stone[50],
        borderRadius: `${radii['2xl']} ${radii['2xl']} 0 0`,
        boxShadow: shadows.xl,
        zIndex: 50,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: `transform 300ms ${transitions.spring}`,
        maxHeight: '90dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Drag handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0.75rem 0 0.25rem' }}>
        <div
          style={{
            width: '2.5rem',
            height: '0.25rem',
            borderRadius: radii.full,
            background: colors.stone[300],
          }}
        />
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1.25rem 0.75rem',
          borderBottom: `1px solid ${colors.stone[200]}`,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: colors.stone[900] }}>
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            background: 'none',
            border: 'none',
            padding: '0.5rem',
            cursor: 'pointer',
            color: colors.stone[500],
            borderRadius: radii.base,
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
    </div>
  </>
)
