<template>
  <LoadingScreen v-if="showLoader" @done="showLoader = false" />
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/shared/ToastContainer.vue'
import LoadingScreen from '@/components/shared/LoadingScreen.vue'
import { useDarkMode } from '@/composables/useDarkMode'

const { init } = useDarkMode()
init()

const showLoader = ref(true)
</script>
