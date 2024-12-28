import type { User } from 'next-auth'

export interface UserUpdate {
  name?: string
  email?: string
  avatar?: string
  suggestions_enabled?: boolean
}

// Update UserSettings props
interface UserSettingsProps {
  user: User
  onUpdateUser: (updates: UserUpdate) => Promise<void> | void
  // ... rest of props
}
