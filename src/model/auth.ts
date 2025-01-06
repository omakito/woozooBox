import type { User } from 'firebase/auth'
import type { Store } from 'pinia'
import type { UserData } from './model'

export type AuthState = {
  user: User | null
  userData: UserData | null
  error: string | null
  isAuthReady: boolean
}

export type AuthStoreGetters = {
  isAuthenticated: (state: any) => boolean
  getUser: (state: any) => User | null
  getError: (state: any) => string | null
}

export type AuthStoreActions = AuthState & {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUserData: (user: User | null) => Promise<void>
  initAuth: () => Promise<void>
}

export type AuthStore = Store<
  'auth',
  AuthState,
  AuthStoreGetters,
  AuthStoreActions
>
