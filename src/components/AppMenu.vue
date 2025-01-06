<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import type { AuthStore } from '@/model/auth'
import type { UserData } from '@/model/model'
import { openDialogChoice } from '@/utils/sweetAlert'
import router from '@/router'

const userData = ref<UserData | null>()
const rail = ref<boolean>(false)

const authStore: AuthStore = useAuthStore()

const navLinks = [
  { icon: 'mdi-view-dashboard', text: 'Dashboard', to: '/dashboard' },
  { icon: 'mdi-movie-open-plus', text: 'Créer une campagne', to: '/booking' },
  // { icon: 'mdi-clipboard-text-search', text: 'Mes campagnes', to: '/campaign' },
  { icon: 'mdi-clipboard-text-play', text: 'Mes campagnes', to: '/campaign' },
  { icon: 'mdi-tag-heart', text: 'Nos offres', to: '/offers' },
]

const logout = async () => {
  const result = await openDialogChoice({
    text: 'Etes-vous sûr de vouloir vous déconnecter ?',
  })

  if (result.isConfirmed) {
    authStore.logout().then(() => {
      router.push('/login')
    })
  }
}

onMounted(async () => {
  userData.value = authStore.userData
})
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer :rail="rail" permanent @click="rail = false">
        <v-list class="d-flex flex-column pb-0" style="height: 100%">
          <div
            v-if="!userData"
            class="w-6 h-6 mx-auto rounded-full bg-white-opacity-20"
          ></div>

          <v-list-item
            v-else
            :prepend-avatar="userData.logo"
            :title="userData.firstName + ' ' + userData.lastName"
            :subtitle="userData.email"
          >
            <template #append>
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = !rail"
              ></v-btn> </template
          ></v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list density="compact" nav>
            <v-list-item
              v-for="link in navLinks"
              :key="link.text"
              :to="link.to"
              :prepend-icon="link.icon"
              :title="link.text"
            ></v-list-item>
          </v-list>

          <v-list-item
            prepend-icon="mdi-power"
            title="Déconnexion"
            class="mt-auto"
            @click="logout"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <div class="p-8">
          <slot></slot>
        </div>
      </v-main>
    </v-layout>
  </v-card>
</template>
