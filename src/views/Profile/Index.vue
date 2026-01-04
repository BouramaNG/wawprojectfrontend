<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">👤 Mon Profil</h1>
      <p class="text-gray-600">Gérez vos informations personnelles et celles de votre compte partenaire</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Chargement des informations...</p>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Informations du compte -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Informations personnelles -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Informations personnelles</h2>
            <button
              @click="editMode = !editMode"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              {{ editMode ? 'Annuler' : 'Modifier' }}
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
              <input
                v-if="editMode"
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Votre nom"
              />
              <p v-else class="text-gray-900 font-medium">{{ userInfo?.name || 'Non défini' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-if="editMode"
                v-model="form.email"
                type="email"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="votre@email.com"
              />
              <p v-else class="text-gray-900 font-medium">{{ userInfo?.email || 'Non défini' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
              <p class="text-gray-900 font-medium">
                {{ typeof userInfo?.role === 'object' && userInfo?.role?.name 
                  ? userInfo.role.name 
                  : (userInfo?.role || 'Non défini') }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Statut du compte</label>
              <span
                class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
                :class="userInfo?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ userInfo?.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>

            <div v-if="editMode" class="pt-4 border-t border-gray-200">
              <button
                @click="saveProfile"
                :disabled="saving"
                class="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Informations du partenaire -->
        <div v-if="partnerInfo" class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Informations du partenaire</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom du partenaire</label>
              <p class="text-gray-900 font-medium">{{ partnerInfo.name || 'Non défini' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email du partenaire</label>
              <p class="text-gray-900 font-medium">{{ partnerInfo.email || 'Non défini' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contact</label>
              <p class="text-gray-900 font-medium">{{ partnerInfo.contact_name || 'Non défini' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <p class="text-gray-900 font-medium">{{ partnerInfo.contact_phone || 'Non défini' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Statut du partenaire</label>
              <span
                class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
                :class="partnerInfo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ partnerInfo.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>

            <div v-if="partnerInfo.allocated_esims_count !== undefined">
              <label class="block text-sm font-medium text-gray-700 mb-2">eSIMs alloués</label>
              <p class="text-gray-900 font-medium">{{ partnerInfo.allocated_esims_count }} eSIM(s)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar avec statistiques -->
      <div class="space-y-6">
        <!-- Avatar / Photo de profil -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
          <div class="mb-4">
            <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold">
              {{ userInitials }}
            </div>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ userInfo?.name || 'Utilisateur' }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ userInfo?.email || '' }}</p>
          <button
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            @click="editMode = !editMode"
          >
            Changer la photo
          </button>
        </div>

        <!-- Statistiques rapides -->
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
          <h3 class="text-lg font-bold mb-4">Statistiques</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-primary-100">Commandes totales</span>
              <span class="font-bold">{{ stats.totalOrders || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-primary-100">eSIMs actifs</span>
              <span class="font-bold">{{ stats.activeEsims || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-primary-100">Revenus totaux</span>
              <span class="font-bold">{{ formatPrice(stats.totalRevenue || 0) }} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { authService } from '@/services/auth'
import { dashboard } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError } = useNotification()

const loading = ref(true)
const saving = ref(false)
const editMode = ref(false)
const userInfo = ref(null)
const partnerInfo = ref(null)
const stats = ref({
  totalOrders: 0,
  activeEsims: 0,
  totalRevenue: 0,
})

const form = ref({
  name: '',
  email: '',
})

const userInitials = computed(() => {
  if (userInfo.value?.name) {
    const names = userInfo.value.name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return userInfo.value.name.substring(0, 2).toUpperCase()
  }
  return 'U'
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price || 0)
}

const loadProfile = async () => {
  loading.value = true
  try {
    const user = authService.getCurrentUser()
    if (user) {
      userInfo.value = user
      form.value = {
        name: user.name || '',
        email: user.email || '',
      }

      // Charger les infos du partenaire si c'est un partenaire
      const userType = localStorage.getItem('auth_user_type') || 'admin'
      if (userType === 'partner' && user.partner_id) {
        // Charger les stats et infos partenaire depuis le dashboard
        try {
          const dashboardData = await dashboard.get()
          if (dashboardData.data?.partner) {
            partnerInfo.value = dashboardData.data.partner
          }
          if (dashboardData.data?.stats) {
            stats.value = {
              totalOrders: dashboardData.data.stats.total_orders || 0,
              activeEsims: dashboardData.data.stats.active_esims || 0,
              totalRevenue: dashboardData.data.stats.total_revenue || 0,
            }
          }
        } catch (error) {
          console.error('Erreur chargement stats:', error)
        }
      }
    }
  } catch (error) {
    console.error('Erreur chargement profil:', error)
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    // TODO: Implémenter l'API pour mettre à jour le profil
    // Simuler une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000))
    userInfo.value = { ...userInfo.value, ...form.value }
    editMode.value = false
    showSuccess('Profil mis à jour avec succès!')
  } catch (error) {
    console.error('Erreur sauvegarde profil:', error)
    showError('Erreur lors de la mise à jour du profil')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProfile()
  // Forcer le mode clair pour les partenaires
  const userType = localStorage.getItem('auth_user_type') || 'admin'
  if (userType === 'partner') {
    document.documentElement.classList.remove('dark')
  }
})
</script>

