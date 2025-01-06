<script setup lang="ts">
import { computed, ref } from 'vue'
import OfferModal from './OfferModal.vue'
import type { BookingFormType, OfferType } from '@/model/model'
import {
  coinsCalcul,
  isUserEnoughCoins,
  printsCalcul,
} from '@/utils/calcFunctions'
import initSpotVideo from '@/utils/initSpotVideo'
import CubeIcon from './icons/IconCube.vue'
import TimerIcon from './icons/IconTimer.vue'
import TimerPlayIcon from './icons/IconTimerPlay.vue'
import PlayRectangleIcon from './icons/IconPlayRectangle.vue'

const props = defineProps<{
  offer: OfferType
}>()

const offerPrints = computed(() => {
  return printsCalcul(
    props.offer.printsByMinute,
    props.offer.duration,
    props.offer.boxCount,
  )
})

const offerCoins = computed(() => {
  const coins = coinsCalcul(
    props.offer.spotDuration,
    props.offer.printsByMinute,
    props.offer.duration,
    props.offer.boxCount,
  )

  const percentPromo = props.offer.percentPromo ?? 0

  const reduction = (coins * percentPromo) / 100

  return Math.floor(coins - reduction)
})

const propsModal = ref<{
  show: boolean
  offerSelected: BookingFormType | undefined
}>({
  show: false,
  offerSelected: undefined,
})

const isEnoughCoins = () => {
  return isUserEnoughCoins(offerCoins.value)
}

const openModal = () => {
  propsModal.value.show = true

  const offerData: BookingFormType = {
    boxCount: props.offer.boxCount,
    duration: props.offer.duration,
    spotDuration: props.offer.spotDuration,
    printsByMinute: props.offer.printsByMinute,
    coins: offerCoins.value,
    dateRange: [],
    city: '',
    spotVideo: initSpotVideo,
  }
  propsModal.value.offerSelected = offerData
}
</script>

<template>
  <div class="relative max-w-[425px] bg-dark-elevated-2 px-5 py-3 rounded-xl">
    <h3 class="text-2xl text-center text-white-opacity-20 font-semibold">
      {{ props.offer.isAvailable ? props.offer.title : 'Bientot disponible' }}
    </h3>

    <div class="relative flex items-center w-max m-auto">
      <p
        class="text-3xl font-montserrat500 text-neutral-200 flex justify-center items-center my-4"
      >
        {{ offerCoins.toLocaleString() }}
      </p>
      <img src="../assets/icons/coin-w.svg" alt="=" class="w-9 ml-1" />
    </div>

    <button
      v-tooltip:top="
        !props.offer.isAvailable
          ? 'Cette offre n\'est pas encore disponible'
          : !isEnoughCoins()
            ? 'Votre solde de crédits est insuffisant'
            : ''
      "
      class="border-solid border-1 border-green-primary hover:bg-green-primary text-white-primary font-semibold w-full mb-4 px-3 py-2 rounded-lg duration-300 disabled:text-white-opacity-30 disabled:border-white-opacity-20 disabled:hover:bg-transparent"
      :disabled="!props.offer.isAvailable || !isEnoughCoins()"
      @click="openModal"
    >
      Choisir cette offre
    </button>

    <div>
      <div class="flex justify-between my-4 gap-3">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-1">
            <CubeIcon class="w-6 h-auto" />
            <p class="text-neutral-200 font-semibold">
              {{ props.offer.boxCount }} boxs
            </p>
          </div>
          <div class="flex items-center gap-1">
            <TimerPlayIcon class="w-6 h-auto" />
            <p class="text-neutral-200 font-semibold">
              {{ props.offer.printsByMinute.toLocaleString() }}
              impression/minute
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-1">
            <TimerIcon class="w-6 h-auto" />
            <p class="text-neutral-200 font-semibold">
              Spot de {{ props.offer.spotDuration }} secondes
            </p>
          </div>
          <div class="flex items-center gap-1">
            <PlayRectangleIcon class="w-6 h-auto" />
            <p class="text-neutral-200 font-semibold">
              {{ offerPrints.toLocaleString() }} impressions
            </p>
          </div>
        </div>
      </div>
      <p class="font-semibold text-white-primary mb-1">
        {{ props.offer.subTitle }}
      </p>
      <p class="text-white-opacity-70 text-sm">{{ props.offer.description }}</p>
    </div>
    <v-chip variant="tonal" color="primary" class="!absolute right-2.5 top-2.5"
      >- {{ props.offer.percentPromo }} %</v-chip
    >
  </div>
  <OfferModal
    v-model:show-modal="propsModal.show"
    v-model:offer-selected="propsModal.offerSelected"
  />
</template>
