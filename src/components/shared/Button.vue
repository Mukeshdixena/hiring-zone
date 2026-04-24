<template>
  <button
    :id="id"
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
    v-bind="$attrs"
  >
    <span v-if="loading" class="inline-flex items-center gap-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      <slot>Loading…</slot>
    </span>
    <slot v-else />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id:       { type: String, default: '' },
  type:     { type: String, default: 'button' },
  variant:  { type: String, default: 'primary' },
  size:     { type: String, default: 'md' },
  accent:   { type: String, default: 'blue' }, // blue | green | purple
  disabled: { type: Boolean, default: false },
  loading:  { type: Boolean, default: false },
  outline:  { type: Boolean, default: false },
  full:     { type: Boolean, default: false },
})

const sizeMap = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
}

const accentSolid = {
  blue:   'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30',
  green:  'bg-emp-600 hover:bg-emp-700 text-white shadow-emp-600/30',
  purple: 'bg-adm-600 hover:bg-adm-700 text-white shadow-adm-600/30',
}
const accentOutline = {
  blue:   'border-2 border-brand-500 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20',
  green:  'border-2 border-emp-500 text-emp-600 hover:bg-emp-50 dark:hover:bg-emp-900/20',
  purple: 'border-2 border-adm-500 text-adm-600 hover:bg-adm-50 dark:hover:bg-adm-900/20',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg',
  sizeMap[props.size] || sizeMap.md,
  props.outline ? accentOutline[props.accent] : accentSolid[props.accent],
  props.full ? 'w-full' : '',
  (props.disabled || props.loading) ? 'opacity-60 cursor-not-allowed' : 'active:scale-95',
])
</script>
