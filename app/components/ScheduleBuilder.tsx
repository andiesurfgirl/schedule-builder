// components/ScheduleBuilder.tsx
// Add these functions to your existing ScheduleBuilder component

import { useState } from 'react'
import { Activity } from '../types'
import { Schedule } from '../types/schedule'

interface ScheduleBuilderProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  } | null
}

export default function ScheduleBuilder({ user }: ScheduleBuilderProps) {
  const [activities, setActivities] = useState<Activity[]>([])

  const saveSchedule = async (name: string) => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          activities
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save schedule')
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving schedule:', error)
      throw error
    }
  }

  const loadSchedule = (schedule: Schedule) => {
    setActivities(schedule.activities)
  }

  return null // Add your JSX here
}