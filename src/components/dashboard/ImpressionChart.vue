<template>
  <div
    class="relative w-max min-w-[500px] bg-dark-elevated-2 p-5 rounded-lg overflow-hidden"
  >
    <div class="mb-5 flex justify-between items-start">
      <p class="text-white-opacity-70 text-lg font-wb">Impressions</p>
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
    <div class="flex">
      <div class="flex flex-col justify-between items-end mb-5">
        <p
          :style="{
            opacity:
              sparkLinesMaxImpression !== sparkLinesMinImpression ? 1 : 0,
          }"
          class="text-xs"
        >
          {{ sparkLinesMaxImpression.toLocaleString() }}
        </p>
        <p
          :style="{
            opacity:
              sparkLinesMaxImpression !== sparkLinesMinImpression ? 1 : 0,
          }"
          class="text-xs"
        >
          {{
            (
              (sparkLinesMaxImpression + sparkLinesMinImpression) /
              2
            ).toLocaleString()
          }}
        </p>
        <p class="text-xs">{{ sparkLinesMinImpression.toLocaleString() }}</p>
      </div>
      <v-sparkline
        v-if="isSparkLineReady"
        :auto-line-width="sparkLines.autoLineWidth"
        :fill="sparkLines.fill"
        :gradient="sparkLines.gradient"
        :gradient-direction="sparkLines.gradientDirection"
        :line-width="sparkLines.width"
        :labels="sparkLinesLabels"
        :model-value="sparkLinesValue"
        :padding="sparkLines.padding"
        :smooth="true"
        :stroke-linecap="sparkLines.lineCap"
        :type="sparkLines.type"
        auto-draw
      >
      </v-sparkline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { type Moment } from 'moment'
import moment from '@/utils/moment'
import { getCampaignsByStartDate } from '@/firebase/functions'
import { printsCalcul } from '@/utils/calcFunctions'
import type { impressionPeriodType } from '@/model/model'

type DatesRangeType = {
  date: Moment
  impressions: number
}

const sparkLines = reactive({
  width: 2.5,
  //   radius: 10,
  height: 100,
  padding: 10,
  lineCap: 'round',
  gradient: ['#1feaea', '#ffd200', '#f72047'],
  gradientDirection: 'top' as 'top' | 'left' | 'right' | 'bottom' | undefined,
  fill: false,
  type: 'trend' as 'trend' | 'bar' | undefined,
  autoLineWidth: false,
})

const isSparkLineReady = ref(false)

const impressionPeriodeOptions = ref<impressionPeriodType[]>([
  { period: 'week', duration: 7, display: 'Cette semaine' },
  { period: 'month', duration: 30, display: 'Ce mois-ci' },
])
const impressionPeriode = ref(impressionPeriodeOptions.value[0])

const startDate = computed(() => {
  return moment().startOf(impressionPeriode.value.period)
})

const datesRange = ref<DatesRangeType[]>([])

const sparkLinesValue = computed(() => {
  if (!datesRange.value) return []
  return datesRange.value.map((date: DatesRangeType) => date.impressions)
})

const sparkLinesLabels = computed(() => {
  if (!datesRange.value) return []

  return datesRange.value.map((dateRange: DatesRangeType) => {
    if (impressionPeriode.value.period === 'month') {
      const isMonday = moment(dateRange.date).day() === 1
      return isMonday ? moment(dateRange.date).format('ddd DD') : ' '
    }
    return moment(dateRange.date).format('ddd')
  })
})

const sparkLinesMaxImpression = computed(() => {
  const maxImpression = Math.max(...sparkLinesValue.value)
  return maxImpression
})
const sparkLinesMinImpression = computed(() => {
  const maxImpression = Math.min(...sparkLinesValue.value)
  return maxImpression
})

const generateDatesRangeArray = (
  startDate: moment.Moment,
  numberOfDates: number,
): DatesRangeType[] => {
  return Array.from({ length: numberOfDates }, (_, i) => ({
    date: startDate.clone().add(i, 'days'),
    impressions: 0,
  }))
}

const updateDatesRangeImpressions = async () => {
  try {
    const campaigns = await getCampaignsByStartDate(startDate.value.toDate())
    if (!campaigns.length) return

    campaigns.forEach(campaign => {
      campaign.datesRange.forEach(timestamp => {
        const date = moment(timestamp.seconds * 1000)
        const index = datesRange.value.findIndex((item: DatesRangeType) =>
          date.isSame(item.date, 'day'),
        )
        if (index !== -1) {
          const { printsByMinute, boxCount } = campaign
          const daysDuration = 1
          const impressions = printsCalcul(
            printsByMinute,
            daysDuration,
            boxCount,
          )
          datesRange.value[index].impressions += impressions
        }
      })
    })
  } catch {
    console.error('error on fetch campaign')
  }
}

const setSparkLinesValue = async () => {
  isSparkLineReady.value = false
  datesRange.value = generateDatesRangeArray(
    startDate.value,
    impressionPeriode.value.duration,
  )
  await updateDatesRangeImpressions()
  isSparkLineReady.value = true
}

watch(impressionPeriode, async () => {
  setSparkLinesValue()
})

onMounted(() => {
  setSparkLinesValue()
})
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
