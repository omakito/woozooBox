import { defineStore } from 'pinia'
import { auth } from '@/firebase/config'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import type {
  AuthState,
  AuthStoreActions,
  AuthStoreGetters,
} from '@/model/auth'
import { GetDataById } from '@/firebase/functions'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    userData: null,
    error: null,
    isAuthReady: false,
  }),
  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    getUser: (state): User | null => state.user,
    getError: (state): string | null => state.error,
  } as AuthStoreGetters,
  actions: {
    async login(email: string, password: string): Promise<void> {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        )
        this.user = userCredential.user
        this.error = null
      } catch (err) {
        this.error = err.message
      }
    },
    async logout(): Promise<void> {
      await signOut(auth)
      this.user = null
    },
    async setUserData(user: User | null) {
      if (!user) {
        this.userData = null
        return
      }
      const userData = await GetDataById('users', user.uid)
      this.userData = userData
    },
    initAuth() {
      return new Promise<void>(resolve => {
        onAuthStateChanged(auth, async currentUser => {
          this.user = currentUser
          await this.setUserData(currentUser)
          this.isAuthReady = true
          resolve()
        })
      })
    },
  } as AuthStoreActions,
  persist: true,
})
