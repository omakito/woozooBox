<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import type { OfferType } from '@/model/model'
import { getCollectionData } from '@/firebase/functions'
import OfferCard from './OfferCard.vue'

const state = reactive({
  offers: [] as OfferType[],
})

onMounted(async () => {
  const offersData = (await getCollectionData('offer')) as OfferType[]
  state.offers = offersData
    .sort((a, b) => a.duration - b.duration)
    .sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable))
})
</script>

<template>
  <h2 class="font-wb">Nos offres</h2>
  <div class="flex justify-around flex-wrap gap-14">
    <OfferCard v-for="offer in state.offers" :key="offer.id" :offer="offer" />
  </div>
</template>

<style scoped>
h2 {
  font-size: clamp(35px, 2vw, 50px);
  color: #fafafa;
  margin-bottom: 40px;
  position: relative;
  line-height: 1;
  /*&::first-letter {
    @apply text-green-primary;
  }*/
  &::after {
    content: '';
    position: absolute;
    bottom: -7px;
    left: 5px;
    width: 33px;
    height: 3px;
    border-radius: 4px;
    @apply bg-green-primary;
  }
}
</style>
