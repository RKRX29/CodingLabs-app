import { connectDB } from '@/app/lib/mongodb'
import { AUTH_COOKIE_NAME, signAuthToken } from '@/app/lib/auth'
import { applyRateLimit } from '@/app/lib/rateLimit'
import User from '@/app/lib/models/User'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const rate = applyRateLimit(req, {
      keyPrefix: 'login',
      limit: 10,
      windowMs: 10 * 60 * 1000
    })
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
      )
    }

    await connectDB()
    const body = await req.json()

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signAuthToken(String(user._id))

    const response = NextResponse.json({ userId: user._id, name: user.name })
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
