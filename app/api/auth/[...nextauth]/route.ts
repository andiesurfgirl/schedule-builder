// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { AuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '../../../lib/prisma'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          // Replace this with your actual auth logic
          const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          }).then(res => res.json())
          
          return user
        } catch (error) {
          return null
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'github') {
        // Check if user exists
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!dbUser) {
          // Create new user if they don't exist
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              password: '', // Empty password for OAuth users
              avatar: user.image
            }
          })
          user.id = newUser.id
        } else {
          user.id = dbUser.id
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.email = token.email
        session.user.name = token.name
        session.user.avatar = token.picture
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }