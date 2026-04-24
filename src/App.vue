<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/shared/ToastContainer.vue'
import { useDarkMode } from '@/composables/useDarkMode'

const { init } = useDarkMode()
init()
</script>
