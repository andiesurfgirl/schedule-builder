import { Activity } from '../types'

interface ActivityMenuProps {
  activity: Activity
  position: { x: number; y: number }
  onEdit: (activity: Activity) => void
  onDelete: (activityId: string) => void
  onClose: () => void
}

export default function ActivityMenu({ activity, position, onEdit, onDelete, onClose }: ActivityMenuProps) {
  return (
    <div 
      className="fixed bg-white shadow-lg rounded-md border border-gray-200 py-2 z-50"
      style={{ 
        top: position.y, 
        left: position.x,
      }}
    >
      <button
        onClick={() => onEdit(activity)}
        className="w-full text-left px-4 py-2 hover:bg-gray-50"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(activity.id)}
        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
      >
        Delete
      </button>
      <button
        onClick={onClose}
        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-500"
      >
        Cancel
      </button>
    </div>
  )
} 