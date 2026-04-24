<template>
  <div :class="['flex flex-col gap-1', full ? 'w-full' : '']">
    <label v-if="label" :for="id" class="text-sm font-medium text-surface-700 dark:text-surface-300">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative">
      <span v-if="$slots.icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
        <slot name="icon" />
      </span>
      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        :id="id"
        :type="type !== 'textarea' ? type : undefined"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :rows="rows"
        :class="inputClasses"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />
      <span v-if="$slots.suffix" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
        <slot name="suffix" />
      </span>
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-0.5">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-surface-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id:           { type: String, required: true },
  modelValue:   { type: [String, Number], default: '' },
  label:        { type: String, default: '' },
  type:         { type: String, default: 'text' },
  placeholder:  { type: String, default: '' },
  error:        { type: String, default: '' },
  hint:         { type: String, default: '' },
  disabled:     { type: Boolean, default: false },
  required:     { type: Boolean, default: false },
  full:         { type: Boolean, default: true },
  rows:         { type: Number, default: 4 },
})
defineEmits(['update:modelValue', 'blur'])

const inputClasses = computed(() => [
  'w-full rounded-xl border bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100',
  'placeholder-surface-400 text-sm transition-all duration-200',
  'focus:outline-none focus:ring-2',
  props.$slots?.icon ? 'pl-10' : 'pl-4',
  'pr-4 py-2.5',
  props.error
    ? 'border-red-400 focus:ring-red-400/40'
    : 'border-surface-300 dark:border-surface-600 focus:ring-brand-500/40 focus:border-brand-500',
  props.disabled ? 'opacity-60 cursor-not-allowed' : '',
  props.type === 'textarea' ? 'resize-none' : '',
])
</script>
