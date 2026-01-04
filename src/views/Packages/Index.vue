<template>
  <div class="space-y-6">
    <!-- Header avec statistiques -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-purple-400">
          Packages eSIM
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 text-lg">Gérez et surveillez vos packages eSIM activés</p>
      </div>
      <router-link
        to="/packages/create"
        class="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <svg class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Activer un Package
      </router-link>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-blue-100 text-sm font-medium">Total Packages</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.total || 0 }}</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-100 text-sm font-medium">Actifs</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.active || 0 }}</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-purple-100 text-sm font-medium">Pays</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.countries || 0 }}</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-orange-100 text-sm font-medium">Ce Mois</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.thisMonth || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Barre de recherche améliorée -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par nom, pays, ID, données..."
            class="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-gray-100 transition-all duration-200"
            @input="debouncedSearch"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            type="button"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-3 rounded-xl transition-all duration-200',
              viewMode === 'grid' 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'table'"
            :class="[
              'p-3 rounded-xl transition-all duration-200',
              viewMode === 'table' 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Vue Grille -->
    <div v-if="viewMode === 'grid' && !loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in packages"
        :key="item.id"
        class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 transform hover:-translate-y-2"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{{ item.plan_name || 'Package #' + item.id }}</h3>
              <div class="flex items-center gap-2 mt-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900 dark:to-blue-800 dark:text-blue-200">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ getCountryName(item) }}
                </span>
              </div>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {{ item.id }}
            </div>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">Données</span>
              </div>
              <span class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ item.data_limit ? `${item.data_limit} GB` : '-' }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">Validité</span>
              </div>
              <span class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ item.validity_days ? `${item.validity_days} jours` : '-' }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">Créé le</span>
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatDate(item.created_at) }}</span>
            </div>
          </div>

          <router-link
            :to="`/packages/${item.id}`"
            class="block w-full py-3 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Voir les détails
          </router-link>
        </div>
      </div>

      <div v-if="packages.length === 0" class="col-span-full">
        <div class="text-center py-16">
          <svg class="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Aucun package trouvé</p>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Commencez par activer votre premier package</p>
        </div>
      </div>
    </div>

    <!-- Pagination pour la vue grille -->
    <div v-if="viewMode === 'grid' && pagination && pagination.total > pagination.per_page" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 px-6 py-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Affichage de <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span> à
          <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span>
          sur <span class="font-medium">{{ pagination.total }}</span> résultats
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="handlePageChange(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Précédent
          </button>
          <div class="flex items-center space-x-1">
            <button
              v-for="page in getPageNumbers()"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                page === pagination.current_page
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="handlePageChange(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Suivant
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Vue Table -->
    <div v-else-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>

      <DataTable
        v-else
        :columns="columns"
        :data="packages"
        :pagination="pagination"
        :actions="true"
        @page-change="handlePageChange"
      >
        <template #cell-country_name="{ item }">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              {{ getCountryName(item).substring(0, 2).toUpperCase() }}
            </span>
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ getCountryName(item) }}</span>
          </div>
        </template>

        <template #cell-data_limit="{ item }">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {{ item.data_limit ? `${item.data_limit} GB` : '-' }}
          </span>
        </template>

        <template #cell-validity_days="{ item }">
          <span class="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ item.validity_days ? `${item.validity_days} jours` : '-' }}
          </span>
        </template>

        <template #cell-created_at="{ item }">
          <span class="text-gray-700 dark:text-gray-300">{{ formatDate(item.created_at) }}</span>
        </template>

        <template #actions="{ item }">
          <router-link
            :to="`/packages/${item.id}`"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Détails
          </router-link>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { packages as packagesApi } from '@/services/api'
import DataTable from '@/components/common/DataTable.vue'
import { useDebounce } from '@/composables/useDebounce'
import { authService } from '@/services/auth'

// Forcer le mode clair si c'est un utilisateur partenaire
onMounted(() => {
  const userType = authService.getCurrentUser()?.user_type || localStorage.getItem('auth_user_type')
  if (userType === 'partner') {
    document.documentElement.classList.remove('dark')
  }
})

onUnmounted(() => {
  const userType = authService.getCurrentUser()?.user_type || localStorage.getItem('auth_user_type')
  if (userType === 'partner') {
    // Restaurer le thème sauvegardé quand on quitte la page
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // Utiliser la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      }
    }
  }
})

const loading = ref(false)
const packages = ref([])
const pagination = ref(null)
const searchQuery = ref('')
const viewMode = ref('grid') // 'grid' ou 'table'
const stats = ref({
  total: 0,
  active: 0,
  countries: 0,
  thisMonth: 0,
})

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'plan_name', label: 'Nom', sortable: true },
  { key: 'country_name', label: 'Pays', sortable: true },
  { key: 'data_limit', label: 'Données (GB)', sortable: true },
  { key: 'validity_days', label: 'Validité (jours)', sortable: true },
  { key: 'created_at', label: 'Créé le', sortable: true },
]

const handlePageChange = async (page) => {
  await loadPackages(page)
}

const loadPackages = async (page = 1) => {
  loading.value = true
  try {
    const params = { page }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    const response = await packagesApi.list(params)
    const data = response.data
    // L'API retourne {success: true, packages: [...], pagination: {...}} pour admin
    // ou {success: true, data: [...], pagination: {...}} pour partenaire
    packages.value = data.packages || data.data || []
    pagination.value = data.pagination || null
    
    // Calculer les statistiques
    calculateStats()
  } catch (error) {
    console.error('Erreur chargement packages:', error)
    packages.value = []
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const allPackages = packages.value
  const countries = new Set()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  allPackages.forEach(pkg => {
    if (pkg.country_code || pkg.country_name) {
      countries.add(pkg.country_code || pkg.country_name)
    }
  })
  
  const thisMonth = allPackages.filter(pkg => {
    if (!pkg.created_at) return false
    const created = new Date(pkg.created_at)
    return created >= startOfMonth
  }).length
  
  stats.value = {
    total: pagination.value?.total || allPackages.length,
    active: allPackages.length, // Tous les packages affichés sont actifs
    countries: countries.size,
    thisMonth: thisMonth,
  }
}

const { debouncedFn: debouncedSearch } = useDebounce(() => {
  loadPackages(1)
}, 500)

const clearSearch = () => {
  searchQuery.value = ''
  loadPackages(1)
}

const getCountryName = (item) => {
  // Normaliser les valeurs
  const countryName = item.country_name ? String(item.country_name).trim() : null
  const countryCode = item.country_code ? String(item.country_code).trim().toUpperCase() : null
  
  // Si country_name existe et n'est pas "Unknown" ou "UNK", l'utiliser
  if (countryName && 
      countryName !== 'Unknown' && 
      countryName !== 'UNK' && 
      countryName.toUpperCase() !== 'UNK') {
    return countryName
  }
  
  // Sinon, essayer de convertir depuis country_code
  if (countryCode && countryCode !== 'UNK') {
    const countryMap = {
      // Alpha-3
      'FRA': 'France',
      'USA': 'États-Unis',
      'GBR': 'Royaume-Uni',
      'DEU': 'Allemagne',
      'ESP': 'Espagne',
      'ITA': 'Italie',
      'PRT': 'Portugal',
      'NLD': 'Pays-Bas',
      'BEL': 'Belgique',
      'CHE': 'Suisse',
      'AUT': 'Autriche',
      'POL': 'Pologne',
      'CZE': 'République tchèque',
      'SWE': 'Suède',
      'NOR': 'Norvège',
      'DNK': 'Danemark',
      'FIN': 'Finlande',
      'GRC': 'Grèce',
      'TUR': 'Turquie',
      'JPN': 'Japon',
      'CHN': 'Chine',
      'KOR': 'Corée du Sud',
      'AUS': 'Australie',
      'CAN': 'Canada',
      'MEX': 'Mexique',
      'BRA': 'Brésil',
      'ARG': 'Argentine',
      'ZAF': 'Afrique du Sud',
      'EGY': 'Égypte',
      'MAR': 'Maroc',
      'TUN': 'Tunisie',
      'SEN': 'Sénégal',
      'CIV': 'Côte d\'Ivoire',
      // Alpha-2
      'FR': 'France',
      'US': 'États-Unis',
      'GB': 'Royaume-Uni',
      'DE': 'Allemagne',
      'ES': 'Espagne',
      'IT': 'Italie',
      'PT': 'Portugal',
      'NL': 'Pays-Bas',
      'BE': 'Belgique',
      'CH': 'Suisse',
      'AT': 'Autriche',
      'PL': 'Pologne',
      'CZ': 'République tchèque',
      'SE': 'Suède',
      'NO': 'Norvège',
      'DK': 'Danemark',
      'FI': 'Finlande',
      'GR': 'Grèce',
      'TR': 'Turquie',
      'JP': 'Japon',
      'CN': 'Chine',
      'KR': 'Corée du Sud',
      'AU': 'Australie',
      'CA': 'Canada',
      'MX': 'Mexique',
      'BR': 'Brésil',
      'AR': 'Argentine',
      'ZA': 'Afrique du Sud',
      'EG': 'Égypte',
      'MA': 'Maroc',
      'TN': 'Tunisie',
      'SN': 'Sénégal',
      'CI': 'Côte d\'Ivoire',
    }
    const mapped = countryMap[countryCode]
    if (mapped) {
      return mapped
    }
    // Si pas dans le mapping mais code valide, retourner le code
    return countryCode
  }
  
  // Si vraiment rien, retourner "-"
  return '-'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (e) {
    return '-'
  }
}

const getPageNumbers = () => {
  if (!pagination.value) return []
  
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  // Afficher max 5 pages autour de la page courante
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  // Ajuster si on est près du début ou de la fin
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(last, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

onMounted(() => {
  loadPackages()
})
</script>
