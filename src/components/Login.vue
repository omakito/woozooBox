<template>
  <v-form fast-fail @submit.prevent="login" class="max-w-[500px] flex-1">
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Email"
    ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Mot de passe"
    ></v-text-field>

    <v-btn
      class="mt-2 text-subtitle-1"
      color="#61d78e"
      variant="flat"
      type="submit"
      block
      >Se connecter</v-btn
    >
  </v-form>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { openToast } from '@/utils/sweetAlert'

export default {
  data: () => ({
    email: '',
    emailRules: [
      value => {
        if (value) return true

        return 'E-mail est requis'
      },
      value => {
        if (/.+@.+\..+/.test(value)) return true

        return 'E-mail doit etre valide'
      },
    ],
    password: '',
    passwordRules: [
      value => {
        if (value?.length > 5) return true

        return 'Le mot de passe doit contenir au moins 6 caractères'
      },
    ],
  }),
  created() {
    this.router = useRouter()
    this.authStore = useAuthStore()
  },
  methods: {
    async login() {
      let emailValid = this.emailRules.every(rule => rule(this.email) === true)
      let passwordValid = this.passwordRules.every(
        rule => rule(this.password) === true,
      )

      if (!emailValid || !passwordValid) {
        openToast({
          icon: 'error',
          title: 'Formulaire incomplet',
        })
        return
      }

      await this.authStore.login(this.email, this.password)

      if (
        this.authStore.error &&
        this.authStore.error === 'Firebase: Error (auth/invalid-credential).'
      ) {
        openToast({
          icon: 'error',
          title: 'Email ou mot de passe invalide',
        })
      }

      if (this.authStore.isAuthenticated) {
        this.router.push('/dashboard')
        openToast({
          icon: 'success',
          title: 'Connexion réussie',
          timerProgressBar: false,
        })
      }
    },
  },
}
</script>
