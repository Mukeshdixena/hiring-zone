import { ref, watchEffect } from 'vue'

// Global state to share across components
const isDark = ref(localStorage.getItem('hz-dark-mode') === 'true')

export function useDarkMode() {
  // Sync state with DOM and localStorage automatically
  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('hz-dark-mode', isDark.value)
  })

  function toggle() {
    isDark.value = !isDark.value
  }

  // init is now technically optional but kept for compatibility
  function init() {
    // watchEffect already handles the initial application
  }

  return { isDark, toggle, init }
}
