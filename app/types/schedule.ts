import { Activity } from '../types'

export interface Schedule {
  id: string
  name: string
  userId?: string
  schedule: { [key: string]: Activity[] }
  activities: Activity[]
  createdAt: string
  updatedAt: string
} 