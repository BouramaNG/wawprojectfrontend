<template>
  <div>
    <div class="mb-6">
      <router-link
        to="/orders"
        class="text-primary-600 hover:text-primary-900 mb-4 inline-flex items-center transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </router-link>
      <div class="flex items-center justify-between mt-2">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Détails de la Commande</h1>
          <p class="text-gray-600 mt-1" v-if="order && (order.ref_command || order.id)">
            Référence: {{ order.ref_command || `#${order.id}` }}
          </p>
        </div>
        <div v-if="order" class="flex items-center space-x-3">
          <span
            class="px-4 py-2 text-sm font-semibold rounded-lg"
            :class="getStatusClass(order?.status)"
          >
            {{ formatStatus(order?.status) }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="card bg-red-50 border border-red-200">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700 font-medium">{{ error }}</p>
      </div>
    </div>

    <div v-else-if="order" class="space-y-6">
      <!-- Carte principale avec informations générales -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Informations Commande -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Informations Générales -->
          <div class="card bg-gradient-to-br from-white to-gray-50">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900 flex items-center">
                <svg class="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Informations Commande
              </h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">ID Commande</label>
                <p class="text-gray-900 font-bold text-lg mt-1">{{ order.id || '-' }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Référence</label>
                <p class="text-gray-900 font-semibold mt-1">{{ order.ref_command || '-' }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Montant</label>
                <p class="text-gray-900 font-bold text-lg text-primary-600 mt-1">
                  {{ formatPrice(order.amount) }}
                </p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Méthode de Paiement</label>
                <p class="text-gray-900 font-semibold mt-1">{{ order.payment_method || 'Non spécifiée' }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction ID</label>
                <p class="text-gray-900 font-mono text-sm mt-1">{{ order.transaction_id || '-' }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Créé le</label>
                <p class="text-gray-900 font-semibold mt-1">{{ formatDate(order.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Informations Client -->
          <div class="card bg-gradient-to-br from-blue-50 to-white">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informations Client
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <p class="text-gray-900 font-semibold mt-1">{{ order?.email || '-' }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</label>
                <p class="text-gray-900 font-semibold mt-1">{{ order?.phone_number || '-' }}</p>
              </div>
              <div v-if="order?.user" class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Utilisateur</label>
                <p class="text-gray-900 font-semibold mt-1">{{ order.user?.name || order.user?.email || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Informations 📱 eSIM -->
          <div v-if="order?.esim" class="card bg-gradient-to-br from-green-50 to-white">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Informations eSIM
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">ICCID</label>
                <p class="text-gray-900 font-mono text-sm mt-1">{{ order?.esim?.iccid || '-' }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">IMSI</label>
                <p class="text-gray-900 font-mono text-sm mt-1">{{ order?.esim?.mapped_imsi || '-' }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Statut eSIM</label>
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1"
                  :class="getEsimStatusClass(order?.esim?.sim_status)"
                >
                  {{ order?.esim?.sim_status || '-' }}
                </span>
              </div>
              <div v-if="order?.esim?.activation_code" class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Code d'Activation</label>
                <p class="text-gray-900 font-mono text-sm mt-1">{{ order.esim.activation_code }}</p>
              </div>
            </div>
            <div v-if="order?.qr_code_url" class="mt-4 bg-white p-4 rounded-lg border border-gray-200">
              <label class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">QR Code</label>
              <img :src="order.qr_code_url" alt="QR Code" class="w-48 h-48 mx-auto border border-gray-200 rounded-lg" />
            </div>
          </div>

          <!-- Informations Package Template -->
          <div v-if="order?.esim_package_template || order?.esimPackageTemplate" class="card bg-gradient-to-br from-purple-50 to-white">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Package Template
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom</label>
                <p class="text-gray-900 font-semibold mt-1">{{ (order?.esim_package_template || order?.esimPackageTemplate)?.name || '-' }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
                <p class="text-gray-900 mt-1">{{ (order?.esim_package_template || order?.esimPackageTemplate)?.description || '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar avec résumé -->
        <div class="space-y-6">
          <!-- Résumé -->
          <div class="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <h3 class="text-lg font-bold mb-4">Résumé</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center pb-3 border-b border-primary-500">
                <span class="text-primary-100">Statut</span>
                <span class="font-bold">{{ formatStatus(order?.status) }}</span>
              </div>
              <div class="flex justify-between items-center pb-3 border-b border-primary-500">
                <span class="text-primary-100">Montant</span>
                <span class="font-bold text-xl">{{ formatPrice(order?.amount) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-primary-100">Date</span>
                <span class="font-semibold">{{ formatShortDate(order?.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="card">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            <div class="space-y-2">
              <router-link
                v-if="order?.esim?.id"
                :to="`/esims/${order.esim.id}`"
                class="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              >
                Voir l'eSIM
              </router-link>
              <router-link
                v-if="(order?.esim_package_template || order?.esimPackageTemplate)?.id"
                :to="`/templates/${(order?.esim_package_template || order?.esimPackageTemplate)?.id}`"
                class="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-medium"
              >
                Voir le Template
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { orders as ordersApi } from '@/services/api'

const route = useRoute()
const loading = ref(true)
const order = ref(null)
const error = ref('')

const formatPrice = (price) => {
  if (!price && price !== 0) return '-'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price).replace('XOF', 'FCFA')
}

const formatDate = (date) => {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return '-'
  }
}

const formatShortDate = (date) => {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (e) {
    return '-'
  }
}

const formatStatus = (status) => {
  if (!status) return 'Non défini'
  const statusMap = {
    'pending': 'En attente',
    'processing': 'En traitement',
    'completed': 'Terminée',
    'paid': 'Payée',
    'failed': 'Échouée',
    'cancelled': 'Annulée'
  }
  return statusMap[status.toLowerCase()] || status
}

const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'processing': 'bg-blue-100 text-blue-800 border border-blue-300',
    'completed': 'bg-green-100 text-green-800 border border-green-300',
    'paid': 'bg-green-100 text-green-800 border border-green-300',
    'failed': 'bg-red-100 text-red-800 border border-red-300',
    'cancelled': 'bg-gray-100 text-gray-800 border border-gray-300'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border border-gray-300'
}

const getEsimStatusClass = (status) => {
  const classes = {
    'pre-service': 'bg-blue-100 text-blue-800',
    'in-service': 'bg-green-100 text-green-800',
    'terminated': 'bg-red-100 text-red-800',
    'suspended': 'bg-yellow-100 text-yellow-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const loadOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await ordersApi.show(route.params.id)
    
    // Gérer différents formats de réponse
    let orderData = null
    
    // Format admin: { success: true, order: {...} }
    if (response.data?.success && response.data?.order) {
      orderData = response.data.order
    }
    // Format partenaire: { success: true, data: {...} }
    else if (response.data?.success && response.data?.data) {
      orderData = response.data.data
    }
    // Format alternatif: { order: {...} }
    else if (response.data?.order) {
      orderData = response.data.order
    }
    // Format alternatif: { data: {...} }
    else if (response.data?.data) {
      orderData = response.data.data
    }
    // Si response.data est directement l'order (avec id)
    else if (response.data && typeof response.data === 'object' && response.data.id && !response.data.success) {
      orderData = response.data
    }
    
    if (orderData) {
      order.value = orderData
    } else {
      error.value = response.data?.message || 'Aucune donnée de commande trouvée dans la réponse'
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Erreur lors du chargement de la commande'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrder()
})
</script>
