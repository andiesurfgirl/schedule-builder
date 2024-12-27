// app/api/schedules/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import prisma from '../../../../lib/prisma'

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request })
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the schedule belongs to the user
    const schedule = await prisma.schedule.findUnique({
      where: { id: context.params.id },
      select: { userId: true }
    })

    if (!schedule || schedule.userId !== token.sub) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.schedule.delete({
      where: { id: context.params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete schedule:', error)
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 })
  }
}