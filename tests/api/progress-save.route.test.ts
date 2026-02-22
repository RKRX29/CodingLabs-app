import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockConnectDB = vi.fn()
const mockGetUserIdFromRequest = vi.fn()
const mockFindOneAndUpdate = vi.fn()

vi.mock('@/app/lib/mongodb', () => ({
  connectDB: mockConnectDB
}))

vi.mock('@/app/lib/auth', () => ({
  getUserIdFromRequest: mockGetUserIdFromRequest
}))

vi.mock('@/app/lib/models/Progress', () => ({
  default: { findOneAndUpdate: mockFindOneAndUpdate }
}))

describe('POST /api/progress/save', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockConnectDB.mockResolvedValue(undefined)
  })

  it('returns 401 when user is not authenticated', async () => {
    const { POST } = await import('@/app/api/progress/save/route')
    mockGetUserIdFromRequest.mockReturnValue(null)

    const req = new Request('http://localhost:3000/api/progress/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: 'python', lessonId: 'l1' })
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 400 when courseId or lessonId is missing', async () => {
    const { POST } = await import('@/app/api/progress/save/route')
    mockGetUserIdFromRequest.mockReturnValue('u1')

    const req = new Request('http://localhost:3000/api/progress/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: 'python' })
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBe('courseId and lessonId are required')
  })

  it('sends partial update payload without forcing completed=true', async () => {
    const { POST } = await import('@/app/api/progress/save/route')
    mockGetUserIdFromRequest.mockReturnValue('u1')
    mockFindOneAndUpdate.mockResolvedValue({ _id: 'p1', lessonId: 'l1', codePassed: true })

    const req = new Request('http://localhost:3000/api/progress/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: 'python', lessonId: 'l1', codePassed: true })
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.message).toBe('Progress saved')

    const [, updatePayload] = mockFindOneAndUpdate.mock.calls[0]
    expect(updatePayload).toMatchObject({
      userId: 'u1',
      courseId: 'python',
      lessonId: 'l1',
      codePassed: true
    })
    expect(updatePayload.completed).toBeUndefined()
  })
})
