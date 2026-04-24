<template>
  <div :class="['animate-pulse rounded-xl bg-surface-200 dark:bg-surface-700', heightClass, widthClass, props.class]" />
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  height: { type: String, default: 'h-4' },
  width:  { type: String, default: 'w-full' },
  class:  { type: String, default: '' },
})
const heightClass = computed(() => props.height)
const widthClass  = computed(() => props.width)
</script>
