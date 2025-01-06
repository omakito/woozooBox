<template>
  <div class="bg-dark-elevated-4 flex flex-col gap-3 px-5 py-3 rounded-lg">
    <p class="text-white-opacity-70">{{ offer.subTitle }}</p>
    <div class="flex justify-between gap-3">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-1">
          <CubeIcon class="w-6 h-auto" />
          <p class="text-neutral-200 font-semibold">
            {{ props.offer.boxCount }} boxs
          </p>
        </div>
        <div class="flex items-center gap-1">
          <TimerIcon class="w-6 h-auto" />
          <p class="text-neutral-200 font-semibold">
            Spot de {{ props.offer.spotDuration }} secondes
          </p>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-1">
          <TimerPlayIcon class="w-6 h-auto" />
          <p class="text-neutral-200 font-semibold">
            {{ props.offer.printsByMinute.toLocaleString() }}
            impr./minute
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
    <div class="flex justify-center items-center gap-1">
      <p class="text-neutral-200 font-montserrat500 text-2xl">
        {{ offerCoins.toLocaleString() }}
      </p>
      <img
        src="../../../assets/icons/coin-w.svg"
        alt="coins"
        class="w-7 h-auto"
      />
    </div>
    <button
      v-tooltip:top="
        !props.offer.isAvailable
          ? 'Cette offre n\'est pas encore disponible'
          : !isEnoughCoins()
            ? 'Votre solde de crédits est insuffisant'
            : ''
      "
      class="border-solid border-1 border-green-primary hover:bg-green-primary text-white-primary w-full px-3 py-2 rounded-lg duration-300 disabled:text-white-opacity-30 disabled:border-white-opacity-20 disabled:hover:bg-transparent"
      :disabled="!props.offer.isAvailable || !isEnoughCoins()"
      @click="openOfferModal"
    >
      Profiter de cette offre
    </button>
  </div>
</template>

<script setup lang="ts">
import type { OfferType } from '@/model/model'
import { computed } from 'vue'
import CubeIcon from '@/components/icons/IconCube.vue'
import TimerIcon from '@/components/icons/IconTimer.vue'
import TimerPlayIcon from '@/components/icons/IconTimerPlay.vue'
import PlayRectangleIcon from '@/components/icons/IconPlayRectangle.vue'
import {
  coinsCalcul,
  isUserEnoughCoins,
  printsCalcul,
} from '@/utils/calcFunctions'

const props = defineProps<{
  offer: OfferType
  openModal: (offer: OfferType, coinsValue: number) => void
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

const isEnoughCoins = () => {
  return isUserEnoughCoins(offerCoins.value)
}

const openOfferModal = () => {
  props.openModal(props.offer, offerCoins.value)
}
</script>
