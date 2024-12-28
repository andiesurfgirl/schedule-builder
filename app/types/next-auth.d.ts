import 'next-auth'
import { DefaultSession } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    avatar?: string
    suggestions_enabled?: boolean
  }

  interface Session {
    user: User & {
      suggestions_enabled?: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    name: string
    email: string
    avatar?: string
    suggestions_enabled?: boolean
  }
} 