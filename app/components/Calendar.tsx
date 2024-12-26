import { Draggable } from '@hello-pangea/dnd'
import { Activity } from '../types'
import { StrictModeDroppable } from './StrictModeDroppable'
import { useState } from 'react'

interface CalendarProps {
  schedule: { [key: string]: Activity[] }
  conflicts: { [key: string]: string[] }
  onActivityClick?: (activity: Activity, e: React.MouseEvent) => void
}

interface OverlapInfo {
  time: number
  activities: string[]
  position: { x: number; y: number }
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const hours = Array.from({ length: 24 }, (_, i) => i)

export default function Calendar({ schedule, conflicts, onActivityClick }: CalendarProps) {
  const [overlapInfo, setOverlapInfo] = useState<OverlapInfo | null>(null)

  const calculateOverlap = (activity: Activity, day: string) => {
    const activities = schedule[day]
    const [hours, minutes] = activity.time.split(':').map(Number)
    const activityStart = hours * 60 + minutes
    const activityEnd = activityStart + activity.duration

    const overlappingActivities = activities.filter(other => {
      if (other.id === activity.id) return false
      const [otherHours, otherMinutes] = other.time.split(':').map(Number)
      const otherStart = otherHours * 60 + otherMinutes
      const otherEnd = otherStart + other.duration

      return (
        (activityStart >= otherStart && activityStart < otherEnd) ||
        (activityEnd > otherStart && activityEnd <= otherEnd) ||
        (activityStart <= otherStart && activityEnd >= otherEnd)
      )
    })

    if (overlappingActivities.length > 0) {
      return {
        activities: [activity.name, ...overlappingActivities.map(a => a.name)],
        time: Math.min(activityEnd, Math.max(...overlappingActivities.map(a => {
          const [h, m] = a.time.split(':').map(Number)
          return h * 60 + m + a.duration
        }))) - Math.max(activityStart, Math.min(...overlappingActivities.map(a => {
          const [h, m] = a.time.split(':').map(Number)
          return h * 60 + m
        })))
      }
    }
    return null
  }

  const handleActivityClick = (activity: Activity, day: string, e: React.MouseEvent) => {
    if (conflicts[day]?.includes(activity.id)) {
      const overlap = calculateOverlap(activity, day)
      if (overlap) {
        setOverlapInfo({
          ...overlap,
          position: { x: e.clientX, y: e.clientY }
        })
      }
    }
    onActivityClick?.(activity, e)
  }

  const getActivityStyle = (activity: Activity, day: string) => {
    const startHour = parseInt(activity.time.split(':')[0])
    const startMinute = parseInt(activity.time.split(':')[1])
    const top = (startHour + startMinute / 60) * 60
    const height = activity.duration

    const hasConflict = conflicts[day]?.includes(activity.id)
    const opacity = hasConflict ? 0.7 : 0.9

    return {
      position: 'absolute',
      top: `${top}px`,
      height: `${height}px`,
      width: 'calc(100% - 8px)',
      backgroundColor: activity.color,
      opacity,
      borderRadius: '4px',
      padding: '4px',
      fontSize: '12px',
      overflow: 'hidden',
      border: hasConflict ? '2px solid red' : 'none',
      backgroundImage: activity.coverImage ? `url(${activity.coverImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  const renderActivityContent = (activity: Activity) => (
    <div style={{ 
      backgroundColor: activity.coverImage ? activity.color : 'transparent',
      padding: '2px 4px',
      borderRadius: '2px',
      display: 'inline-block'
    }}>
      {activity.name}
    </div>
  )

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex">
        <div className="w-16"></div>
        {days.map(day => (
          <div key={day} className="flex-1 text-center font-semibold">{day}</div>
        ))}
      </div>
      <div className="flex">
        <div className="w-16">
          {hours.map(hour => (
            <div key={hour} className="h-[60px] text-right pr-2 text-sm text-gray-500">
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>
        {days.map(day => (
          <StrictModeDroppable key={day} droppableId={day}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-1 border-l relative"
                style={{ height: `${24 * 60}px` }}
              >
                {hours.map(hour => (
                  <div key={hour} className="h-[60px] border-b border-gray-100"></div>
                ))}
                {schedule[day].map((activity, index) => (
                  <Draggable key={activity.id} draggableId={activity.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={(e) => handleActivityClick(activity, day, e)}
                        style={
                          {
                            ...getActivityStyle(activity, day),
                            ...(provided.draggableProps.style || {})
                          } as React.CSSProperties
                        }
                      >
                        {renderActivityContent(activity)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        ))}
      </div>
      {overlapInfo && (
        <div
          className="fixed bg-white p-3 rounded-lg shadow-lg text-sm z-50"
          style={{
            top: overlapInfo.position.y + 10,
            left: overlapInfo.position.x + 10
          }}
          onClick={() => setOverlapInfo(null)}
        >
          <p className="font-semibold">Overlap: {overlapInfo.time} minutes</p>
          <p>Between:</p>
          <ul className="list-disc pl-4">
            {overlapInfo.activities.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-2">(Click to close)</p>
        </div>
      )}
    </div>
  )
}

