<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-green-400">
          Gestion des Prix
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 text-lg">Configurez et gérez les prix des packages eSIM</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouveau Prix
      </button>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-blue-100 text-sm font-medium">Total Prix</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.total || 0 }}</p>
          <p class="text-xs text-blue-100 mt-1">Tous les prix</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-100 text-sm font-medium">Prix Actifs</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.active || 0 }}</p>
          <p class="text-xs text-green-100 mt-1">En cours d'utilisation</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-purple-100 text-sm font-medium">Pays Couverts</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.countries || 0 }}</p>
          <p class="text-xs text-purple-100 mt-1">Pays différents</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-orange-100 text-sm font-medium">Prix Moyen</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ formatPrice(stats.averagePrice) }}</p>
          <p class="text-xs text-orange-100 mt-1">FCFA</p>
        </div>
      </div>
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
      <div class="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div class="flex-1 w-full sm:w-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par pays, données, prix..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
              @input="debouncedSearch"
            />
            <svg
              class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <select
            v-model="statusFilter"
            @change="loadPrices(1)"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>

      <DataTable
        v-else
        :columns="columns"
        :data="prices"
        :pagination="pagination"
        :actions="true"
        @page-change="handlePageChange"
      >
        <template #cell-country_code="{ item }">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              {{ (item.country_code || 'XX').substring(0, 2).toUpperCase() }}
            </span>
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.country_code || '-' }}</span>
          </div>
        </template>

        <template #cell-data_mb="{ item }">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ formatData(item.data_mb) }}</span>
          </div>
        </template>

        <template #cell-price="{ item }">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ formatPrice(item.price) }} FCFA</span>
          </div>
        </template>

        <template #cell-is_active="{ item }">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
            :class="getStatusClass(item.is_active)"
          >
            <span :class="getStatusIconClass(item.is_active)" class="w-2 h-2 rounded-full mr-2"></span>
            {{ item.is_active ? 'Actif' : 'Inactif' }}
          </span>
        </template>

        <template #actions="{ item }">
          <div class="flex items-center space-x-2">
            <button
              @click="editPrice(item)"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Modifier le prix"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
            <button
              @click="handleToggleStatus(item)"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              :class="item.is_active ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'"
              :title="item.is_active ? 'Désactiver' : 'Activer'"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="item.is_active" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ item.is_active ? 'Désactiver' : 'Activer' }}
            </button>
            <button
              @click="handleDelete(item)"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Supprimer le prix"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Modal Création/Modification -->
    <Modal
      v-model="showCreateModal"
      :title="editingPrice ? 'Modifier le prix' : 'Créer un nouveau prix'"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code pays (ISO Alpha-2) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="priceForm.country_code"
              type="text"
              required
              maxlength="2"
              placeholder="FR, US, GB..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Code ISO à 2 lettres (ex: FR pour France)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Données (MB) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="priceForm.data_mb"
              type="number"
              required
              min="1"
              placeholder="100, 500, 1024..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Quantité de données en mégaoctets</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prix (FCFA) <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="priceForm.price"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="5000, 10000..."
                class="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
              />
              <span class="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400 font-medium">FCFA</span>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Prix en francs CFA</p>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex items-center justify-end space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="saving"
            class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span v-if="saving" class="inline-block animate-spin mr-2">⏳</span>
            {{ editingPrice ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { prices as pricesApi } from '@/services/api'
import DataTable from '@/components/common/DataTable.vue'
import Modal from '@/components/common/Modal.vue'
import { useDebounce } from '@/composables/useDebounce'
import { useToast } from '@/composables/useToast'

const loading = ref(false)
const prices = ref([])
const pagination = ref(null)
const showCreateModal = ref(false)
const editingPrice = ref(null)
const saving = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')

const { success, error: showError } = useToast()

const stats = computed(() => {
  const total = prices.value.length
  const active = prices.value.filter(p => p.is_active).length
  const countries = new Set(prices.value.map(p => p.country_code)).size
  const activePrices = prices.value.filter(p => p.is_active).map(p => p.price)
  const averagePrice = activePrices.length > 0 
    ? activePrices.reduce((a, b) => a + b, 0) / activePrices.length 
    : 0

  return {
    total,
    active,
    countries,
    averagePrice,
  }
})

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'country_code', label: 'Pays', sortable: true },
  { key: 'data_mb', label: 'Données', sortable: true },
  { key: 'price', label: 'Prix', sortable: true },
  { key: 'is_active', label: 'Statut', sortable: true },
]

const priceForm = ref({
  country_code: '',
  data_mb: 0,
  price: 0,
})

const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return new Intl.NumberFormat('fr-FR').format(price)
}

const formatData = (mb) => {
  if (!mb && mb !== 0) return '-'
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`
  }
  return `${mb} MB`
}

const getStatusClass = (isActive) => {
  return isActive
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusIconClass = (isActive) => {
  return isActive ? 'bg-green-500' : 'bg-gray-400'
}

const { debouncedFn: debouncedSearch } = useDebounce(() => {
  loadPrices(1)
}, 500)

const clearSearch = () => {
  searchQuery.value = ''
  loadPrices(1)
}

const handlePageChange = async (page) => {
  await loadPrices(page)
}

const loadPrices = async (page = 1) => {
  loading.value = true
  try {
    const params = { page }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    if (statusFilter.value) {
      params.is_active = statusFilter.value === 'active'
    }
    const response = await pricesApi.list(params)
    const data = response.data
    prices.value = data.prices || data.data || []
    pagination.value = data.pagination || null
  } catch (error) {
    console.error('Erreur chargement prix:', error)
    prices.value = []
    showError('Erreur lors du chargement des prix')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingPrice.value = null
  priceForm.value = {
    country_code: '',
    data_mb: 0,
    price: 0,
  }
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingPrice.value = null
  priceForm.value = {
    country_code: '',
    data_mb: 0,
    price: 0,
  }
}

const editPrice = (price) => {
  editingPrice.value = price
  priceForm.value = {
    country_code: price.country_code,
    data_mb: price.data_mb,
    price: price.price,
  }
  showCreateModal.value = true
}

const handleSubmit = async () => {
  saving.value = true
  try {
    let response
    if (editingPrice.value) {
      response = await pricesApi.update(editingPrice.value.id, priceForm.value)
    } else {
      response = await pricesApi.create(priceForm.value)
    }
    
    if (response.data.success) {
      success(editingPrice.value ? 'Prix modifié avec succès !' : 'Prix créé avec succès !')
      closeModal()
      await loadPrices()
    } else {
      showError(response.data.message || 'Erreur lors de la sauvegarde du prix')
    }
  } catch (error) {
    console.error('Erreur sauvegarde prix:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde du prix'
    showError(errorMessage)
  } finally {
    saving.value = false
  }
}

const handleToggleStatus = async (price) => {
  try {
    const response = await pricesApi.toggle(price.id)
    if (response.data.success) {
      success(price.is_active ? 'Prix désactivé avec succès !' : 'Prix activé avec succès !')
      await loadPrices()
    } else {
      showError(response.data.message || 'Erreur lors du changement de statut')
    }
  } catch (error) {
    console.error('Erreur changement statut:', error)
    showError('Erreur lors du changement de statut')
  }
}

const handleDelete = async (price) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer ce prix ?\n\nPays: ${price.country_code}\nDonnées: ${formatData(price.data_mb)}\nPrix: ${formatPrice(price.price)} FCFA`)) {
    return
  }

  try {
    const response = await pricesApi.delete(price.id)
    if (response.data.success) {
      success('Prix supprimé avec succès !')
      await loadPrices()
    } else {
      showError(response.data.message || 'Erreur lors de la suppression du prix')
    }
  } catch (error) {
    console.error('Erreur suppression prix:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression du prix'
    showError(errorMessage)
  }
}

onMounted(() => {
  loadPrices()
})
</script>
