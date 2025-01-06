import './assets/main.css'
import './assets/sweetAlert.scss'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { VDateInput } from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import { lightTheme, darkTheme, defaultTheme } from './theme'
import { en, fr } from 'vuetify/locale'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())

// Initialize firebase auth
const authStore = useAuthStore()
await authStore.initAuth()

app.use(router)

// Vuetify
const vuetify = createVuetify({
  locale: {
    locale: 'fr',
    messages: { en, fr },
  },
  components: {
    VDateInput,
    ...components,
  },
  directives,
  theme: {
    defaultTheme,
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
})

app.use(vuetify)

app.use(VueSweetalert2)

app.use(VueApexCharts)

console.log('app mount')

app.mount('#app')
