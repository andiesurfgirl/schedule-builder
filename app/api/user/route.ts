import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import prisma from '../../../lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token?.email) {
      console.log('Auth failed:', { token })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await req.json()
    console.log('Updating user:', { email: token.email, updates })
    
    const user = await prisma.user.update({
      where: { email: token.email },
      data: {
        name: updates.name,
        email: updates.email,
        avatar: updates.avatar
      }
    })

    console.log('User updated:', user)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 