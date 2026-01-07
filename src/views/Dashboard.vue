<template>
  <div>
    <!-- Dashboard Partenaire -->
    <div v-if="isPartner" class="space-y-6">
      <div class="mb-6 flex items-center space-x-4">
        <img
          :src="logoUrl"
          alt="WAW Logo"
          class="h-12 w-auto object-contain"
          @error="handleImageError"
        />
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard Partenaire</h1>
          <p class="text-gray-600 mt-1">Bienvenue sur votre espace partenaire</p>
        </div>
      </div>

      <!-- Informations Partenaire -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations du compte</h2>
          <div class="space-y-3" v-if="partnerInfo">
            <div>
              <p class="text-sm text-gray-600">Nom</p>
              <p class="text-base font-medium text-gray-900">{{ partnerInfo.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Email</p>
              <p class="text-base font-medium text-gray-900">{{ partnerInfo.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Rôle</p>
              <p class="text-base font-medium text-gray-900">
                {{ typeof partnerInfo.role === 'object' && partnerInfo.role?.name 
                  ? partnerInfo.role.name 
                  : (partnerInfo.role || 'Non défini') }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Statut</p>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="partnerInfo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ partnerInfo.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations du partenaire</h2>
          <div class="space-y-3" v-if="partnerInfo?.partner">
            <div>
              <p class="text-sm text-gray-600">Nom du partenaire</p>
              <p class="text-base font-medium text-gray-900">{{ partnerInfo.partner.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Email du partenaire</p>
              <p class="text-base font-medium text-gray-900">{{ partnerInfo.partner.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Statut du partenaire</p>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="partnerInfo.partner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ partnerInfo.partner.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'information -->
      <div class="card bg-blue-50 border-blue-200">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Accès Partenaire</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>En tant que partenaire, vous avez accès à l'API pour intégrer nos services eSIM dans votre plateforme.</p>
              <p class="mt-2">Pour accéder aux fonctionnalités d'administration, veuillez contacter votre administrateur.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Admin -->
    <div v-else>
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-1">Vue d'ensemble de votre plateforme eSIM</p>
      </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="card hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
            <p
              class="text-sm mt-1"
              :class="stat.change >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              <span v-if="stat.change >= 0">↑</span>
              <span v-else>↓</span>
              {{ Math.abs(stat.change) }}% vs mois dernier
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="stat.bgColor"
          >
            <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Ventes (7 derniers jours)</h2>
          <button
            @click="exportSalesCSV"
            class="text-sm text-primary-600 hover:text-primary-800 flex items-center"
            title="Exporter en CSV"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSV
          </button>
        </div>
        <div v-if="loadingCharts" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
        <SalesChart v-else-if="chartData.sales" :data="chartData.sales" />
        <div v-else class="flex items-center justify-center h-64 text-gray-400">
          Aucune donnée disponible
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">📱 eSIMs par statut</h2>
        <div v-if="loadingCharts" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
        <EsimStatusChart v-else-if="chartData.esimStatus" :data="chartData.esimStatus" />
        <div v-else class="flex items-center justify-center h-64 text-gray-400">
          Aucune donnée disponible
        </div>
      </div>
    </div>

    <!-- Activités récentes -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Activités récentes</h2>
        <button
          v-if="activities.length > 0"
          @click="exportActivitiesCSV"
          class="text-sm text-primary-600 hover:text-primary-800 flex items-center"
          title="Exporter en CSV"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSV
        </button>
      </div>
      <div v-if="loadingActivities" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      <div v-else-if="activities.length === 0" class="text-center py-12 text-gray-500">
        Aucune activité récente
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="(activity, index) in activities"
          :key="index"
          class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="getActivityIcon(activity.type).bgColor"
          >
            <component :is="getActivityIcon(activity.type).icon" class="w-5 h-5" :class="getActivityIcon(activity.type).iconColor" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-xs text-gray-500">{{ activity.description || '' }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const handleImageError = (event) => {
  // Si l'image ne charge pas, masquer l'erreur et continuer
  event.target.style.display = 'none'
}
import {
  DevicePhoneMobileIcon,
  CubeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
} from '@heroicons/vue/24/outline'
import { dashboard } from '@/services/api'
import { authService } from '@/services/auth'
import SalesChart from '@/components/charts/SalesChart.vue'
import EsimStatusChart from '@/components/charts/EsimStatusChart.vue'
import logoImage from '@/assets/logo-waw-officiel.png'

const logoUrl = computed(() => logoImage)

// Vérifier si c'est un partenaire
const isPartner = computed(() => {
  const userType = localStorage.getItem('auth_user_type') || 'admin'
  return userType === 'partner'
})

// Informations du partenaire
const partnerInfo = ref(null)

const stats = ref([
  {
    label: 'Total eSIMs',
    value: '0',
    change: 12,
    icon: DevicePhoneMobileIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Packages actifs',
    value: '0',
    change: 8,
    icon: CubeIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    label: 'Revenus (mois)',
    value: '0 FCFA',
    change: 15,
    icon: CurrencyDollarIcon,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    label: 'Partenaires',
    value: '0',
    change: 5,
    icon: UserGroupIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
])

const activities = ref([])
const chartData = ref({
  sales: null,
  esimStatus: null,
})
const loadingCharts = ref(false)
const loadingActivities = ref(false)

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const formatPrice = (price) => {
  return formatNumber(price) + ' FCFA'
}

const getActivityIcon = (type) => {
  const icons = {
    order: {
      icon: ShoppingBagIcon,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    package: {
      icon: CubeIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    template: {
      icon: DocumentTextIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  }
  return icons[type] || icons.order
}

const exportSalesCSV = () => {
  if (!chartData.value.sales) return

  const headers = ['Date', 'Revenus (FCFA)', 'Commandes']
  const rows = chartData.value.sales.labels.map((label, index) => [
    label,
    chartData.value.sales.revenues[index] || 0,
    chartData.value.sales.orders[index] || 0,
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `ventes_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

const exportActivitiesCSV = () => {
  if (activities.value.length === 0) return

  const headers = ['Type', 'Titre', 'Description', 'Temps']
  const rows = activities.value.map(activity => [
    activity.type || '',
    activity.title || '',
    activity.description || '',
    activity.time || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `activites_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

onMounted(async () => {
  // Vérifier si c'est un utilisateur partenaire
  const userType = localStorage.getItem('auth_user_type') || 'admin'
  
  if (userType === 'partner') {
    // Charger les informations du partenaire
    try {
      const user = authService.getCurrentUser()
      if (user) {
        partnerInfo.value = user
      }
    } catch (error) {
      // Erreur silencieuse
    }
    return
  }
  
  try {
    const response = await dashboard.stats()
    const data = response.data.data || response.data
    
    if (data) {
      stats.value[0].value = formatNumber(data.total_esims || 0)
      stats.value[1].value = formatNumber(data.active_packages || 0)
      stats.value[2].value = formatPrice(data.monthly_revenue || 0)
      stats.value[3].value = formatNumber(data.active_partners || 0)
    }

    // Charger les graphiques
    if (response.data.charts) {
      loadingCharts.value = true
      chartData.value = {
        sales: response.data.charts.sales || null,
        esimStatus: response.data.charts.esim_status || null,
      }
      loadingCharts.value = false
    }

    // Charger les activités récentes
    if (response.data.activities) {
      loadingActivities.value = true
      activities.value = response.data.activities || []
      loadingActivities.value = false
    }
  } catch (error) {
    // Si erreur 403 (permission refusée), afficher un message approprié
    if (error.response?.status === 403) {
      // Afficher un message d'information plutôt qu'une erreur
      // Les valeurs par défaut seront affichées
    }
    
    // Valeurs par défaut en cas d'erreur
    stats.value[0].value = '0'
    stats.value[1].value = '0'
    stats.value[2].value = '0 FCFA'
    stats.value[3].value = '0'
    loadingCharts.value = false
    loadingActivities.value = false
  }
})
</script>

