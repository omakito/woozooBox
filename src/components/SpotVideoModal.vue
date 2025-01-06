<template>
  <v-dialog v-model="show" max-width="700">
    <v-card>
      <video ref="videoPlayer" controls muted :src="videoUrl" />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  videoUrl: string
}>()
const show = defineModel<boolean>('showModal')

const closeModal = () => {
  show.value = false
}
</script>
