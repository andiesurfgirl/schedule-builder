import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

interface SaveScheduleRequest {
  name: string
  schedule: { [key: string]: any[] }
  activities: any[]
}

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, schedule, activities }: SaveScheduleRequest = await request.json()

    const savedSchedule = await prisma.schedule.create({
      data: {
        name,
        activities,
        schedule,
        userId: session.user.id
      }
    })

    return NextResponse.json(savedSchedule)
  } catch (error) {
    console.error('Save schedule error:', error)
    return NextResponse.json(
      { error: 'Error saving schedule' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        savedSchedules: true
      }
    })

    return NextResponse.json(user?.savedSchedules || [])
  } catch (error) {
    console.error('Get schedules error:', error)
    return NextResponse.json(
      { error: 'Error getting schedules' },
      { status: 500 }
    )
  }
} 