import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      needsProfile?: boolean
      email?: string | null
      name?: string | null
    }
  }

  interface User {
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
    needsProfile?: boolean
  }
}
