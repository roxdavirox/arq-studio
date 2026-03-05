import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopBar } from './TopBar'
import { colors } from '@arq/ui'

export const AppShell = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      background: colors.stone[100],
    }}
  >
    <TopBar />
    <main
      style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))',
      }}
    >
      <Outlet />
    </main>
    <BottomNav />
  </div>
)
