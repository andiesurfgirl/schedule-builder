import 'next-auth'
import { DefaultSession } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    avatar?: string
  }

  interface Session {
    user: User & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    name: string
    email: string
    avatar?: string
  }
} 