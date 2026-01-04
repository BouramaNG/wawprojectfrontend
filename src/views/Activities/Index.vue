<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-indigo-400">
          Journal d'Activités
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 text-lg">Surveillez toutes les actions sur la plateforme</p>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-blue-100 text-sm font-medium">Total Activités</span>
            <svg class="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.total || 0 }}</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl p-6 shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-100 text-sm font-medium">Via Plateforme</span>
            <svg class="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.by_source?.platform?.count || 0 }}</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-purple-100 text-sm font-medium">Via API Partenaire</span>
            <svg class="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.by_source?.partner_api?.count || 0 }}</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl p-6 shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-orange-100 text-sm font-medium">Partenaires Actifs</span>
            <svg class="w-6 h-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-white">{{ Object.keys(stats.by_partner || {}).length }}</p>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Partenaire</label>
          <select
            v-model="filters.partner_id"
            @change="loadActivities(1)"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
          >
            <option value="">Tous les partenaires</option>
            <option v-for="p in partners" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Action</label>
          <select
            v-model="filters.action"
            @change="loadActivities(1)"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
          >
            <option value="">Toutes les actions</option>
            <option value="auth.login">Connexion</option>
            <option value="auth.password_changed">Changement de mot de passe</option>
            <option value="package.activated">Activation de package</option>
            <option value="esim.activated">Activation de 📱 eSIM</option>
            <option value="order.created">Création de commande</option>
            <option value="order.activated">Activation de commande</option>
            <option value="create">Création</option>
            <option value="update">Modification</option>
            <option value="delete">Suppression</option>
            <option value="activate">Activation</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type d'entité</label>
          <select
            v-model="filters.entity_type"
            @change="loadActivities(1)"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
          >
            <option value="">Tous les types</option>
            <option value="Order">Commandes</option>
            <option value="Esim">📱 eSIMs</option>
            <option value="Package">Packages</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source</label>
          <select
            v-model="filters.activation_source"
            @change="loadActivities(1)"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
          >
            <option value="">Toutes les sources</option>
            <option value="platform">Plateforme</option>
            <option value="partner_api">API Partenaire</option>
            <option value="partner_dashboard">Dashboard Partenaire</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
          <input
            v-model="filters.date_from"
            type="date"
            @change="loadActivities(1)"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Liste des activités -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>

      <div v-else-if="activities.length === 0" class="p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-600 dark:text-gray-400 font-medium">Aucune activité trouvée</p>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
              <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  :class="getActionColor(activity.action)"
                >
                  {{ getActionIcon(activity.action) }}
                </div>
                <div class="flex-1">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {{ formatAction(activity.action) }}
                  </h3>
                  <div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    <span v-if="activity.entity_type && activity.entity_id">
                      {{ formatEntityType(activity.entity_type) }} #{{ activity.entity_id }}
                    </span>
                    <span v-if="activity.data?.iccid" class="font-mono">
                      ICCID: {{ activity.data.iccid }}
                    </span>
                    <span v-if="activity.data?.email" class="flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {{ activity.data.email }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="ml-16 space-y-2">
                <div class="flex flex-wrap items-center gap-3 text-sm">
                  <span v-if="activity.partner_id && activity.partner" class="flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span class="font-medium">{{ activity.partner?.name || 'Partenaire #' + activity.partner_id }}</span>
                  </span>
                  <span v-if="activity.partner_user_id && activity.partner_user" class="flex items-center px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="font-medium">{{ activity.partner_user?.name || activity.partner_user?.email || 'Utilisateur #' + activity.partner_user_id }}</span>
                  </span>
                  <span v-if="activity.actor_type && activity.actor" class="flex items-center px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span v-if="activity.actor_type.includes('User') && activity.actor">{{ activity.actor.name || activity.actor.email }}</span>
                    <span v-else-if="activity.actor_type.includes('Partner') && activity.actor">{{ activity.actor.name }}</span>
                    <span v-else>{{ formatEntityType(activity.actor_type) }}</span>
                  </span>
                  <span v-if="activity.ip_address" class="flex items-center px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-mono text-xs">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    {{ activity.ip_address }}
                  </span>
                  <span
                    class="px-3 py-1 text-xs font-semibold rounded-full"
                    :class="getSourceClass(activity.activation_source)"
                  >
                    {{ formatSource(activity.activation_source) }}
                  </span>
                </div>
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatDate(activity.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.total > pagination.per_page" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
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
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Précédent
            </button>
            <button
              @click="handlePageChange(pagination.current_page + 1)"
              :disabled="pagination.current_page >= pagination.last_page"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
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
import { ref, onMounted } from 'vue'
import { activities as activitiesApi, partners as partnersApi } from '@/services/api'

const loading = ref(false)
const activities = ref([])
const pagination = ref(null)
const stats = ref({})
const partners = ref([])

const filters = ref({
  partner_id: '',
  action: '',
  entity_type: '',
  activation_source: '',
  date_from: '',
})

const formatAction = (action) => {
  const actions = {
    'create': 'Création',
    'update': 'Modification',
    'delete': 'Suppression',
    'activate': 'Activation',
    'auth.login': 'Connexion',
    'auth.password_changed': 'Changement de mot de passe',
    'package.activated': 'Package activé',
    'esim.activated': 'eSIM activée',
    'order.created': 'Commande créée',
    'order.activated': 'Commande activée',
  }
  return actions[action] || action.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatEntityType = (type) => {
  if (!type) return 'Entité'
  return type.replace('App\\Models\\', '')
}

const formatSource = (source) => {
  const sources = {
    'platform': 'Plateforme',
    'partner_api': 'API Partenaire',
    'partner_dashboard': 'Dashboard Partenaire',
  }
  return sources[source] || source || 'N/A'
}

const getSourceClass = (source) => {
  const classes = {
    'platform': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'partner_api': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'partner_dashboard': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }
  return classes[source] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getActionColor = (action) => {
  const colors = {
    'create': 'bg-green-500',
    'update': 'bg-blue-500',
    'delete': 'bg-red-500',
    'activate': 'bg-purple-500',
    'auth.login': 'bg-indigo-500',
    'auth.password_changed': 'bg-yellow-500',
    'package.activated': 'bg-purple-500',
    'esim.activated': 'bg-cyan-500',
    'order.created': 'bg-green-500',
    'order.activated': 'bg-emerald-500',
  }
  return colors[action] || 'bg-gray-500'
}

const getActionIcon = (action) => {
  const icons = {
    'create': '+',
    'update': '✎',
    'delete': '×',
    'activate': '✓',
    'auth.login': '🔐',
    'auth.password_changed': '🔑',
    'package.activated': '📦',
    'esim.activated': '📱',
    'order.created': '🛒',
    'order.activated': '✅',
  }
  return icons[action] || '•'
}

const formatDate = (date) => {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    return '-'
  }
}

const handlePageChange = async (page) => {
  if (page > 0 && page <= pagination.value.last_page) {
    await loadActivities(page)
  }
}

const loadActivities = async (page = 1) => {
  loading.value = true
  try {
    const params = { page, ...filters.value }
    // Supprimer les valeurs vides
    Object.keys(params).forEach(key => {
      if (params[key] === '') delete params[key]
    })
    const response = await activitiesApi.list(params)
    if (response.data.success) {
      activities.value = response.data.data || []
      pagination.value = response.data.pagination || null
      stats.value = response.data.stats || {}
    }
  } catch (error) {
    console.error('Erreur chargement activités:', error)
    activities.value = []
  } finally {
    loading.value = false
  }
}

const loadPartners = async () => {
  try {
    const response = await partnersApi.list()
    if (response.data.success) {
      partners.value = response.data.data || response.data.partners || []
    }
  } catch (error) {
    console.error('Erreur chargement partenaires:', error)
  }
}

onMounted(() => {
  loadActivities()
  loadPartners()
})
</script>

