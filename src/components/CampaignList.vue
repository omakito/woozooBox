<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import SpotVideoModal from './SpotVideoModal.vue'
import moment from '@/utils/moment'
import { creditCoins, deleteData, getCampaigns } from '@/firebase/functions'
import type { Timestamp } from 'firebase/firestore'
import { openDialogChoice, openToast } from '@/utils/sweetAlert'

type ListItem = {
  id: string
  spotVideo: string
  spotDuration: number
  printsByMinute: number
  boxCount: number
  startDate: Timestamp
  endDate: Timestamp
  city: string
  statusText: string
  statusColor: string
  coins: number
  isDeletable: boolean
}

const isLoading = ref<boolean>()

const state = reactive({
  headers: [
    { title: 'Spot publi.', align: 'start', key: 'spotVideo' },
    { title: 'Durée du spot', align: 'start', key: 'spotDuration' },
    {
      title: 'Impression par minute',
      align: 'start',
      key: 'printsByMinute',
    },
    {
      title: 'Nombre de box',
      align: 'start',
      key: 'boxCount',
    },
    {
      title: 'Date de début',
      align: 'start',
      key: 'startDate',
    },
    {
      title: 'Date de fin',
      align: 'start',
      key: 'endDate',
    },
    {
      title: 'Ville',
      align: 'start',
      key: 'city',
    },
    {
      title: 'Statut',
      align: 'start',
      key: 'status',
    },
    {
      title: '',
      align: 'end',
      key: 'actions',
    },
  ],
  selected: [],
  items: [] as ListItem[],
  showSpotVideoModal: false,
  spotVideoSelected: '',
})

const getStatus = (
  startDate: any,
  endDate: any,
): { text: string; color: string; isDeletable: boolean } => {
  const now = moment()
  const start = moment.unix(startDate.seconds)
  const end = moment.unix(endDate.seconds)

  if (now.isBefore(start)) {
    return { text: 'À venir', color: 'blue', isDeletable: true }
  } else if (now.isAfter(end)) {
    return { text: 'Terminée', color: 'primary', isDeletable: false }
  } else {
    return { text: 'En cours', color: 'orange', isDeletable: false }
  }
}

const playSpotVideo = (spotVideoUrl: string) => {
  state.showSpotVideoModal = true
  state.spotVideoSelected = spotVideoUrl
}

const deleteCampaign = async (campaign: ListItem) => {
  const { isConfirmed } = await openDialogChoice({
    title: 'Supprimer la campagne',
    text: 'Etes-vous sûr de vouloir supprimer cette campagne ? Cette action est irréversible et supprimera définitivement toutes les données associées à cette campagne.',
    icon: 'warning',
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
  })

  if (isConfirmed) {
    try {
      await deleteData('campaign', campaign.id)
      await creditCoins(campaign.coins)
      fetchCampaigns()
      openToast({
        title: 'Campagne suprimée',
        icon: 'success',
      })
    } catch {
      openToast({
        title: 'Un problème est survenue, merci de réessayer',
        icon: 'error',
      })
    }
  }
}

const fetchCampaigns = async () => {
  isLoading.value = true

  const campaignList = await getCampaigns()

  state.items = campaignList
    .map(campaign => {
      const status = getStatus(campaign.startDate, campaign.endDate)
      return {
        ...campaign,
        statusText: status.text,
        statusColor: status.color,
        isDeletable: status.isDeletable,
      }
    })
    .sort((a, b) => b.startDate.seconds - a.startDate.seconds)

  isLoading.value = false
}

onMounted(async () => {
  fetchCampaigns()
})
</script>

<template>
  <h2 class="font-wb">Mes campagnes</h2>
  <v-data-table
    v-model="state.selected"
    :headers="state.headers"
    :items="state.items"
    :loading="isLoading"
    items-per-page="10"
    show-select
  >
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:item.spotVideo="{ item }">
      <v-icon
        v-tooltip="'apercu du spot publicitaire'"
        icon="mdi-movie-open-play"
        size="x-large"
        class="list-icon"
        @click="playSpotVideo(item.spotVideo)"
      ></v-icon>
    </template>
    <template v-slot:item.startDate="{ item }">
      <p>{{ moment(item.startDate.seconds * 1000).format('DD-MM-YYYY') }}</p>
    </template>
    <template v-slot:item.endDate="{ item }">
      <p>{{ moment(item.endDate.seconds * 1000).format('DD-MM-YYYY') }}</p>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip variant="tonal" :color="item.statusColor">{{
        item.statusText
      }}</v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        v-if="item.isDeletable"
        v-tooltip="'modifier'"
        icon="mdi-pencil"
        class="list-icon update-icon"
      ></v-icon>
      <v-icon
        v-if="item.isDeletable"
        v-tooltip="'supprimer'"
        icon="mdi-delete-forever"
        class="list-icon delete-icon"
        @click="deleteCampaign(item)"
      ></v-icon>
    </template>

    <template v-slot:no-data>
      <span>Aucune campagne</span>
    </template>
  </v-data-table>

  <SpotVideoModal
    v-model:show-modal="state.showSpotVideoModal"
    :video-url="state.spotVideoSelected"
  />
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
.list-icon {
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 1;
    @apply ease-in-out;
    @apply duration-500;
  }
  &.update-icon {
    color: #2196f3;
    margin-right: 10px;
  }
  &.delete-icon {
    @apply text-red-500;
  }
}
</style>
