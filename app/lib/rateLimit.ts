type RateLimitOptions = {
  keyPrefix: string
  limit: number
  windowMs: number
}

type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSec: number
}

type Bucket = {
  count: number
  resetAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitStore: Map<string, Bucket> | undefined
}

const store = globalThis.__rateLimitStore || new Map<string, Bucket>()
if (!globalThis.__rateLimitStore) {
  globalThis.__rateLimitStore = store
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

export function applyRateLimit(req: Request, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const key = `${options.keyPrefix}:${getClientIp(req)}`
  const existing = store.get(key)

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return {
      allowed: true,
      remaining: Math.max(0, options.limit - 1),
      retryAfterSec: Math.ceil(options.windowMs / 1000)
    }
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    }
  }

  existing.count += 1
  store.set(key, existing)
  return {
    allowed: true,
    remaining: Math.max(0, options.limit - existing.count),
    retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
  }
}
