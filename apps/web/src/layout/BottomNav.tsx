import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Video, User } from 'lucide-react'
import { colors, fontSizes, transitions } from '@arq/ui'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Início' },
  { to: '/projects', icon: FolderOpen, label: 'Projetos' },
  { to: '/consultations', icon: Video, label: 'Consultas' },
  { to: '/profile', icon: User, label: 'Perfil' },
]

export const BottomNav = () => (
  <nav
    aria-label="Navegação principal"
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(4rem + env(safe-area-inset-bottom))',
      paddingBottom: 'env(safe-area-inset-bottom)',
      background: colors.stone[50],
      borderTop: `1px solid ${colors.stone[200]}`,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      zIndex: 20,
    }}
  >
    {navItems.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          color: isActive ? colors.terracotta[500] : colors.stone[400],
          textDecoration: 'none',
          fontSize: fontSizes.xs,
          fontWeight: isActive ? 600 : 400,
          transition: `color ${transitions.fast}`,
          WebkitTapHighlightColor: 'transparent',
          minHeight: '44px',
        })}
      >
        <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
        {label}
      </NavLink>
    ))}
  </nav>
)
