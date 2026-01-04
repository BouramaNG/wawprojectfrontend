<template>
  <div>
    <div class="mb-6">
      <router-link
        to="/partners"
        class="text-primary-600 hover:text-primary-900 mb-4 inline-flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900 mt-2">Créer un Partenaire</h1>
      <p class="text-gray-600 mt-1">Ajoutez un nouveau partenaire API</p>
    </div>

    <form @submit.prevent="handleSubmit" class="card max-w-2xl">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nom <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ex: Hayo.sn"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="contact@partenaire.com"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom du contact
            </label>
            <input
              v-model="form.contact_name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              v-model="form.contact_phone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label class="flex items-center">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="ml-2 text-sm text-gray-700">Partenaire actif</span>
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nombre d'eSIMs à attribuer
          </label>
          <input
            v-model.number="form.allocated_esims_count"
            type="number"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ex: 10"
          />
          <p class="mt-1 text-xs text-gray-500">Le système réservera automatiquement ce nombre d'eSIMs en "pre-service" pour ce partenaire</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Packages autorisés
          </label>
          <div v-if="loadingTemplates" class="text-sm text-gray-500">Chargement des packages...</div>
          <div v-else-if="templates.length === 0" class="text-sm text-gray-500">Aucun package disponible</div>
          <div v-else class="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
            <label
              v-for="template in templates"
              :key="template.id"
              class="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                v-model="form.package_template_ids"
                type="checkbox"
                :value="template.id"
                class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900">
                  {{ template.name || template.plan_name || 'Package #' + template.id }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ template.country || template.country_name || template.country_code || 'N/A' }} - 
                  {{ getDataLimit(template) }} - 
                  {{ getValidityDays(template) }}
                </div>
              </div>
            </label>
          </div>
          <p class="mt-1 text-xs text-gray-500">Sélectionnez les packages que ce partenaire pourra voir dans son dashboard</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Notes internes..."
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <router-link
          to="/partners"
          class="btn-secondary"
        >
          Annuler
        </router-link>
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="inline-block animate-spin mr-2">⏳</span>
          Créer le partenaire
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { partners as partnersApi, templates as templatesApi } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showError } = useNotification()

// Forcer le mode clair sur cette page
onMounted(() => {
  document.documentElement.classList.remove('dark')
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

const router = useRouter()
const loading = ref(false)
const loadingTemplates = ref(false)
const templates = ref([])

const form = ref({
  name: '',
  email: '',
  contact_name: '',
  contact_phone: '',
  is_active: true,
  allocated_esims_count: 0,
  package_template_ids: [],
  notes: '',
})

const loadTemplates = async () => {
  loadingTemplates.value = true
  try {
    const response = await templatesApi.list({ per_page: 1000 })
    if (response.data.success) {
      templates.value = response.data.templates || response.data.data || []
    }
  } catch (error) {
    console.error('Erreur chargement templates:', error)
  } finally {
    loadingTemplates.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const data = {
      ...form.value,
      // Convertir le tableau en format attendu par le backend
      package_template_ids: form.value.package_template_ids.length > 0 
        ? form.value.package_template_ids 
        : undefined,
    }
    await partnersApi.create(data)
    router.push('/partners')
  } catch (error) {
    console.error('Erreur création partenaire:', error)
    showError(error.response?.data?.message || 'Erreur lors de la création du partenaire')
  } finally {
    loading.value = false
  }
}

// Fonction pour obtenir la limite de données (convertir MB en GB si nécessaire)
const getDataLimit = (template) => {
  if (template.data_limit) {
    return template.data_limit + ' GB'
  }
  if (template.data_mb) {
    const gb = (template.data_mb / 1024).toFixed(2)
    return gb + ' GB'
  }
  return 'N/A'
}

// Fonction pour obtenir la validité en jours
const getValidityDays = (template) => {
  // Essayer validity_days d'abord (format transformé)
  if (template.validity_days !== null && template.validity_days !== undefined && template.validity_days !== 0) {
    return template.validity_days + ' jours'
  }
  // Sinon essayer duration_days (format original)
  if (template.duration_days !== null && template.duration_days !== undefined && template.duration_days !== 0) {
    return template.duration_days + ' jours'
  }
  // Si aucune valeur, afficher "Non spécifié" au lieu de "N/A"
  return 'Non spécifié'
}

onMounted(() => {
  loadTemplates()
})
</script>
