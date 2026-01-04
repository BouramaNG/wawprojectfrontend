<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Templates</h1>
        <p class="text-gray-600 mt-1">Gestion des templates de packages</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="showFilters = !showFilters"
          class="btn-secondary"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtres
        </button>
        <router-link
          to="/templates/create"
          class="btn-primary"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau Template
        </router-link>
      </div>
    </div>

    <!-- Filtres -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showFilters" class="card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <input
              v-model="store.filters.search"
              type="text"
              placeholder="Nom du template..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="debouncedSearch"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              v-model="store.filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @change="store.fetchList()"
            >
              <option value="">Tous</option>
              <option value="Active">Actif</option>
              <option value="Inactive">Inactif</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pays</label>
            <input
              v-model="store.filters.country_code"
              type="text"
              placeholder="Code pays (ex: FRA)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="debouncedSearch"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Table -->
    <div class="card">
      <div v-if="store.loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <DataTable
        v-else
        :columns="columns"
        :data="store.items"
        :pagination="store.pagination"
        @page-change="handlePageChange"
      >
        <template #cell-status="{ value }">
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="{
              'bg-green-100 text-green-800': value === 'Active',
              'bg-gray-100 text-gray-800': value !== 'Active'
            }"
          >
            {{ value }}
          </span>
        </template>

        <template #cell-data_mb="{ value }">
          {{ formatData(value) }}
        </template>

        <template #actions="{ item }">
          <router-link
            :to="`/templates/${item.id}`"
            class="text-primary-600 hover:text-primary-900 mr-3"
          >
            Voir
          </router-link>
          <button
            @click="handleToggleStatus(item)"
            class="text-yellow-600 hover:text-yellow-900"
          >
            {{ item.status === 'Active' ? 'Désactiver' : 'Activer' }}
          </button>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTemplatesStore } from '@/stores/templates'
import { templates } from '@/services/api'
import DataTable from '@/components/common/DataTable.vue'
import { useDebounce } from '@/composables/useDebounce'

const store = useTemplatesStore()
const showFilters = ref(false)

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Nom', sortable: true },
  { key: 'country_code', label: 'Pays', sortable: true },
  { key: 'data_mb', label: 'Données', sortable: true },
  { key: 'duration_days', label: 'Durée (jours)', sortable: true },
  { key: 'status', label: 'Statut', sortable: true },
]

const { debouncedFn: debouncedSearch } = useDebounce(() => {
  store.fetchList()
}, 500)

const handlePageChange = (page) => {
  store.pagination.current_page = page
  store.fetchList()
}

const handleToggleStatus = async (item) => {
  try {
    await templates.toggleStatus(item.id)
    await store.fetchList()
  } catch (error) {
    console.error('Erreur changement statut:', error)
  }
}

const formatData = (mb) => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`
  }
  return `${mb} MB`
}

onMounted(() => {
  store.fetchList()
})
</script>
