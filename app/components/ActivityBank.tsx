import { Draggable } from '@hello-pangea/dnd'
import { Activity } from '../types'
import { StrictModeDroppable } from './StrictModeDroppable'

interface ActivityBankProps {
  activities: Activity[]
}

export default function ActivityBank({ activities }: ActivityBankProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl text-gray-900 mb-4">Activity Bank</h2>
      <StrictModeDroppable droppableId="bank">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3 bg-gray-50 p-4 rounded-md max-h-[400px] overflow-y-auto"
          >
            {activities.map((activity, index) => (
              <Draggable key={activity.id} draggableId={activity.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white rounded-md shadow-sm p-3 transition-shadow hover:shadow-md border border-dashed border-black"
                    style={{
                      ...provided.draggableProps.style,
                      borderLeft: `4px solid ${activity.color}`,
                    }}
                  >
                    <h3 className="font-medium text-gray-900">{activity.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.duration} min - {activity.days.join(', ')} at {activity.time}
                    </p>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </StrictModeDroppable>
    </div>
  )
}

