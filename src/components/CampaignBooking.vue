<script setup lang="ts">
import { computed, ref } from 'vue'
import BookingForm from './BookingForm.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import type { BookingFormType } from '@/model/model'
import { printsDurationCalcul, userViewsCalcul } from '@/utils/calcFunctions'
import initSpotVideo from '@/utils/initSpotVideo'
import CoinsExplain from '@/components/CoinsExplain.vue'
import CalendarIcon from './icons/IconCalendar.vue'
import DurationIcon from './icons/IconDuration.vue'
import StreamingIcon from './icons/IconStreaming.vue'

const bookingFormData = ref<BookingFormType>({
  coins: 0,
  boxCount: 0,
  spotDuration: 0,
  printsByMinute: 0,
  duration: 0,
  dateRange: [],
  city: '',
  spotVideo: initSpotVideo,
})

const updateBookingFormValues = (newFormData: BookingFormType) => {
  bookingFormData.value = newFormData
}

const printsDurationCalc = computed(() => {
  if (
    !bookingFormData.value.dateRange?.length ||
    !bookingFormData.value.boxCount ||
    !bookingFormData.value.spotDuration ||
    !bookingFormData.value.printsByMinute
  ) {
    return 0
  }

  return printsDurationCalcul(
    bookingFormData.value.spotDuration,
    bookingFormData.value.printsByMinute,
    bookingFormData.value.dateRange?.length,
    bookingFormData.value.boxCount,
  )
})

const userViewsCalc = computed(() => {
  if (!printsDurationCalc.value) return 0

  return userViewsCalcul(
    printsDurationCalc.value,
    bookingFormData.value.dateRange,
  )
})
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-(32px*2))] gap-10">
    <div>
      <h2 class="font-wb">Créer une campagne</h2>
      <div class="flex items-center justify-between mt-7'">
        <booking-form
          :is-offer="false"
          @booking-form-values="updateBookingFormValues"
        />
        <img src="../assets/icons/right-arrow.png" alt="=" class="w-40" />
        <div
          class="flex gap-20 px-10 py-6 border-4 border-grey-1 rounded-lg bg-dark-elevated-1"
        >
          <div class="flex flex-col gap-7">
            <div class="flex items-center relative">
              <img
                src="../assets/icons/cube2.png"
                alt="boxs"
                class="w-12 mr-3"
              />
              <p class="w-max font-montserrat500 text-white-primary text-4xl">
                {{ bookingFormData.boxCount ?? 0 }}
                <span class="text-xl text-white-opacity-30"
                  >box{{ bookingFormData.boxCount > 1 ? 's' : '' }}</span
                >
              </p>
              <InformationCircleIcon
                v-tooltip:top="'Nombre de woozoo box'"
                class="size-4 text-white-opacity-30 absolute top-[7px] right-[-20px]"
              />
            </div>
            <div class="flex items-center relative">
              <DurationIcon class="w-12 h-auto mr-3" />
              <p class="w-max font-montserrat500 text-white-primary text-4xl">
                {{ printsDurationCalc }}
                <span class="text-xl text-white-opacity-30">min</span>
              </p>
              <InformationCircleIcon
                v-tooltip:top="
                  'Temps total de diffusion du spot publicitaire en minutes'
                "
                class="size-4 text-white-opacity-30 absolute top-[7px] right-[-20px]"
              />
            </div>
            <div class="flex items-center relative">
              <img
                src="../assets/icons/users-view.png"
                alt="vues"
                class="w-12 mr-3"
              />
              <p class="w-max font-montserrat500 text-white-primary text-4xl">
                {{ userViewsCalc.toLocaleString() }}
                <span class="text-xl text-white-opacity-30"
                  >vue{{ userViewsCalc > 1 ? 's' : '' }}</span
                >
              </p>
              <InformationCircleIcon
                v-tooltip:top="
                  `Nombre estimé d'utilisateurs touchés durant cette campagne`
                "
                class="size-4 text-white-opacity-30 absolute top-[7px] right-[-20px]"
              />
            </div>
          </div>

          <div class="flex flex-col gap-7 tt">
            <div class="flex items-center relative">
              <CalendarIcon class="w-12 h-auto mr-3" />
              <p class="w-max font-montserrat500 text-white-primary text-4xl">
                {{ bookingFormData.dateRange.length }}
                <span class="text-xl text-white-opacity-30"
                  >jour{{
                    bookingFormData.dateRange?.length! > 1 ? 's' : ''
                  }}</span
                >
              </p>
              <InformationCircleIcon
                v-tooltip:top="'Durée de la campagne publicitaire en jours'"
                class="size-4 text-white-opacity-30 absolute top-[7px] right-[-20px]"
              />
            </div>

            <div class="flex items-center relative">
              <StreamingIcon class="w-12 h-auto mr-3" />
              <p class="w-max font-montserrat500 text-white-primary text-4xl">
                {{ bookingFormData.prints?.toLocaleString() ?? 0 }}
                <span class="text-xl text-white-opacity-30">imp.</span>
              </p>
              <InformationCircleIcon
                v-tooltip:top="
                  `Nombre total d'impressions du spot publicitaire`
                "
                class="size-4 text-white-opacity-30 absolute top-[7px] right-[-20px]"
              />
            </div>
            <div class="flex items-center relative">
              <img
                src="../assets/icons/coins.png"
                alt="coins"
                class="w-12 mr-3"
              />
              <p class="w-max font-montserrat500 text-white-primary text-4xl">
                {{ bookingFormData.coins.toLocaleString() }}
                <span class="text-xl text-white-opacity-30"
                  >crédit{{ bookingFormData.coins! > 1 ? 's' : '' }}</span
                >
              </p>
              <InformationCircleIcon
                v-tooltip:top="'Prix de la campagne en crédits'"
                class="size-4 text-white-opacity-30 absolute top-[7px] right-[-20px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-1 justify-center items-center">
      <CoinsExplain />
    </div>
  </div>
</template>

<style scoped lang="scss">
h2 {
  font-size: clamp(35px, 2vw, 50px);
  color: #fafafa;
  margin-bottom: 40px;
  position: relative;
  line-height: 1;
  /* -webkit-text-stroke: 1px #fff;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px; */
  /*&::first-letter{
    @apply text-green-primary
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
