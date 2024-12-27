'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { StrictModeDroppable } from './components/StrictModeDroppable'
import ActivityBank from './components/ActivityBank'
import Calendar from './components/Calendar'
import AddActivityForm from './components/AddActivityForm'
import { Activity, User } from './types'
import { Schedule } from './types/schedule'
import CalendarExport from './components/CalendarExport'
import ActivityMenu from './components/ActivityMenu'
import UserProfile from './components/UserProfile'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const defaultProfilePic = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60"

export default function Page() {
  const { data: session } = useSession()
  const router = useRouter()
  
  // Add enabled state to handle hydration
  const [enabled, setEnabled] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setEnabled(true)
  }, [])

  const [activities, setActivities] = useState<Activity[]>(() => {
    // Only show preset activities if no user is logged in
    if (!session?.user) {
      return [
        { id: '1', name: 'Ballet I', duration: 90, days: ['Monday', 'Wednesday'], time: '12:00', color: '#FFE4E4' },
        { id: '2', name: 'Cello Lesson', duration: 60, days: ['Tuesday'], time: '15:00', color: '#E6FFF0' },
        { id: '3', name: 'Surf Practice', duration: 120, days: ['Thursday', 'Saturday'], time: '16:00', color: '#E6F0FF' },
        { id: '4', name: 'Computer Science II', duration: 90, days: ['Monday', 'Tuesday', 'Thursday'], time: '09:20', color: '#F4D9E4' },
        { id: '5', name: 'Physics II', duration: 90, days: ['Monday', 'Tuesday', 'Thursday'], time: '08:00', color: '#FFFAE6' },
      ]
    }
    return []
  })

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
    const { source, destination } = result

    if (!destination) return

    const sourceDay = source.droppableId
    const destDay = destination.droppableId

    if (sourceDay === 'bank' && destDay !== 'bank') {
      const activity = activities.find(a => a.id === result.draggableId)
      if (activity) {
        // Store original days
        const originalDays = [...activity.days]
        
        // Create a new schedule object
        const newSchedule = { ...schedule }
        
        // Add the activity to all designated days
        originalDays.forEach(day => {
          if (!newSchedule[day]) newSchedule[day] = []
          newSchedule[day] = [...newSchedule[day], { ...activity, days: originalDays }]
        })
        
        // Remove the activity from the bank
        setActivities(activities.filter(a => a.id !== activity.id))
        setSchedule(newSchedule)
      }
    } else if (sourceDay !== 'bank' && destDay === 'bank') {
      // Get the activity from the schedule
      const activity = schedule[sourceDay].find(a => a.id === result.draggableId)
      if (activity) {
        // Find all instances of this activity to get all days
        const allDays = Object.entries(schedule)
          .filter(([_, activities]) => activities.some(a => a.id === activity.id))
          .map(([day, _]) => day)

        // Add back to activities bank with all days
        setActivities([...activities, { ...activity, days: allDays }])
        
        // Remove from all days in schedule
        const activityId = result.draggableId
        const newSchedule = Object.fromEntries(
          Object.entries(schedule).map(([day, activities]) => [
            day,
            activities.filter(a => a.id !== activityId)
          ])
        )
        setSchedule(newSchedule)
      }
    }
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
    e.stopPropagation()
    setSelectedActivity(activity)
    setMenuPosition({ x: e.clientX, y: e.clientY })
  }

  const handleEditActivity = (updatedActivity: Activity) => {
    // Update in activities bank if present
    if (activities.some(a => a.id === updatedActivity.id)) {
      setActivities(activities.map(a => 
        a.id === updatedActivity.id ? updatedActivity : a
      ))
    } else {
      // If editing a calendar activity, remove all instances and create new ones
      const newSchedule = { ...schedule }
      
      // Remove all instances of this activity from all days
      Object.keys(newSchedule).forEach(day => {
        newSchedule[day] = newSchedule[day].filter(a => a.id !== updatedActivity.id)
      })
      
      // Add the activity to all selected days
      updatedActivity.days.forEach(day => {
        if (!newSchedule[day]) newSchedule[day] = []
        newSchedule[day] = [...newSchedule[day], { ...updatedActivity, days: [day] }]
      })
      
      setSchedule(newSchedule)
    }
    
    setSelectedActivity(null)
    setIsEditing(false)
  }

  const handleDeleteActivity = (activityId: string) => {
    // Remove from activities array
    setActivities(activities.filter(a => a.id !== activityId))
    
    // Remove from schedule
    const newSchedule = Object.fromEntries(
      Object.entries(schedule).map(([day, activities]) => [
        day,
        activities.filter(a => a.id !== activityId)
      ])
    )
    setSchedule(newSchedule)
    
    setSelectedActivity(null)
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      
      if (result?.error) {
        console.error('Login failed:', result.error)
        // Handle error (show message to user)
      }
    } catch (error) {
      console.error('Login error:', error)
      // Handle error (show message to user)
    }
  }

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      // Call signup API
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      // If signup successful, log user in
      await handleLogin(email, password)
    } catch (error) {
      console.error('Signup error:', error)
      // Handle error (show message to user)
    }
  }

  const handleLogout = () => {
    signOut()
  }

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!user) return
    setUser({ ...user, ...updates })
  }

  const handleSaveSchedule = async (name: string) => {
    try {
      // Clean up the schedule by removing empty arrays
      const cleanSchedule = Object.fromEntries(
        Object.entries(schedule).filter(([_, activities]) => activities.length > 0)
      )

      // Only save activities that are in the bank (not in the schedule)
      const bankActivities = activities.filter(activity => 
        !Object.values(schedule).flat().some(scheduleActivity => 
          scheduleActivity.id === activity.id
        )
      )

      // Log the cleaned data
      console.log('Sending cleaned data:', {
        name,
        activities: bankActivities,
        schedule: cleanSchedule
      })

      const res = await fetch('/api/schedules', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          activities: bankActivities,
          schedule: cleanSchedule
        })
      })

      if (!res.ok) {
        const error = await res.json()
        console.error('Server error details:', error)
        throw new Error('Failed to save schedule')
      }

      const savedSchedule = await res.json()
      router.refresh()
    } catch (error) {
      console.error('Error saving schedule:', error)
    }
  }

  const handleLoadSchedule = (savedSchedule: Schedule) => {
    console.log('Raw saved schedule:', savedSchedule);

    // Parse activities if they're stored as a string
    const parsedActivities = typeof savedSchedule.activities === 'string' 
      ? JSON.parse(savedSchedule.activities)
      : savedSchedule.activities;

    // Parse schedule if it's stored as a string
    const parsedSchedule = typeof savedSchedule.schedule === 'string'
      ? JSON.parse(savedSchedule.schedule)
      : savedSchedule.schedule;

    // Extract activities from schedule
    const scheduledActivities = Object.values(parsedSchedule)
      .flat()
      .filter((activity): activity is Activity => activity !== null);

    // Combine activities from both sources, removing duplicates by ID
    const allActivities = [...new Map(
      [...parsedActivities, ...scheduledActivities]
        .map(activity => [activity.id, activity])
    ).values()];

    // Convert stored image data back to File/Blob if it exists
    const activitiesWithImages = allActivities.map((activity: Activity) => {
      if (activity.coverImage && 
          typeof activity.coverImage === 'string' && 
          activity.coverImage.startsWith('data:image')) {
        try {
          const byteString = atob(activity.coverImage.split(',')[1]);
          const mimeString = activity.coverImage.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          return { ...activity, coverImage: blob };
        } catch (error) {
          console.error('Error converting image:', error);
          return activity;
        }
      }
      return activity;
    });

    // Ensure all days are initialized with the parsed schedule data
    const initializedSchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
      ...parsedSchedule
    };

    // Only put activities in the bank that aren't in the schedule
    const bankActivities = activitiesWithImages.filter(activity => 
      !Object.values(parsedSchedule).flat().some((scheduleActivity: Activity) => 
        scheduleActivity.id === activity.id
      )
    );

    setActivities(bankActivities as Activity[]);
    setSchedule(initializedSchedule);
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      const res = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!res.ok) {
        throw new Error('Failed to delete schedule')
      }

      // Refresh to update the list
      router.refresh()
    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  }

  if (!enabled) {
    return null
  }

  return (
    <div className="container mx-auto p-4 space-y-8 min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-mono text-gray-900">Schedule Builder</h1>
          <div className="flex items-center space-x-4">
            <CalendarExport schedule={schedule} />
            <UserProfile 
              user={session?.user}
              onLogin={handleLogin}
              onSignup={handleSignup}
              onUpdateUser={handleUpdateUser}
              onSaveSchedule={handleSaveSchedule}
              onLoadSchedule={handleLoadSchedule}
              onLogout={handleLogout}
              onDeleteSchedule={handleDeleteSchedule}
            />
          </div>
        </div>
        
        {enabled && (
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
        )}

        {selectedActivity && !isEditing && (
          <ActivityMenu
            activity={selectedActivity}
            position={menuPosition}
            onEdit={(activity) => setIsEditing(true)}
            onDelete={handleDeleteActivity}
            onClose={() => setSelectedActivity(null)}
          />
        )}
        
        {isEditing && selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <AddActivityForm
                onAddActivity={(updatedActivity) => handleEditActivity({ ...updatedActivity, id: selectedActivity.id })}
                initialActivity={selectedActivity}
                onCancel={() => {
                  setIsEditing(false)
                  setSelectedActivity(null)
                }}
              />
            </div>
          </div>
        )}
      </div>

      <footer className="text-center text-sm text-gray-600 py-4">
        <a 
          href="https://andieinprogress.net" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-800 hover:underline"
        >
          made with ♥️ in atl
        </a>
      </footer>
    </div>
  )
}

