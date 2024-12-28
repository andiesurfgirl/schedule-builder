import { Activity } from '../types'

interface ScheduleSuggestionsProps {
  schedule: { [key: string]: Activity[] }
  conflicts: { [key: string]: string[] }
  onApplySuggestion: (updatedSchedule: { [key: string]: Activity[] }) => void
}

export default function ScheduleSuggestions({ schedule, conflicts, onApplySuggestion }: ScheduleSuggestionsProps) {
  const generateSuggestions = () => {
    const suggestions: { [key: string]: Activity[] }[] = []
    
    // For each day with conflicts
    Object.entries(conflicts).forEach(([day, conflictingIds]) => {
      const dayActivities = schedule[day]
      
      // Try shifting activities by 30-minute intervals
      const shiftedSchedule = { ...schedule }
      conflictingIds.forEach(activityId => {
        const activity = dayActivities.find(a => a.id === activityId)
        if (activity) {
          const [hours, minutes] = activity.time.split(':').map(Number)
          const currentTime = hours * 60 + minutes
          
          // Try different time slots (±2 hours in 30-minute intervals)
          for (let offset = -120; offset <= 120; offset += 30) {
            const newTime = currentTime + offset
            const newHours = Math.floor(newTime / 60)
            const newMinutes = newTime % 60
            
            if (newHours >= 0 && newHours < 24) {
              const updatedActivity = {
                ...activity,
                time: `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
              }
              
              const testSchedule = {
                ...shiftedSchedule,
                [day]: shiftedSchedule[day].map(a => 
                  a.id === activityId ? updatedActivity : a
                )
              }
              
              // Check if this change resolves conflicts
              if (!hasConflicts(testSchedule, day)) {
                suggestions.push(testSchedule)
                break
              }
            }
          }
        }
      })
    })
    
    return suggestions
  }
  
  const hasConflicts = (schedule: { [key: string]: Activity[] }, day: string) => {
    const activities = schedule[day]
    for (let i = 0; i < activities.length; i++) {
      for (let j = i + 1; j < activities.length; j++) {
        if (activitiesOverlap(activities[i], activities[j])) {
          return true
        }
      }
    }
    return false
  }
  
  const activitiesOverlap = (a1: Activity, a2: Activity) => {
    const [h1, m1] = a1.time.split(':').map(Number)
    const [h2, m2] = a2.time.split(':').map(Number)
    const start1 = h1 * 60 + m1
    const end1 = start1 + a1.duration
    const start2 = h2 * 60 + m2
    const end2 = start2 + a2.duration
    
    return (start1 < end2 && end1 > start2)
  }
  
  const suggestions = generateSuggestions()

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Schedule Suggestions</h3>
      {suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="border rounded p-3">
              <p className="text-sm mb-2">Suggestion {index + 1}:</p>
              <ul className="text-sm text-gray-600">
                {Object.entries(suggestion).map(([day, activities]) => (
                  activities.map(activity => (
                    <li key={activity.id}>
                      Move "{activity.name}" to {activity.time} on {day}
                    </li>
                  ))
                ))}
              </ul>
              <button
                onClick={() => onApplySuggestion(suggestion)}
                className="mt-2 px-3 py-1 text-sm bg-[#f7e9e9] hover:bg-[#f0dcdc] rounded"
              >
                Apply This Suggestion
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No suggestions available for current conflicts.</p>
      )}
    </div>
  )
} 