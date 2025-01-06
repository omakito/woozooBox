<template>
  <v-dialog v-model="show" max-width="700">
    <v-card>
      <v-card-title>Reserver votre campagne </v-card-title>
      <v-card-text>
        <booking-form
          :is-offer="true"
          :form-data="offerSelected"
          @cancel="closeModal"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { BookingFormType } from '@/model/model'
import BookingForm from './BookingForm.vue'

const show = defineModel<boolean>('showModal')
const offerSelected = defineModel<BookingFormType>('offerSelected')

const closeModal = () => {
  show.value = false
}
</script>
