<script setup lang="ts">
import CoinsStack from '../components/dashboard/CoinsStack.vue'
import ImpressionChart from '../components/dashboard/ImpressionChart.vue'
import ViewChart from '../components/dashboard/ViewChart.vue'
import CampaignHistory from '../components/dashboard/CampaignHistory.vue'
import Offer from '../components/dashboard/offer/OffersShortcut.vue'
import CoinsBarStack from '@/components/dashboard/CoinsBarStack.vue'
import PieChart from '@/components/dashboard/PieChart.vue'
</script>

<template>
  <div class="flex justify-between gap-7 mb-14">
    <CoinsStack />
    <ImpressionChart />
    <ViewChart />
  </div>
  <div class="flex justify-between gap-7 mb-14">
    <CampaignHistory />
    <Offer />
  </div>
  <div class="flex gap-7"><CoinsBarStack /><PieChart /></div>
</template>

<style scoped>
main *:not(.font-montserrat500, .font-wbBold) {
  font-family: 'wb', sans-serif;
}
</style>
