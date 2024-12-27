import 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      avatar?: string
      savedSchedules: any[]
    }
  }
  
  interface User {
    id: string
    email: string
    name: string
    avatar?: string
    savedSchedules: any[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    savedSchedules: any[]
  }
} 