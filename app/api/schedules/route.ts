// app/api/schedules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import prisma from '../../../lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        userId: token.sub
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Parse JSON strings back into objects for each schedule
    const parsedSchedules = schedules.map(schedule => ({
      ...schedule,
      activities: JSON.parse(schedule.activities as string),
      schedule: JSON.parse(schedule.schedule as string)
    }))

    return NextResponse.json(parsedSchedules)
  } catch (error) {
    console.error('Schedules API error:', error)
    return NextResponse.json(
      { error: 'Error getting schedules', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req })
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to find user by email if ID lookup fails
    let user = await prisma.user.findUnique({
      where: { id: token.sub }
    })

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: token.email }
      })
    }

    if (!user) {
      console.error('User not found:', { 
        tokenSub: token.sub, 
        tokenEmail: token.email,
        tokenName: token.name 
      })
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { name, activities, schedule } = await req.json()
    console.log('Creating schedule for user:', user.id)

    const savedSchedule = await prisma.schedule.create({
      data: {
        name,
        activities: JSON.stringify(activities || []),
        schedule: JSON.stringify(schedule || {}),
        userId: user.id
      }
    })

    // Parse the JSON strings back to objects before sending response
    return NextResponse.json({
      ...savedSchedule,
      activities: JSON.parse(savedSchedule.activities as string),
      schedule: JSON.parse(savedSchedule.schedule as string)
    })

  } catch (error) {
    console.error('Failed to save schedule:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save schedule', 
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}