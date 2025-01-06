<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '../stores/auth'
import { openDialogChoice } from '@/utils/sweetAlert'
import type { AuthStore } from '@/model/auth'

const authStore: AuthStore = useAuthStore()

const logout = async () => {
  const result = await openDialogChoice({
    text: 'Voulez-vous vraiment vous déconnecter ?',
  })

  if (result.isConfirmed) {
    authStore.logout().then(() => {
      router.push('/login')
    })
  }
}
</script>

<template>
  <button @click="logout" class="hover:text-orange-700 duration-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2.3"
      stroke="currentColor"
      class="size-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
      />
    </svg>
    déconnexion
  </button>
</template>
