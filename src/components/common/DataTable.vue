<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            @click="column.sortable && sort(column.key)"
            class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            :class="{ 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors': column.sortable }"
          >
            <div class="flex items-center space-x-2">
              <span>{{ column.label }}</span>
              <span v-if="column.sortable && sortKey === column.key" class="text-primary-600 dark:text-primary-400">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
          <th v-if="actions" class="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="(item, index) in sortedData"
          :key="index"
          class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
          >
            <slot :name="`cell-${column.key}`" :item="item" :value="getValue(item, column.key)">
              {{ getValue(item, column.key) }}
            </slot>
          </td>
          <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :item="item">
              <button
                v-for="action in (Array.isArray(actions) ? actions : [])"
                :key="action.key"
                @click="action.handler(item)"
                class="mr-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
              >
                {{ action.label }}
              </button>
            </slot>
          </td>
        </tr>
        <tr v-if="sortedData.length === 0">
          <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              <svg class="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="text-gray-500 dark:text-gray-400 font-medium">Aucune donnée disponible</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total > pagination.per_page" class="mt-6 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Affichage de <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span> à
        <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span>
        sur <span class="font-medium">{{ pagination.total }}</span> résultats
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('page-change', pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Précédent
        </button>
        <span class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {{ pagination.current_page }} / {{ pagination.last_page }}
        </span>
        <button
          @click="$emit('page-change', pagination.current_page + 1)"
          :disabled="pagination.current_page >= pagination.last_page"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Suivant
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  actions: {
    type: [Array, Boolean],
    default: null,
  },
  pagination: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['page-change'])

const sortKey = ref(null)
const sortOrder = ref('asc')

const getValue = (item, key) => {
  return key.split('.').reduce((obj, k) => obj?.[k], item) ?? '-'
}

const sortedData = computed(() => {
  if (!sortKey.value) return props.data

  return [...props.data].sort((a, b) => {
    const aVal = getValue(a, sortKey.value)
    const bVal = getValue(b, sortKey.value)

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const sort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}
</script>

