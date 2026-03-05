import { colors, fontSizes } from '@arq/ui'

export const TopBar = () => (
  <header
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      height: '3.5rem',
      display: 'flex',
      alignItems: 'center',
      paddingInline: '1rem',
      background: colors.stone[50],
      borderBottom: `1px solid ${colors.stone[200]}`,
      paddingTop: 'env(safe-area-inset-top)',
    }}
  >
    <span
      style={{
        fontSize: fontSizes.lg,
        fontWeight: 700,
        color: colors.stone[900],
        letterSpacing: '-0.02em',
      }}
    >
      Arq<span style={{ color: colors.terracotta[500] }}>Studio</span>
    </span>
  </header>
)
