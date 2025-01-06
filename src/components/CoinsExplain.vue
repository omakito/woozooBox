<template>
  <div
    v-show="isVisible"
    class="cont w-max px-7 pt-5 pb-3 bg-dark-elevated-2 rounded-lg"
  >
    <div
      class="flex justify-center items-center gap-5 text-white-primary mb-2 text-4xl"
    >
      <p><span class="font-montserrat500 text-5xl">10</span> impressions</p>
      <span>=</span>
      <div class="flex items-center gap-1">
        <span class="font-montserrat500 text-5xl">1</span>
        <img src="../assets/icons/coin-w.svg" alt="=" class="w-12" />
      </div>
    </div>

    <span class="text-xs"
      >* Sur la base de spot publicitaire d'une durée de dix secondes, dix
      impressions équivalent à un crédit.</span
    >
    <XCircleIcon
      class="cursor-pointer size-7 absolute top-[-15px] right-[-15px]"
      @click="close"
    />
  </div>
</template>

<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'

const getInitialVisibility = (): boolean => {
  const storedVisibility = localStorage.getItem('coinExplainIsVisible')
  return storedVisibility ? JSON.parse(storedVisibility) : true
}

const isVisible = ref<boolean>(getInitialVisibility())

const close = () => {
  isVisible.value = false
}

watch(isVisible, newValue => {
  localStorage.setItem('coinExplainIsVisible', JSON.stringify(newValue))
})
</script>

<style scoped lang="scss">
.cont {
  @apply border-green-primary;
  position: relative;
  border-width: 3px;
  border-style: solid;
  z-index: 1;
  &::before {
    @apply bg-dark-elevated-2;
    content: '';
    position: absolute;
    inset: -5px -5px 40px 17%;
    border-top-right-radius: 7px;
    z-index: -1;
  }
  &::after {
    @apply bg-dark-elevated-2;
    content: '';
    position: absolute;
    inset: 40px 17% -5px -5px;
    border-bottom-left-radius: 7px;
    z-index: -1;
  }
}
</style>
