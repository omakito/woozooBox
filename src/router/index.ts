import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookingView from '../views/BookingView.vue'
import OurOffersView from '../views/OurOffersView.vue'
import LoginView from '../views/LoginView.vue'
import CampaignView from '../views/CampaignView.vue'
import { useAuthStore } from '@/stores/auth'
import type { AuthStore } from '@/model/auth'

const authGuard = async () => {
  const authStore: AuthStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return { name: 'Login' }
  }
}

const guestGuard = async () => {
  const authStore: AuthStore = useAuthStore()
  if (authStore.isAuthenticated) {
    return { name: 'Dashboard' }
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresGuest: true }, // Optionnel: pour empêcher l'accès à la page de connexion une fois connecté
      beforeEnter: [guestGuard],
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: HomeView,
      meta: { requiresAuth: true },
      beforeEnter: authGuard,
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/booking',
      name: 'booking',
      component: BookingView,
      beforeEnter: authGuard,
    },
    {
      path: '/campaign',
      name: 'campaign',
      component: CampaignView,
      beforeEnter: authGuard,
    },
    {
      path: '/offers',
      name: 'offers',
      component: OurOffersView,
      beforeEnter: authGuard,
    },
    // {
    //   path: '/:catchAll(.*)', // Route 404 pour les pages non trouvées
    //   component: NotFound,
    // },
  ],
})

export default router
