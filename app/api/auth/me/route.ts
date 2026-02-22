import { connectDB } from '@/app/lib/mongodb'
import { getUserIdFromRequest } from '@/app/lib/auth'
import User from '@/app/lib/models/User'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(userId).select('_id name email')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
