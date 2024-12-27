import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { NextAuthOptions } from 'next-auth'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            savedSchedules: true
          }
        })

        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          savedSchedules: user.savedSchedules
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback:', { token, user })
      if (user) {
        token.id = user.id
        token.savedSchedules = user.savedSchedules
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token })
      if (session.user) {
        session.user.id = token.id as string
        session.user.savedSchedules = token.savedSchedules as any[]
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 