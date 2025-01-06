<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppMenu from './components/AppMenu.vue'
import { useAuthStore } from './stores/auth'
import type { AuthStore } from './model/auth'
import { computed } from 'vue'

const authStore: AuthStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <AppMenu v-if="isAuthenticated">
    <RouterView />
  </AppMenu>

  <RouterView v-else />
</template>
