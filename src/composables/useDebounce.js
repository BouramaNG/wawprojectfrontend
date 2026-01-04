import { ref } from 'vue'

/**
 * Composable pour gérer le debounce d'une fonction
 * @param {Function} fn - La fonction à exécuter après le debounce
 * @param {Number} delay - Délai en millisecondes (défaut: 500ms)
 * @returns {Object} - { debouncedFn, cancel }
 */
export function useDebounce(fn, delay = 500) {
  let timeoutId = null

  const debouncedFn = (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return { debouncedFn, cancel }
}

