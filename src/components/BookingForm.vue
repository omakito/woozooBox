<template>
  <form class="max-w-[620px]" @submit.prevent="handleSubmit">
    <div class="flex justify-between gap-10">
      <div class="flex flex-col gap-7">
        <div>
          <p class="mb-2">Durée du spot publicitaire</p>
          <v-btn-toggle
            v-model="localFormData.spotDuration"
            rounded="7"
            color="primary"
            divided
            mandatory
          >
            <v-btn
              v-for="option in spotDurationOptions"
              v-show="option !== 0"
              :key="option"
              :value="option"
              :readonly="!!props.formData?.spotDuration"
              variant="flat"
              class="!bg-dark-elevated-4"
              >{{ option }}</v-btn
            >
          </v-btn-toggle>
        </div>
        <div>
          <p class="mb-2">Nombre de woozoo box</p>
          <v-select
            v-model="localFormData.boxCount"
            :items="boxCountOptions"
            :readonly="!!props.formData?.boxCount"
            placeholder="Sélectionner le nombre de box"
          ></v-select>
        </div>
        <div>
          <p class="mb-2">Ville</p>
          <v-select
            v-model="localFormData.city"
            :items="cityOptions"
            :readonly="!!props.formData?.city"
            placeholder="Sélectionner la ville"
          ></v-select>
        </div>
      </div>

      <div class="flex flex-col gap-7 min-w-64">
        <div>
          <p class="mb-2">Nombre d'impression/minute</p>
          <v-btn-toggle
            v-model="localFormData.printsByMinute"
            rounded="7"
            color="primary"
            divided
            mandatory
          >
            <v-btn
              v-for="option in printsByMinuteOptions"
              v-show="option !== 0"
              :key="option"
              :value="option"
              :readonly="!!props.formData?.printsByMinute"
              variant="flat"
              class="!bg-dark-elevated-4"
              >{{ option }}</v-btn
            >
          </v-btn-toggle>
        </div>
        <div class="min-w-[384px]">
          <p class="mb-2">Dates de la campagne</p>
          <v-date-input
            v-model="localFormData.dateRange"
            label="Sélectionnez une période"
            multiple="range"
            clearable
            prepend-icon=""
          ></v-date-input>
        </div>
        <div class="min-w-[384px]">
          <p class="mb-2">Spot publicitaire</p>
          <v-file-input
            v-model="localFormData.spotVideo"
            accept="video/*"
            label="Importer la vidéo du spot publicitaire"
            prepend-icon=""
            @change="handleFileChange"
          ></v-file-input>
        </div>
      </div>
    </div>

    <div
      v-if="isFormSend && formErrors"
      class="flex items-center gap-2 bg-dark-elevated-3 border-warning border-1 mt-6 mb-6 p-3 rounded-md"
    >
      <ExclamationCircleIcon class="size-6 text-amber-500" />
      <p class="text-white-primary">
        {{ formErrors }}
      </p>
    </div>

    <div
      class="flex items-end mt-8"
      :class="[props.isOffer ? 'justify-between' : 'justify-end']"
    >
      <div
        v-if="props.isOffer"
        class="flex items-center gap-3 border-white-opacity-20 border-2 py-2.5 px-4 rounded-lg"
      >
        <p class="flex items-center font-montserrat500 text-2xl">
          {{ printsCalc.toLocaleString() }}
          <StreamingIcon class="size-11 text-green-primary ml-2" />
        </p>
        <span class="w-[2px] h-6 bg-white-opacity-20"></span>
        <p class="flex items-center font-montserrat500 text-2xl">
          {{ coinsCalc.toLocaleString() }}
          <img src="../assets/icons/coin-w.svg" alt="=" class="w-9 ml-1" />
        </p>
      </div>
      <div class="flex gap-2">
        <v-btn
          v-if="props.isOffer"
          variant="flat"
          class="text-capitalize"
          @click="handleCancel"
          >Annuler</v-btn
        >
        <v-btn
          variant="flat"
          color="primary"
          class="text-capitalize"
          type="submit"
          :disabled="isFormSend && !!formErrors"
          >Valider</v-btn
        >
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import moment from '@/utils/moment'
import { createCampaign, debitCoins } from '@/firebase/functions'
import {
  closeLoadingToast,
  openDialogChoice,
  openLoadingToast,
  openToast,
} from '@/utils/sweetAlert'
import {
  coinsCalcul,
  printsCalcul,
  isUserEnoughCoins,
} from '@/utils/calcFunctions'
import StreamingIcon from './icons/IconStreaming.vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import type { BookingFormType, CampaignType } from '@/model/model'
import type { AuthStore } from '@/model/auth'
import { useAuthStore } from '@/stores/auth'
import initSpotVideo from '@/utils/initSpotVideo'
import { useRouter } from 'vue-router'

const props = defineProps<{
  formData?: BookingFormType
  isOffer: boolean
}>()
const emit = defineEmits(['cancel', 'booking-form-values'])

const router = useRouter()
const authStore: AuthStore = useAuthStore()

const bookingFormDefaultValue: BookingFormType = {
  boxCount: 0,
  duration: 0,
  spotDuration: 0,
  printsByMinute: 0,
  coins: 0,
  dateRange: [],
  city: '',
  spotVideo: initSpotVideo,
}

const localFormData = reactive<BookingFormType>({
  ...(props.formData ?? bookingFormDefaultValue),
})

const uploadVideoDuration = ref<number>(0)

const isFormSend = ref<boolean>(false)

const boxCountOptions = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
const spotDurationOptions = ref([0, 10, 20, 30])
const cityOptions = ref(['Marseille', 'Paris'])
const printsByMinuteOptions = computed(() => {
  switch (localFormData.spotDuration) {
    case 10:
      return [0, 1, 2, 3, 4, 5, 6]
    case 20:
      return [0, 1, 2, 3]
    case 30:
      return [0, 1, 2]
    default:
      return [0, 1, 2, 3, 4, 5, 6]
  }
})

const printsCalc = computed(() => {
  const dateRange = props.isOffer
    ? props.formData?.duration
    : localFormData.dateRange?.length

  if (!localFormData.printsByMinute || !dateRange || !localFormData.boxCount)
    return 0

  return printsCalcul(
    localFormData.printsByMinute,
    dateRange,
    localFormData.boxCount,
  )
})

const coinsCalc = computed(() => {
  if (props.isOffer && props.formData) {
    return props.formData.coins
  }

  if (
    !localFormData.spotDuration ||
    !localFormData.printsByMinute ||
    !localFormData.dateRange?.length ||
    !localFormData.boxCount
  ) {
    return 0
  }

  const coins = coinsCalcul(
    localFormData.spotDuration,
    localFormData.printsByMinute,
    localFormData.dateRange.length,
    localFormData.boxCount,
  )

  return coins
})

const formErrors = computed(() => {
  if (!localFormData.spotDuration) {
    return 'Veuillez sélectionner la durée de votre spot publicitaire'
  }
  if (!localFormData.printsByMinute) {
    return "Veuillez sélectionner le nombre d'impressions souhaité par minute"
  }
  if (!localFormData.boxCount) {
    return 'Veuillez sélectionner le nombre de woozoo box'
  }
  if (!localFormData.dateRange) {
    return 'Veuillez sélectionner les dates de votre campagne'
  }
  if (!localFormData.city) {
    return 'Veuillez sélectionner la ville de votre campagne'
  }
  if (localFormData.spotVideo.lastModified === 0) {
    return 'Veuillez uploader un spot publicitaire pour votre campagne'
  }
  if (uploadVideoDuration.value > localFormData.spotDuration) {
    if (props.isOffer) {
      return `La durée de la vidéo sélectionnée est supérieur à ${localFormData.spotDuration} secondes. Veuillez uploader un spot d'une durée inférieure`
    }
    return `La durée de la vidéo sélectionnée est supérieur à ${localFormData.spotDuration} secondes. Veuillez sélectionner une durée supérieur pour votre spot publicitaire`
  }
  if (
    props.isOffer &&
    localFormData.dateRange &&
    localFormData.dateRange?.length > props.formData?.duration!
  ) {
    return `Pour profiter de cette offre, votre campagne ne doit pas dépasser ${props.formData?.duration} jours.`
  }

  return null
})

const handleFileChange = () => {
  const file: File = localFormData.spotVideo
  if (file) {
    getVideoDuration(file)
  }
}

const getVideoDuration = async (file: File) => {
  const reader = new FileReader()

  reader.onload = event => {
    const videoElement = document.createElement('video')
    videoElement.src = event.target?.result

    videoElement.onloadedmetadata = () => {
      uploadVideoDuration.value = videoElement.duration
    }
  }

  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  isFormSend.value = true

  if (formErrors.value) return

  const isEnoughCoins = isUserEnoughCoins(
    props.isOffer && props.formData ? props.formData.coins : coinsCalc.value,
  )

  if (!isEnoughCoins) {
    openToast({
      icon: 'error',
      title:
        'Votre solde de crédits est insuffisant. Veuillez recréditer votre compte pour valider cette campagne.',
      timer: 7000,
    })
    return
  }

  const campaignData: CampaignType = {
    boxCount:
      props.isOffer && props.formData
        ? props.formData.boxCount
        : localFormData.boxCount,
    duration:
      props.isOffer && props.formData
        ? props.formData.duration
        : localFormData.dateRange?.length,
    datesRange: localFormData.dateRange,
    spotDuration:
      props.isOffer && props.formData
        ? props.formData.spotDuration
        : localFormData.spotDuration,
    printsByMinute:
      props.isOffer && props.formData
        ? props.formData.printsByMinute
        : localFormData.printsByMinute,
    startDate: localFormData.dateRange![0],
    endDate: localFormData.dateRange![localFormData.dateRange!.length - 1],
    coins:
      props.isOffer && props.formData ? props.formData.coins : coinsCalc.value,
    city: localFormData.city,
    spotVideo: localFormData.spotVideo,
    codeCompany: authStore.userData!.code,
    isOffer: props.isOffer,
    offerId: props.formData?.id ?? null,
  }

  handleCancel()

  const result = await openDialogChoice({
    title: 'Confirmation campagne',
    text: `Confirmez-vous reserver ${campaignData.boxCount} woozoo box du ${moment(campaignData.startDate).format('DD-MM-YYYY')} au ${moment(campaignData.endDate).format('DD-MM-YYYY')}, pour ${campaignData.coins?.toLocaleString()} crédits ?`,
    confirmButtonText: 'Valider',
    cancelButtonText: 'Annuler',
  })

  if (result.isConfirmed) {
    saveCampaign(campaignData)
  }
}

const saveCampaign = async (campaignData: CampaignType) => {
  openLoadingToast({
    title: 'Resérvation en cours',
  })
  try {
    await createCampaign('campaign', campaignData)
    await debitCoins(campaignData.coins)
    closeLoadingToast({ icon: 'success', title: 'Campagne reservée' })
    router.push('/dashboard')
  } catch {
    closeLoadingToast({
      icon: 'error',
      title: "Une erreur c'est produite, merci de réessayer",
    })
  }
}

const handleCancel = () => {
  emit('cancel')
}

const emitBookingFormValues = () => {
  emit('booking-form-values', {
    coins: coinsCalc.value,
    boxCount: localFormData.boxCount,
    spotDuration: localFormData.spotDuration,
    printsByMinute: localFormData.printsByMinute,
    dateRange: localFormData.dateRange,
    prints: printsCalc,
  })
}

watch(
  () => localFormData.spotDuration,
  (newVal, oldVal) => {
    if (localFormData.printsByMinute) {
      if (
        (newVal === 20 && localFormData.printsByMinute > 3) ||
        (newVal === 30 && localFormData.printsByMinute > 2)
      ) {
        localFormData.printsByMinute = 0
      }
    }
  },
  { immediate: true },
)

watch(localFormData, emitBookingFormValues, { deep: true })
</script>

<style lang="scss" scoped>
.v-input {
  :deep(.v-input__details) {
    display: none;
  }
}
.v-btn-group {
  :deep(.v-btn__overlay) {
    display: none;
  }
}
</style>
