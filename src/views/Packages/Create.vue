<template>
  <div>
    <div class="mb-6">
      <router-link
        to="/packages"
        class="text-primary-600 hover:text-primary-900 mb-4 inline-flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900 mt-2">Activer un Package</h1>
      <p class="text-gray-600 mt-1">Activez une eSIM avec un template</p>
    </div>

    <form @submit.prevent="handleSubmit" class="card max-w-2xl">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ICCID de l'eSIM <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.iccid"
            type="text"
            required
            pattern="[0-9]{18,20}"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="89012601234567890123"
          />
          <p class="mt-1 text-sm text-gray-500">18 à 20 chiffres</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Template <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.template_id"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Sélectionner un template</option>
            <option
              v-for="template in templates"
              :key="template.id"
              :value="template.id"
            >
              {{ template.name || 'Template ' + template.id }} - {{ template.country_code || 'N/A' }} - {{ formatData(template.data_mb) || 'N/A' }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <router-link
          to="/packages"
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
          Activer le package
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { packages as packagesApi, templates as templatesApi } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError } = useNotification()

const router = useRouter()
const loading = ref(false)
const templates = ref([])

const form = ref({
  iccid: '',
  template_id: '',
})

const formatData = (mb) => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`
  }
  return `${mb} MB`
}

const loadTemplates = async () => {
  try {
    const response = await templatesApi.list({ status: 'Active' })
    const data = response.data
    // L'API retourne {success: true, templates: [...], pagination: {...}}
    templates.value = data.templates || data.data || []
  } catch (error) {
    console.error('Erreur chargement templates:', error)
    templates.value = []
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await packagesApi.create(form.value)
    if (response.data.success) {
      showSuccess('Package activé avec succès !')
      router.push('/packages')
    } else {
      showError(response.data.message || 'Erreur lors de l\'activation du package')
    }
  } catch (error) {
    console.error('Erreur création package:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'activation du package'
    showError(errorMessage)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTemplates()
})
</script>
