import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Stack, Input, Button, Card, colors, fontSizes } from '@arq/ui'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: implement magic link auth
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.stone[100],
        paddingInline: '1rem',
      }}
    >
      <Container style={{ maxWidth: '420px' }}>
        <Card>
          <Stack gap={6} style={{ padding: '0.5rem' }}>
            <Stack gap={1}>
              <h1 style={{ fontSize: fontSizes['2xl'], fontWeight: 800, color: colors.stone[900], margin: 0, letterSpacing: '-0.02em' }}>
                Arq<span style={{ color: colors.terracotta[500] }}>Studio</span>
              </h1>
              <p style={{ fontSize: fontSizes.sm, color: colors.stone[500], margin: 0 }}>
                Portal do cliente. Acesse com seu e-mail.
              </p>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                <Input
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                />
                <Button type="submit" variant="primary" fullWidth loading={loading}>
                  Enviar link de acesso
                </Button>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Container>
    </div>
  )
}
