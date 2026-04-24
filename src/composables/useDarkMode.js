import { ref, watchEffect } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  function init() {
    const stored = localStorage.getItem('hz-dark-mode')
    isDark.value = stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
    applyClass()
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('hz-dark-mode', isDark.value)
    applyClass()
  }

  function applyClass() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, toggle, init }
}
