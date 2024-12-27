import { useState } from 'react'
import { Activity, User } from '../types'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import ActivityBank from './ActivityBank'
import Calendar from './Calendar'
import AddActivityForm from './AddActivityForm'

interface ScheduleBuilderProps {
  user: User;
}

export default function ScheduleBuilder({ user }: ScheduleBuilderProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [schedule, setSchedule] = useState<{ [key: string]: Activity[] }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })

  const addActivity = (newActivity: Omit<Activity, 'id'>) => {
    const id = Date.now().toString()
    setActivities([...activities, { ...newActivity, id }])
  }

  const onDragEnd = (result: DropResult) => {
    // Reference the drag and drop logic from page.tsx
    // Lines 54-96
  }

  const detectConflicts = () => {
    const conflicts: { [key: string]: string[] } = {}
    
    Object.entries(schedule).forEach(([day, dayActivities]) => {
      dayActivities.forEach((activity, index) => {
        const [activityHours, activityMinutes] = activity.time.split(':').map(Number)
        const activityStart = activityHours * 60 + activityMinutes
        const activityEnd = activityStart + activity.duration

        dayActivities.forEach((otherActivity, otherIndex) => {
          if (index !== otherIndex) {
            const [otherHours, otherMinutes] = otherActivity.time.split(':').map(Number)
            const otherStart = otherHours * 60 + otherMinutes
            const otherEnd = otherStart + otherActivity.duration

            if (
              (activityStart >= otherStart && activityStart < otherEnd) ||
              (activityEnd > otherStart && activityEnd <= otherEnd) ||
              (activityStart <= otherStart && activityEnd >= otherEnd)
            ) {
              if (!conflicts[day]) conflicts[day] = []
              if (!conflicts[day].includes(activity.id)) conflicts[day].push(activity.id)
              if (!conflicts[day].includes(otherActivity.id)) conflicts[day].push(otherActivity.id)
            }
          }
        })
      })
    })

    return conflicts
  }

  const conflicts = detectConflicts()

  const handleActivityClick = (activity: Activity, e: React.MouseEvent) => {
    // Reference the activity click handler from page.tsx
    // Lines 132-136
  }

  const handleEditActivity = (updatedActivity: Activity) => {
    // Reference the edit activity handler from page.tsx
    // Lines 138-164
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ActivityBank activities={activities} />
          <AddActivityForm onAddActivity={addActivity} />
        </div>
        <div className="lg:col-span-3">
          <Calendar 
            schedule={schedule} 
            conflicts={conflicts}
            onActivityClick={handleActivityClick}
            handleEditActivity={handleEditActivity}
          />
        </div>
      </div>
    </DragDropContext>
  )
} 