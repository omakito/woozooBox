<template>
  <div class="min-w-[500px] bg-dark-elevated-2 flex flex-col p-5 rounded-lg">
    <div class="mb-5 flex justify-between items-start">
      <p class="text-white-opacity-70 text-lg font-wb">
        Répartition<br> des Impressions
      </p>
      <v-chip-group
        v-model="impressionPeriode"
        selected-class="text-primary "
        mandatory
      >
        <v-chip
          v-for="tag in impressionPeriodeOptions"
          :key="tag.period"
          :text="tag.display"
          :value="tag"
          variant="tonal"
        ></v-chip>
      </v-chip-group>
    </div>
    <!-- <p class="text-white-opacity-70 text-lg font-wb mb-5">
      Répartition des Impressions
    </p> -->
    <div class="flex-1 flex justify-center items-center">
      <div class="relative">
        <apexchart
          height="300"
          type="donut"
          :options="chartOptions"
          :series="series"
        ></apexchart>
        <StreamingIcon
          class="w-16 h-auto absolute top-[95px] left-[calc(50%-(32px))]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCampaignsByStartDate } from '@/firebase/functions'
import type { CampaignType, impressionPeriodType } from '@/model/model'
import moment from '@/utils/moment'
import { printsCalcul, printsDurationCalcul } from '@/utils/calcFunctions'
import StreamingIcon from '../icons/IconStreaming.vue'

const impressionPeriodeOptions = ref<impressionPeriodType[]>([
  { period: 'week', duration: 7, display: 'Cette semaine' },
  { period: 'month', duration: 30, display: 'Ce mois-ci' },
])
const impressionPeriode = ref(impressionPeriodeOptions.value[0])

const chartOptions = ref({
  theme: {
    mode: 'dark',
  },
  chart: {
    id: 'donut-chart',
    background: 'transparent',
  },
  labels: ['Spot 1', 'Spot 2', 'Spot 3', 'Spot4'],
  legend: {
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      expandOnClick: true,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  colors: ['#61d78e', '#f72047', '#ffd200', '#1feaea', '#ff9800'],
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${Math.round(val)}%`,
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} impressions`,
    },
  },
  stroke: {
    show: false,
    width: 1,
  },
})

// Données du graphique
const series = ref([120, 30, 70, 400]) // Valeurs pour chaque secteur

const getCoinsByMonth = (campaigns: CampaignType[]): number[] => {
  const coinsByMonth = Array(12).fill(0)

  campaigns.forEach(campaign => {
    const date = moment.unix(campaign.startDate.seconds)
    const month = date.month()
    const coins = campaign.coins

    coinsByMonth[month] += coins
  })

  return coinsByMonth
}

const getDurationByMonth = (campaigns: CampaignType[]): number[] => {
  const durationByMonth = Array(12).fill(0)

  campaigns.forEach(campaign => {
    const date = moment.unix(campaign.startDate.seconds)
    const month = date.month()
    const duration = printsDurationCalcul(
      campaign.spotDuration,
      campaign.printsByMinute,
      campaign.duration,
      campaign.boxCount,
    )

    durationByMonth[month] += duration
  })

  return durationByMonth
}

const getPrintsByMonth = (campaigns: CampaignType[]): number[] => {
  const printsByMonth = Array(12).fill(0)

  campaigns.forEach(campaign => {
    const date = moment.unix(campaign.startDate.seconds)
    const month = date.month()
    const prints = printsCalcul(
      campaign.printsByMinute,
      campaign.duration,
      campaign.boxCount,
    )

    printsByMonth[month] += prints
  })

  return printsByMonth
}

onMounted(async () => {})
</script>

<style lang="scss" scoped>
.v-chip-group {
  padding: 0;
  :deep(.v-slide-group__content) {
    gap: 10px;
    .v-chip {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}
</style>
