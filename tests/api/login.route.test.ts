import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockConnectDB = vi.fn()
const mockSignAuthToken = vi.fn()
const mockApplyRateLimit = vi.fn()
const mockCompare = vi.fn()
const mockFindOne = vi.fn()

vi.mock('@/app/lib/mongodb', () => ({
  connectDB: mockConnectDB
}))

vi.mock('@/app/lib/auth', () => ({
  AUTH_COOKIE_NAME: 'auth_token',
  signAuthToken: mockSignAuthToken
}))

vi.mock('@/app/lib/rateLimit', () => ({
  applyRateLimit: mockApplyRateLimit
}))

vi.mock('bcryptjs', () => ({
  default: { compare: mockCompare }
}))

vi.mock('@/app/lib/models/User', () => ({
  default: { findOne: mockFindOne }
}))

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockApplyRateLimit.mockReturnValue({ allowed: true, remaining: 9, retryAfterSec: 120 })
    mockConnectDB.mockResolvedValue(undefined)
  })

  it('returns 429 when rate limit is exceeded', async () => {
    const { POST } = await import('@/app/api/auth/login/route')
    mockApplyRateLimit.mockReturnValueOnce({ allowed: false, remaining: 0, retryAfterSec: 60 })

    const req = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@a.com', password: '123' })
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(429)
    expect(body.error).toContain('Too many login attempts')
    expect(res.headers.get('Retry-After')).toBe('60')
  })

  it('returns 400 for missing email/password', async () => {
    const { POST } = await import('@/app/api/auth/login/route')

    const req = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '' })
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBe('Email and password required')
  })

  it('returns 200 and sets auth cookie for valid credentials', async () => {
    const { POST } = await import('@/app/api/auth/login/route')
    mockFindOne.mockResolvedValue({ _id: 'u1', name: 'User', password: 'hashed' })
    mockCompare.mockResolvedValue(true)
    mockSignAuthToken.mockReturnValue('signed-token')

    const req = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: '123456' })
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.userId).toBe('u1')
    expect(body.name).toBe('User')
    expect(res.headers.get('set-cookie')).toContain('auth_token=signed-token')
  })
})
