<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { openDialogChoice } from '@/utils/sweetAlert'
import router from '@/router'
import type { AuthStore } from '@/model/auth'
import type { UserData } from '@/model/model'
import {
  BuildingOffice2Icon,
  UserCircleIcon,
  EnvelopeIcon,
  CircleStackIcon,
  PowerIcon,
  PlusCircleIcon,
} from '@heroicons/vue/24/outline'

const userData = ref<UserData | null>()
const authStore: AuthStore = useAuthStore()

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

watch(
  () => authStore.userData,
  newVal => {
    userData.value = newVal
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="userData" class="text-center">
    <img
      id="menu-activator"
      :src="userData.logo"
      alt="User Logo"
      class="w-7 h-7 rounded-full cursor-pointer"
    />

    <v-menu activator="#menu-activator" open-on-hover>
      <v-list class="bg-orange-600">
        <v-list-item>
          <v-list-item-title>
            <BuildingOffice2Icon class="size-5 text-green-primary" />
            {{ userData.code }}</v-list-item-title
          >
          <v-list-item-title>
            <UserCircleIcon class="size-5 text-green-primary" />
            {{ userData.firstName }} {{ userData.lastName }}</v-list-item-title
          >
          <v-list-item-title>
            <EnvelopeIcon class="size-5 text-green-primary" />
            {{ userData.email }}</v-list-item-title
          >
          <v-list-item-title class="coins">
            <CircleStackIcon class="size-5 text-amber-300" />
            {{ userData.coins.toLocaleString() }}
            <PlusCircleIcon
              v-tooltip:top="'acheter des crédits'"
              class="size-5 text-green-primary"
              @click="router.push('/booking')"
          /></v-list-item-title>
          <v-list-item-title class="logout" @click="logout">
            <PowerIcon class="size-5 text-orange-500" />
            Déconnexion
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style lang="scss" scoped>
.v-menu {
  :deep(.v-list) {
    @apply bg-dark-elevated-3 text-white-primary;
    .v-list-item-title {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 5px;
      font-weight: 500;
      &:not(.coins) {
        font-size: 14px;
      }
      &.coins {
        font-size: 16px;
        font-weight: 600;
        svg:last-of-type {
          margin: auto 0 auto auto;
          opacity: 0.6;
          cursor: pointer;
          transition: 300ms;
          &:hover {
            opacity: 1;
          }
        }
      }
      &.logout {
        cursor: pointer;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #777;
        svg {
          transition: 300ms;
        }
        &:hover svg {
          color: orangered;
        }
      }
    }
  }
}
</style>
