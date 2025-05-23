import { AuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from './prisma'
import bcrypt from 'bcrypt'

const defaultAvatar = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60"

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user?.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar ?? undefined,
          suggestions_enabled: user.suggestions_enabled
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'github' || account?.provider === 'google') {
        const existingUser = await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            name: user.name || undefined,
            avatar: user.image || user.avatar || undefined
          },
          create: {
            email: user.email!,
            name: user.name!,
            avatar: user.image || defaultAvatar,
            password: '', // Empty password for OAuth users
            suggestions_enabled: false
          }
        })
        user.id = existingUser.id
        user.avatar = existingUser.avatar ?? undefined
        user.suggestions_enabled = existingUser.suggestions_enabled
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        return { ...token, ...session.user }
      }
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.avatar = user.avatar
        token.suggestions_enabled = user.suggestions_enabled
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.avatar = token.avatar as string
        session.user.suggestions_enabled = token.suggestions_enabled as boolean
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    }
  }
} 