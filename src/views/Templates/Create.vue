<template>
  <div>
    <div class="mb-6">
      <router-link
        to="/templates"
        class="text-primary-600 hover:text-primary-900 mb-4 inline-flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900 mt-2">Créer un Template</h1>
      <p class="text-gray-600 mt-1">Créez un nouveau template de package eSIM</p>
    </div>

    <form @submit.prevent="handleSubmit" class="card max-w-3xl">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nom du template <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ex: France 1GB - 30 jours"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Données (GB) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.data_gb"
              type="number"
              step="0.1"
              min="0.1"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Durée (jours) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.duration"
              type="number"
              min="1"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Pays supportés (ISO Alpha-3, séparés par des virgules) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.supported_countries"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ex: FRA,USA,ESP"
          />
          <p class="mt-1 text-sm text-gray-500">Séparez les codes pays par des virgules</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Description du template..."
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            v-model="form.notes"
            rows="2"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Notes internes..."
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <router-link
          to="/templates"
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
          Créer le template
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplatesStore } from '@/stores/templates'
import { useNotification } from '@/composables/useNotification'

const { showError } = useNotification()

const router = useRouter()
const store = useTemplatesStore()
const loading = ref(false)

const form = ref({
  name: '',
  data_gb: 1,
  duration: 30,
  supported_countries: '',
  description: '',
  notes: '',
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const data = {
      name: form.value.name,
      data_usage_allowance: form.value.data_gb,
      data_unit: 'GB',
      duration: form.value.duration,
      duration_unit: 'days',
      supported_countries: form.value.supported_countries.split(',').map(c => c.trim().toUpperCase()),
      description: form.value.description,
      notes: form.value.notes,
    }

    await store.create(data)
    router.push('/templates')
  } catch (error) {
    console.error('Erreur création template:', error)
    showError('Erreur lors de la création du template')
  } finally {
    loading.value = false
  }
}
</script>
