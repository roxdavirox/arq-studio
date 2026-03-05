export const response = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN ?? '*',
  },
  body: JSON.stringify({ data: body }),
})

export const errorResponse = (code: string, statusCode: number) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ error: { code } }),
})

export const parseBody = (body: string | null | undefined): Record<string, unknown> | null => {
  if (!body) return null
  try {
    return JSON.parse(body)
  } catch {
    return null
  }
}
