import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockApplyRateLimit = vi.fn()

vi.mock('@/app/lib/rateLimit', () => ({
  applyRateLimit: mockApplyRateLimit
}))

describe('POST /api/code/execute', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockApplyRateLimit.mockReturnValue({ allowed: true, remaining: 10, retryAfterSec: 60 })
  })

  it('returns 429 when rate limit is exceeded', async () => {
    const { POST } = await import('@/app/api/code/execute/route')
    mockApplyRateLimit.mockReturnValueOnce({ allowed: false, remaining: 0, retryAfterSec: 120 })

    const req = new Request('http://localhost:3000/api/code/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'python', code: 'print("hi")' })
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(429)
    expect(body.error).toContain('Too many code execution requests')
    expect(res.headers.get('Retry-After')).toBe('120')
  })

  it('returns 400 for unsupported language', async () => {
    const { POST } = await import('@/app/api/code/execute/route')

    const req = new Request('http://localhost:3000/api/code/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'ruby', code: 'puts 1' })
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toContain('Unsupported language')
  })

  it('returns execution output for valid python request', async () => {
    const { POST } = await import('@/app/api/code/execute/route')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          stdout: 'Hello\n',
          stderr: null,
          compile_output: null,
          message: null,
          status: { id: 3, description: 'Accepted' },
          time: '0.01',
          memory: 1000
        })
      })
    )

    const req = new Request('http://localhost:3000/api/code/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'python', code: 'print("Hello")' })
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.language).toBe('python')
    expect(body.stdout).toBe('Hello\n')
  })
})
