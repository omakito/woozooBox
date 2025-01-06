<template>
  <div
    class="w-max bg-dark-elevated-2 flex flex-col gap-5 p-5 rounded-lg flex-1"
  >
    <p class="text-white-opacity-70 text-lg font-wb">Dernières offres</p>
    <v-progress-circular
      v-if="state.isLoading"
      color="primary"
      indeterminate
      class="flex-1 m-auto"
    ></v-progress-circular>
    <v-carousel
      v-else
      height="auto"
      :show-arrows="false"
      cycle
      hide-delimiter-background
      class="flex-1"
    >
      <v-carousel-item
        v-for="(group, index) in groupedOffers"
        :key="index"
        class=""
      >
        <div class="flex gap-5">
          <v-card v-for="offer in group" :key="offer.id" width="50%">
            <Offer :offer="offer" :open-modal="openModal" />
          </v-card>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>

  <OfferModal
    v-model:show-modal="state.showModal"
    v-model:offer-selected="state.offerSelected"
  />
</template>

<script setup lang="ts">
import { getCollectionData } from '@/firebase/functions'
import type { BookingFormType, OfferType } from '@/model/model'
import { computed, onMounted, reactive } from 'vue'
import Offer from './OfferShortcut.vue'
import OfferModal from '@/components/OfferModal.vue'
import initSpotVideo from '@/utils/initSpotVideo'

const state = reactive({
  isLoading: true,
  offers: [] as OfferType[],
  showModal: false,
  offerSelected: undefined as BookingFormType | undefined,
})

const openModal = (offer: OfferType, coinsValue: number) => {
  state.showModal = true

  const offerData: BookingFormType = {
    boxCount: offer.boxCount,
    duration: offer.duration,
    spotDuration: offer.spotDuration,
    printsByMinute: offer.printsByMinute,
    coins: coinsValue,
    dateRange: [],
    city: '',
    spotVideo: initSpotVideo,
  }

  state.offerSelected = offerData
}

const groupedOffers = computed(() => {
  const groupSize = 2
  const result = []
  for (let i = 0; i < state.offers.length; i += groupSize) {
    result.push(state.offers.slice(i, i + groupSize))
  }
  return result
})

onMounted(async () => {
  const offersData = (await getCollectionData('offer')) as OfferType[]
  state.offers = offersData
  state.isLoading = false
})
</script>
