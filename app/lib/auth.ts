import jwt from 'jsonwebtoken'

export const AUTH_COOKIE_NAME = 'auth_token'

type AuthPayload = {
  userId: string
  iat?: number
  exp?: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function signAuthToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

function getCookieValue(cookieHeader: string, name: string) {
  const parts = cookieHeader.split(';').map((part) => part.trim())
  const entry = parts.find((part) => part.startsWith(`${name}=`))
  if (!entry) return null
  return decodeURIComponent(entry.slice(name.length + 1))
}

export function getUserIdFromRequest(req: Request) {
  const cookieHeader = req.headers.get('cookie') || ''
  const token = getCookieValue(cookieHeader, AUTH_COOKIE_NAME)
  if (!token) return null

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload
    return payload.userId || null
  } catch {
    return null
  }
}
