<template>
  <div class="flex-1 bg-dark-elevated-2 flex flex-col p-5 rounded-lg">
    <p class="text-white-opacity-70 text-lg font-wb mb-5">
      Données mensuelles
    </p>
    <div>
      <apexchart
        height="300"
        type="bar"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCampaignsByStartDate } from '@/firebase/functions'
import type { CampaignType } from '@/model/model'
import moment from '@/utils/moment'
import { printsCalcul, printsDurationCalcul } from '@/utils/calcFunctions'

const chartOptions = ref({
  theme: {
    mode: 'dark',
  },
  chart: {
    id: 'vuechart-example',
    background: 'transparent',
  },
  xaxis: {
    categories: [
      'Janvier',
      'Fevrier',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Aout',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ],
    labels: {
      style: {
        colors: '#fafafa',
        fontSize: '0.75rem',
        fontFamily: 'wb, sans-serif',
      },
    },
    axisBorder: {
      show: false,
      color: '#FF5733',
      height: 1,
    },
    axisTicks: {
      show: false,
      color: '#fafafa',
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#fafafa',
        fontSize: '0.75rem',
        fontFamily: 'wb, sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  grid: {
    borderColor: '#3a3a3a',
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '100%',
    },
  },
  colors: ['#008FFB', '#61d78e'],
  dataLabels: {
    formatter: function (val: number) {
      return val === 0 ? '' : val
    },
  },
})

const series = ref([
  {
    name: 'Crédits utilisés',
    data: [],
  },
  {
    name: 'Temps total de diffusion en minutes',
    data: [],
  },
])

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

onMounted(async () => {
  const now = new Date()
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1)

  const campaigns = await getCampaignsByStartDate(firstDayOfYear)
  series.value[0].data = getCoinsByMonth(campaigns)
  series.value[1].data = getDurationByMonth(campaigns)
})
</script>

<style scoped lang="scss">
  :deep(.apexcharts-toolbar) {
    top: -50px !important;
    right: -5px;
  }
</style>
