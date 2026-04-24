<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite">
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="['pointer-events-auto flex items-start gap-3 min-w-72 max-w-sm rounded-2xl px-4 py-3 shadow-2xl border text-sm font-medium', variantClasses[toast.type]]"
        >
          <span class="text-lg flex-shrink-0">{{ icons[toast.type] }}</span>
          <span class="flex-1 leading-relaxed">{{ toast.message }}</span>
          <button @click="toastStore.remove(toast.id)" class="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
const toastStore = useToastStore()

const variantClasses = {
  success: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
  error:   'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
  warning: 'bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200',
  info:    'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
}
const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
</script>

<style scoped>
.toast-enter-active { animation: toastIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275); }
.toast-leave-active { animation: toastOut 0.25s ease forwards; }
@keyframes toastIn  { from { opacity:0; transform: translateX(100%) scale(0.8); } to { opacity:1; transform: translateX(0) scale(1); } }
@keyframes toastOut { from { opacity:1; transform: translateX(0) scale(1); } to { opacity:0; transform: translateX(100%) scale(0.8); } }
</style>
