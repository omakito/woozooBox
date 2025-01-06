<template>
  <div class="w-max bg-dark-elevated-2 flex flex-col gap-7 p-5 rounded-lg">
    <div class="flex justify-between items-start gap-14">
      <p class="text-white-opacity-70 text-lg font-wb">Campagnes</p>
      <v-chip-group
        v-model="campaignsStatus"
        :selected-class="
          campaignsStatus === 'completed'
            ? 'text-primary'
            : campaignsStatus === 'in_progress'
              ? 'text-tertiary'
              : 'text-secondary'
        "
        mandatory
      >
        <v-chip
          v-for="tag in campaignsStatusOptions"
          :key="tag.type"
          :text="tag.display"
          :value="tag.type"
          variant="tonal"
        ></v-chip>
      </v-chip-group>
    </div>

    <div class="min-h-[200px] flex items-center justify-center">
      <v-progress-circular
        v-if="state.isLoading"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <p v-else-if="!campaigns?.length">
        Aucune campagne {{ getDisplayFromType(campaignsStatus) }}
      </p>
      <div v-else class="flex flex-col flex-1 gap-7">
        <div
          v-for="campaign in campaigns"
          :key="campaign.id"
          class="flex items-center gap-5"
        >
          <v-icon
            v-tooltip="'apercu du spot publicitaire'"
            icon="mdi-movie-open-play"
            size="x-large"
            class="spot-icon"
            @click="playSpotVideo(campaign.spotVideo)"
          ></v-icon>
          <div class="flex-1">
            <div class="flex justify-around items-center">
              <div class="flex items-center">
                <img
                  src="../../assets/icons/cube2.png"
                  alt="boxs"
                  class="w-6 mr-1"
                />
                <p>{{ campaign.boxCount }}</p>
              </div>
              <div class="flex items-center">
                <PinIcon class="w-6 h-auto mr-1" />
                <p>{{ campaign.city }}</p>
              </div>
              <div class="flex items-center">
                <CalendarIcon class="w-6 h-auto mr-1" />
                <p>{{ campaign.startDate }} au {{ campaign.endDate }}</p>
              </div>
            </div>
            <v-progress-linear
              :model-value="campaign.progress"
              bg-color="#eee"
              :color="campaign.color"
              class="mt-2"
              rounded
            ></v-progress-linear>
          </div>
        </div>
      </div>
    </div>

    <v-btn variant="text" color="primary" class="text-capitalize">
      <RouterLink to="/campaign" class="flex items-center">
        Consulter toutes les campagnes
        <ArrowRightCircleIcon class="size-5 ml-1" /> </RouterLink
    ></v-btn>

    <SpotVideoModal
      v-model:show-modal="state.showSpotVideoModal"
      :video-url="state.spotVideoSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import SpotVideoModal from '../SpotVideoModal.vue'
import { getRecentAndUpcomingCampaigns } from '@/firebase/functions'
import type { CampaignType } from '@/model/model'
import moment from '@/utils/moment'
import PinIcon from '../icons/IconPin.vue'
import CalendarIcon from '../icons/IconCalendar.vue'
import ArrowRightCircleIcon from '@/components/icons/IconArrowRightCircle.vue'
import type { Timestamp } from 'firebase/firestore'

const campaignsStatus = ref<'completed' | 'in_progress' | 'next'>('in_progress')
const campaignsStatusOptions = [
  {
    type: 'completed',
    display: 'Terminée',
  },
  {
    type: 'in_progress',
    display: 'En cours',
  },
  {
    type: 'next',
    display: 'A venir',
  },
]

type allCampaignsType = {
  pastCampaigns: CampaignType[]
  currentCampaigns: CampaignType[]
  upcomingCampaigns: CampaignType[]
}

const state = reactive({
  isLoading: false,
  allCampaigns: {} as allCampaignsType,
  showSpotVideoModal: false,
  spotVideoSelected: '',
})

const campaignsSelected = computed(() => {
  if (campaignsStatus.value === 'completed') {
    return state.allCampaigns.pastCampaigns
  }
  if (campaignsStatus.value === 'in_progress') {
    return state.allCampaigns.currentCampaigns
  }
  return state.allCampaigns.upcomingCampaigns
})

const campaigns = computed(() => {
  return campaignsSelected.value?.map(campaign => {
    const progress = calculateProgress(campaign.startDate, campaign.endDate)
    const color = getProgressColor(progress)
    return {
      id: campaign.id,
      spotVideo: campaign.spotVideo,
      startDate: moment(campaign.startDate.seconds * 1000).format('DD'),
      endDate: moment(campaign.endDate.seconds * 1000).format('DD MMM'),
      boxCount: campaign.boxCount,
      city: campaign.city,
      progress,
      color,
    }
  })
})

const fetchCampaigns = async () => {
  state.isLoading = true
  state.allCampaigns = await getRecentAndUpcomingCampaigns()
  state.isLoading = false
}

const calculateProgress = (startDate: Timestamp, endDate: Timestamp) => {
  const now = new Date()
  const start = startDate.toDate()
  const end = endDate.toDate()
  const totalDuration = end.getTime() - start.getTime()
  const elapsedTime = now.getTime() - start.getTime()

  return totalDuration > 0
    ? Math.min(Math.max((elapsedTime / totalDuration) * 100, 0), 100)
    : 0
}

const getProgressColor = (progress: number) => {
  if (progress <= 25) {
    return '#fd7b39'
  } else if (progress <= 50) {
    return '#fec118'
  } else if (progress <= 75) {
    return '#1feaea'
  } else {
    return '#61d78e'
  }
}

const getDisplayFromType = (type: string) => {
  const status = campaignsStatusOptions.find(option => option.type === type)
  return status?.display
}

const playSpotVideo = (spotVideoUrl: string) => {
  state.showSpotVideoModal = true
  state.spotVideoSelected = spotVideoUrl
}

onMounted(() => {
  fetchCampaigns()
})
</script>

<style lang="scss" scoped>
.v-chip-group {
  margin: auto;
  padding: 0;
  :deep(.v-slide-group__content) {
    gap: 10px;
    .v-chip {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}
.spot-icon {
  opacity: 0.7;
  @apply duration-500;
  &:hover {
    opacity: 1;
  }
}
</style>
