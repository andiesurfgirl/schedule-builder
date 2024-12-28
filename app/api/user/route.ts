import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import prisma from '../../../lib/prisma'
import { Prisma } from '@prisma/client'

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    })
    console.log('Token received:', token)
    
    if (!token?.sub) {
      console.log('Auth failed:', { token })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await req.json()
    console.log('Processing updates:', updates)
    
    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: token.sub }
    })

    if (!existingUser) {
      console.error('No user found with ID:', token.sub)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Then perform the update
    const user = await prisma.user.update({
      where: { id: token.sub },
      data: {
        name: updates.name || undefined,
        email: updates.email || undefined,
        avatar: updates.avatar || undefined,
        suggestions_enabled: updates.suggestions_enabled
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        suggestions_enabled: true
      }
    })

    console.log('Updated user data:', user)
    return NextResponse.json(user)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Prisma or other error:', message)

    return NextResponse.json(
      { 
        error: 'Failed to update profile',
        details: message,
      },
      { status: 500 }
    )
  }
} 