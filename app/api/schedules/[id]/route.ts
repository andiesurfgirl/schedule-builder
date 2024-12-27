import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.schedule.delete({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    // Return all schedules after deletion
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Delete schedule error:', error)
    return NextResponse.json(
      { error: 'Error deleting schedule' },
      { status: 500 }
    )
  }
} 