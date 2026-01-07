<template>
  <div class="space-y-6">
    <!-- Header avec titre et statistiques -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">📦 Commandes</h1>
        <p class="text-gray-600">Gestion et suivi de vos commandes eSIM</p>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium mb-1">Total</p>
            <p class="text-3xl font-bold">{{ stats.total }}</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-100 text-sm font-medium mb-1">En attente</p>
            <p class="text-3xl font-bold">{{ stats.pending }}</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium mb-1">Complétées</p>
            <p class="text-3xl font-bold">{{ stats.completed }}</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium mb-1">Revenus</p>
            <p class="text-2xl font-bold">{{ formatPrice(stats.revenue) }} FCFA</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche améliorée -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par email, ID, statut..."
              class="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              @input="debouncedSearch"
            />
            <svg
              class="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="loadOrders()"
            class="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Actualiser</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table des commandes améliorée -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium">Chargement des commandes...</p>
        </div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20">
        <div class="max-w-md mx-auto">
          <div class="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
          <p class="text-gray-600">Aucune commande trouvée pour le moment.</p>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                {{ column.label }}
              </th>
              <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(order, index) in orders"
              :key="order.id || index"
              class="hover:bg-primary-50 transition-colors duration-150 cursor-pointer"
              @click="$router.push(`/orders/${order.id}`)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-primary-600 font-bold text-sm">#{{ order.id }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.email || order.customer_email || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                  :class="getStatusClass(order.status)"
                >
                  <span class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(order.status)"></span>
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">{{ formatPrice(order.amount || 0) }} FCFA</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">{{ formatDate(order.created_at) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <router-link
                  :to="`/orders/${order.id}`"
                  class="text-primary-600 hover:text-primary-900 font-semibold inline-flex items-center space-x-1"
                  @click.stop
                >
                  <span>Voir détails</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination améliorée -->
      <div v-if="pagination && pagination.total > pagination.per_page" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Affichage de <span class="font-semibold">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span>
            à <span class="font-semibold">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span>
            sur <span class="font-semibold">{{ pagination.total }}</span> commandes
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="handlePageChange(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <span class="px-4 py-2 text-sm font-medium text-gray-700">
              Page {{ pagination.current_page }} sur {{ pagination.last_page }}
            </span>
            <button
              @click="handlePageChange(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { orders as ordersApi } from '@/services/api'
import DataTable from '@/components/common/DataTable.vue'
import { useDebounce } from '@/composables/useDebounce'
import { authService } from '@/services/auth'

const loading = ref(false)
const orders = ref([])
const pagination = ref(null)
const searchQuery = ref('')

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Statut', sortable: true },
  { key: 'amount', label: 'Montant', sortable: true },
  { key: 'created_at', label: 'Date', sortable: true },
]

const stats = ref({
  total: 0,
  pending: 0,
  completed: 0,
  revenue: 0,
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price || 0)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    completed: 'Complétée',
    activated: 'Activée',
    failed: 'Échouée',
    cancelled: 'Annulée',
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    completed: 'bg-green-100 text-green-800 border border-green-200',
    activated: 'bg-blue-100 text-blue-800 border border-blue-200',
    failed: 'bg-red-100 text-red-800 border border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border border-gray-200',
  }
  return classes[status] || 'bg-gray-100 text-gray-800 border border-gray-200'
}

const getStatusDotClass = (status) => {
  const classes = {
    pending: 'bg-yellow-500',
    completed: 'bg-green-500',
    activated: 'bg-blue-500',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-500',
  }
  return classes[status] || 'bg-gray-500'
}

const calculateStats = () => {
  stats.value = {
    total: orders.value.length,
    pending: orders.value.filter(o => o.status === 'pending').length,
    completed: orders.value.filter(o => o.status === 'completed' || o.status === 'activated').length,
    revenue: orders.value.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0),
  }
}

const handlePageChange = async (page) => {
  await loadOrders(page)
}

const loadOrders = async (page = 1) => {
  loading.value = true
  try {
    const params = { page }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    const response = await ordersApi.list(params)
    // L'API retourne {success: true, data: [...], pagination: {...}} pour partenaire
    // ou {success: true, orders: [...], pagination: {...}} pour admin
    orders.value = response.data.data || response.data.orders || response.data || []
    pagination.value = response.data.pagination || null
    calculateStats()
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const { debouncedFn: debouncedSearch } = useDebounce(() => {
  loadOrders(1)
}, 500)

const clearSearch = () => {
  searchQuery.value = ''
  loadOrders(1)
}

// Forcer le mode clair si c'est un utilisateur partenaire
onMounted(() => {
  loadOrders()
  
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
</script>
