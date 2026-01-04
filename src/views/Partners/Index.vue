<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Partenaires</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Gestion des partenaires API</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <router-link
          to="/partners/api-docs"
          class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Documentation API
        </router-link>
        <router-link
          to="/partners/create"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau Partenaire
        </router-link>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="card">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom, email, ID..."
          class="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
          @input="debouncedSearch"
        />
        <svg
          class="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>

      <DataTable
        v-else
        :columns="columns"
        :data="partners"
        :pagination="pagination"
        :actions="true"
        @page-change="handlePageChange"
      >
        <template #cell-is_active="{ value }">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': value,
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': !value
            }"
          >
            <span
              class="w-1.5 h-1.5 rounded-full mr-1.5"
              :class="{
                'bg-green-500': value,
                'bg-gray-400': !value
              }"
            ></span>
            {{ value ? 'Actif' : 'Inactif' }}
          </span>
        </template>

        <template #cell-created_at="{ value }">
          <span class="text-gray-900 dark:text-gray-100">
            {{ formatDate(value) }}
          </span>
        </template>

        <template #actions="{ item }">
          <div class="flex items-center justify-end space-x-3">
            <router-link
              :to="`/partners/${item.id}`"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Voir
            </router-link>
            <button
              @click="showApiKeyModal(item)"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Clés API
            </button>
            <button
              @click="handleDelete(item)"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

    <!-- Modal Génération Clé API -->
    <Modal
      v-model="showModal"
      :title="`Générer une clé API - ${selectedPartner?.name}`"
    >
      <form @submit.prevent="handleGenerateApiKey">
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom de la clé
            </label>
            <input
              v-model="apiKeyForm.name"
              type="text"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
              placeholder="Ex: Production, Staging, Development"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Donnez un nom descriptif à cette clé API</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date d'expiration (optionnel)
            </label>
            <input
              v-model="apiKeyForm.expires_at"
              type="date"
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Laissez vide pour une clé sans expiration</p>
          </div>
          
          <!-- Permissions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Permissions d'accès
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Sélectionnez les ressources auxquelles cette clé API aura accès. Laissez vide pour un accès complet.
            </p>
            <div class="space-y-2">
              <label class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  v-model="apiKeyForm.permissions"
                  type="checkbox"
                  value="templates"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <div class="ml-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Templates</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Accès à la liste des templates de packages</p>
                </div>
              </label>
              <label class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  v-model="apiKeyForm.permissions"
                  type="checkbox"
                  value="packages"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <div class="ml-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Packages</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Accès aux packages activés</p>
                </div>
              </label>
              <label class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  v-model="apiKeyForm.permissions"
                  type="checkbox"
                  value="esims"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <div class="ml-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">eSIMs</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Accès aux eSIMs disponibles</p>
                </div>
              </label>
              <label class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  v-model="apiKeyForm.permissions"
                  type="checkbox"
                  value="orders"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <div class="ml-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Commandes</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Créer et consulter les commandes</p>
                </div>
              </label>
              <label class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  v-model="apiKeyForm.permissions"
                  type="checkbox"
                  value="prices"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <div class="ml-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Prix</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Accès aux informations de prix</p>
                </div>
              </label>
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
              💡 Astuce : Ne sélectionnez aucune permission pour donner un accès complet à toutes les ressources.
            </p>
          </div>
        </div>

        <!-- Affichage des credentials -->
        <div v-if="newApiKey" class="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div class="flex items-start mb-4">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-sm font-semibold text-yellow-800 dark:text-yellow-200">⚠️ Conservez ces informations en sécurité !</p>
          </div>
          <p class="text-xs text-yellow-700 dark:text-yellow-300 mb-4">Le secret ne sera plus visible après la fermeture de cette fenêtre.</p>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-2">API Key:</label>
              <div class="flex items-center space-x-2">
                <input
                  :value="newApiKey.api_key"
                  readonly
                  class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  @click="copyToClipboard(newApiKey.api_key)"
                  class="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copier
                </button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-2">API Secret:</label>
              <div class="flex items-center space-x-2">
                <input
                  :value="newApiKey.api_secret"
                  readonly
                  type="password"
                  class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  @click="copyToClipboard(newApiKey.api_secret)"
                  class="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copier
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex items-center justify-end space-x-3">
          <button
            type="button"
            @click="showModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Fermer
          </button>
          <button
            type="button"
            @click="handleGenerateApiKey"
            :disabled="generating"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg v-if="generating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else class="mr-2">🔑</span>
            {{ generating ? 'Génération...' : 'Générer la clé' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { partners as partnersApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import DataTable from '@/components/common/DataTable.vue'
import Modal from '@/components/common/Modal.vue'
import { useDebounce } from '@/composables/useDebounce'

// Forcer le mode clair sur cette page
onMounted(() => {
  document.documentElement.classList.remove('dark')
  loadPartners()
})

onUnmounted(() => {
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
})

const { success, error: showError } = useToast()

const loading = ref(false)
const partners = ref([])
const pagination = ref(null)
const showModal = ref(false)
const selectedPartner = ref(null)
const generating = ref(false)
const newApiKey = ref(null)
const searchQuery = ref('')

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Nom', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'is_active', label: 'Statut', sortable: true },
  { key: 'created_at', label: 'Créé le', sortable: true },
]

const handlePageChange = async (page) => {
  await loadPartners(page)
}

const loadPartners = async (page = 1) => {
  loading.value = true
  try {
    const params = { page }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    const response = await partnersApi.list(params)
    const data = response.data
    // L'API retourne {success: true, partners: [...], pagination: {...}}
    partners.value = data.partners || data.data || []
    pagination.value = data.pagination || null
  } catch (error) {
    console.error('Erreur chargement partenaires:', error)
    partners.value = []
  } finally {
    loading.value = false
  }
}

const apiKeyForm = ref({
  name: 'Default',
  expires_at: '',
  permissions: [],
})

const showApiKeyModal = (partner) => {
  selectedPartner.value = partner
  showModal.value = true
  newApiKey.value = null
  apiKeyForm.value = { name: 'Default', expires_at: '', permissions: [] }
}

const handleGenerateApiKey = async () => {
  generating.value = true
  try {
    const data = {
      name: apiKeyForm.value.name,
      expires_at: apiKeyForm.value.expires_at || null,
      permissions: apiKeyForm.value.permissions.length > 0 ? apiKeyForm.value.permissions : null,
    }
    const response = await partnersApi.generateApiKey(selectedPartner.value.id, data)
    newApiKey.value = response.data.data
    success('Clé API générée avec succès !')
  } catch (err) {
    console.error('Erreur génération clé API:', err)
    showError(err.response?.data?.message || 'Erreur lors de la génération de la clé API')
  } finally {
    generating.value = false
  }
}

const handleDelete = async (partner) => {
  if (!confirm(`⚠️ ATTENTION : Suppression définitive\n\nÊtes-vous sûr de vouloir supprimer le partenaire "${partner.name}" ?\n\nCette action supprimera TOUTES les données associées :\n- Tous les utilisateurs partenaires\n- Toutes les commandes\n- Toutes les eSIMs (seront libérées)\n- Toutes les clés API\n- Tous les packages autorisés\n\nCette action est IRRÉVERSIBLE !`)) {
    return
  }

  try {
    const response = await partnersApi.delete(partner.id)
    if (response.data.success) {
      const summary = response.data.summary || {}
      let message = 'Partenaire supprimé avec succès !'
      if (Object.keys(summary).length > 0) {
        const details = []
        if (summary.users_deleted > 0) details.push(`${summary.users_deleted} utilisateur(s)`)
        if (summary.orders_deleted > 0) details.push(`${summary.orders_deleted} commande(s)`)
        if (summary.esims_freed > 0) details.push(`${summary.esims_freed} eSIM(s) libérée(s)`)
        if (summary.api_keys_deleted > 0) details.push(`${summary.api_keys_deleted} clé(s) API`)
        if (summary.packages_detached > 0) details.push(`${summary.packages_detached} package(s)`)
        if (details.length > 0) {
          message += `\n\nDonnées supprimées : ${details.join(', ')}`
        }
      }
      success(message)
      await loadPartners(pagination.value?.current_page || 1)
    } else {
      showError(response.data.message || 'Erreur lors de la suppression')
    }
  } catch (err) {
    console.error('Erreur suppression partenaire:', err)
    const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression du partenaire'
    showError(errorMessage)
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    success('Copié dans le presse-papiers !')
  } catch (err) {
    console.error('Erreur copie:', err)
    showError('Erreur lors de la copie')
  }
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

const { debouncedFn: debouncedSearch } = useDebounce(() => {
  loadPartners(1)
}, 500)

const clearSearch = () => {
  searchQuery.value = ''
  loadPartners(1)
}

</script>
