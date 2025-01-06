<template>
  <div
    class="relative w-max min-w-[300px] bg-dark-elevated-2 flex flex-col p-5 rounded-lg overflow-hidden"
  >
    <p class="text-white-opacity-70 text-lg font-wb mb-5">Crédits</p>
    <div class="flex-1 flex flex-col justify-between z-1">
      <p class="text-white-primary text-2xl font-montserrat500">
        {{ authStore.userData?.coins.toLocaleString() }}
      </p>
      <v-btn variant="flat" color="primary" class="text-capitalize"
        >Recharger</v-btn
      >
    </div>
    <img
      src="../../assets/icons/coin-w.svg"
      alt="="
      class="absolute h-[200px] w-auto top-[-55px] right-[-50px] z-0"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import type { AuthStore } from '@/model/auth'

const authStore: AuthStore = useAuthStore()
</script>
