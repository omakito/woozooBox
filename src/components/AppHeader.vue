<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import UserBadge from './userBadge.vue'
import type { AuthStore } from '@/model/auth'

const authStore: AuthStore = useAuthStore()

const navLinks = [
  { text: 'Dashboard', to: '/dashboard' },
  { text: 'Mes campagnes', to: '/campaign' },
  { text: 'Booking', to: '/booking' },
  { text: 'Nos offres', to: '/offers' },
]
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 h-14 py-3 px-4 bg-[#181818] z-50 flex justify-between"
  >
    <img alt="Vue logo" class="w-auto" src="@/assets/icons/logo.svg" />
    <!-- <img alt="Vue logo" class="h-10 w-auto" src="@/assets/icons/logo_woozooBox.png" /> -->
    <nav class="flex items-center gap-3 text-white">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="font-semibold hover:text-green-primary duration-300"
        >{{ link.text }}</RouterLink
      >
      <UserBadge v-if="authStore.isAuthenticated" />
    </nav>
  </header>
</template>
