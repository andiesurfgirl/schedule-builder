import { useState, useEffect } from 'react'
import { User } from '../types'
import UserSettings from './UserSettings'
import AuthModal from './AuthModal'

interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  } | null
  onLogin: (email: string, password: string) => Promise<void>
  onSignup: (email: string, password: string, name: string) => Promise<void>
  onUpdateUser: (updates: Partial<User>) => void
  onSaveSchedule: (name: string) => void
  onLoadSchedule: (schedule: User['savedSchedules'][0]) => void
  onLogout: () => void
  onDeleteSchedule: (scheduleId: string) => void
}

export default function UserProfile({ 
  user, 
  onLogin, 
  onSignup, 
  onUpdateUser,
  onSaveSchedule, 
  onLoadSchedule,
  onLogout,
  onDeleteSchedule
}: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newScheduleName, setNewScheduleName] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [savedSchedules, setSavedSchedules] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetch('/api/schedules', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          const sortedSchedules = [...data].sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          setSavedSchedules(sortedSchedules)
        })
        .catch(console.error)
    }
  }, [user])

  const defaultAvatar = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60"

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuth(true)}
          className="px-4 py-2 bg-[#f7e9e9] rounded-md border border-dashed border-black hover:bg-[#f0dcdc]"
        >
          Login / Sign Up
        </button>
        {showAuth && (
          <AuthModal
            onLogin={onLogin}
            onSignup={onSignup}
            onClose={() => setShowAuth(false)}
          />
        )}
      </>
    )
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-cover bg-center border border-dashed border-black hover:opacity-80 transition-opacity"
        style={{ backgroundImage: `url(${user?.avatar || defaultAvatar})` }}
        aria-label="User profile and saved schedules"
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b">
            <div 
              className="w-8 h-8 rounded-full bg-cover bg-center border border-dashed border-black"
              style={{ backgroundImage: `url(${user?.avatar || defaultAvatar})` }} 
            />
            <div className="flex-grow">
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            <button
              onClick={() => {
                setShowSettings(true)
                setIsOpen(false)
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Edit
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Save Current Schedule</h3>
            <div className="flex space-x-2 w-full">
              <input
                type="text"
                value={newScheduleName}
                onChange={(e) => setNewScheduleName(e.target.value)}
                placeholder="Schedule name"
                className="flex-1 min-w-0 px-2 py-1 border rounded"
              />
              <button
                onClick={async () => {
                  if (newScheduleName.trim()) {
                    await onSaveSchedule(newScheduleName)
                    const res = await fetch('/api/schedules', { credentials: 'include' })
                    const data = await res.json()
                    setSavedSchedules(data)
                    setNewScheduleName('')
                  }
                }}
                className="px-3 py-1 bg-[#f7e9e9] rounded border border-dashed border-black whitespace-nowrap"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Saved Schedules</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedSchedules.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">No saved schedules yet</p>
              ) : (
                savedSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <div className="flex-grow">
                      <div className="font-medium">{schedule.name}</div>
                      <div className="text-xs text-gray-500">
                        Updated {new Date(schedule.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <button
                        onClick={async () => {
                          await onDeleteSchedule(schedule.id)
                          setSavedSchedules(savedSchedules.filter(s => s.id !== schedule.id))
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        aria-label="Delete schedule"
                      >
                        ×
                      </button>
                      <button
                        onClick={() => {
                          onLoadSchedule(schedule)
                          setIsOpen(false)
                        }}
                        className="px-2 py-1 text-sm bg-[#f7e9e9] rounded border border-dashed border-black"
                      >
                        Load
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <UserSettings
          user={user}
          onUpdateUser={onUpdateUser}
          onClose={() => setShowSettings(false)}
          onLogout={onLogout}
        />
      )}
    </div>
  )
}