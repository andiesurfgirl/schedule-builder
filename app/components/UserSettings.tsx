import { useState } from 'react'
import { User } from '../types'

interface UserSettingsProps {
  user: User
  onUpdateUser: (updates: Partial<User>) => void
  onClose: () => void
}

export default function UserSettings({ user, onUpdateUser, onClose }: UserSettingsProps) {
  const [name, setName] = useState(user.name)
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateUser({ name, avatar: avatarUrl })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-mono mb-4">Profile Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="https://example.com/avatar.jpg"
            />
            {avatarUrl && (
              <img 
                src={avatarUrl} 
                alt="Avatar preview" 
                className="mt-2 w-20 h-20 rounded-full object-cover border border-dashed border-black"
              />
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-dashed border-black rounded-md bg-[#f7e9e9]"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-dashed border-black rounded-md bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}