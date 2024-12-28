import { useState } from 'react'
import { UserUpdate, UserSettingsProps } from '../types/user'

export default function UserSettings({ 
  user, 
  onUpdateUser, 
  onClose, 
  onLogout,
  suggestions_enabled,
  onToggleSuggestions 
}: UserSettingsProps) {
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const cleanAvatarUrl = avatarUrl.split('?')[0]
      
      await onUpdateUser({ 
        name,
        email,
        avatar: cleanAvatarUrl,
        suggestions_enabled
      })
      onClose()
    } catch (error) {
      console.error('Failed to update user:', error)
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-mono mb-4">Profile Settings</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                className="mt-2 w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          <div className="flex items-center justify-between py-2 border-t">
            <span className="text-sm text-gray-700">Auto-suggest schedule fixes</span>
            <button
              type="button"
              onClick={() => onToggleSuggestions(!suggestions_enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                suggestions_enabled ? 'bg-[#f7e9e9]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  suggestions_enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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
          <button
            type="button"
            onClick={() => {
              onLogout()
              onClose()
            }}
            className="w-full py-2 px-4 text-sm border border-dashed border-black rounded-md bg-red-200 hover:bg-red-300"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}