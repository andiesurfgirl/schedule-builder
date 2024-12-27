export interface Activity {
  id: string
  name: string
  duration: number
  days: string[]
  time: string
  color: string
  coverImage?: string  // URL of the image
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  savedSchedules: {
    id: string
    name: string
    schedule: { [key: string]: Activity[] }
    activities: Activity[]
    createdAt: string
    updatedAt: string
  }[]
}

