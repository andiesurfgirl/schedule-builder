import type { User } from 'next-auth'

export interface UserUpdate {
  name?: string
  email?: string
  avatar?: string
  suggestions_enabled?: boolean
}

export interface UserSettingsProps {
  user: User
  onUpdateUser: (updates: UserUpdate) => Promise<void> | void
  onClose: () => void
  onLogout: () => void
  suggestions_enabled: boolean
  onToggleSuggestions: (enabled: boolean) => void
} 