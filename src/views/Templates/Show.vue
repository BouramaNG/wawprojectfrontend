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
      <h1 class="text-3xl font-bold text-gray-900 mt-2">Détails Template</h1>
    </div>

    <div v-if="store.loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="template" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
          <dl class="grid grid-cols-1 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Nom</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ template.name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Pays</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ template.country_code }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Données</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatData(template.data_mb) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Durée</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ template.duration_days }} jours</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Statut</dt>
              <dd class="mt-1">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': template.status === 'Active',
                    'bg-gray-100 text-gray-800': template.status !== 'Active'
                  }"
                >
                  {{ template.status }}
                </span>
              </dd>
            </div>
            <div v-if="template.description">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ template.description }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div class="space-y-3">
            <button
              @click="handleToggleStatus"
              class="w-full btn-secondary"
            >
              {{ template.status === 'Active' ? 'Désactiver' : 'Activer' }}
            </button>
            <router-link
              :to="`/templates/${template.id}/edit`"
              class="block w-full text-center btn-primary"
            >
              Modifier
            </router-link>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations techniques</h2>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-500">ID Telna</dt>
              <dd class="text-gray-900">{{ template.telna_id || '-' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Créé le</dt>
              <dd class="text-gray-900">{{ formatDate(template.created_at) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Modifié le</dt>
              <dd class="text-gray-900">{{ formatDate(template.updated_at) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemplatesStore } from '@/stores/templates'
import { templates } from '@/services/api'

const route = useRoute()
const router = useRouter()
const store = useTemplatesStore()
const template = ref(null)

const formatData = (mb) => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`
  }
  return `${mb} MB`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

const handleToggleStatus = async () => {
  try {
    await templates.toggleStatus(template.value.id)
    await loadTemplate()
  } catch (error) {
    console.error('Erreur changement statut:', error)
  }
}

const loadTemplate = async () => {
  try {
    template.value = await store.fetchOne(route.params.id)
  } catch (error) {
    console.error('Erreur chargement template:', error)
  }
}

onMounted(() => {
  loadTemplate()
})
</script>
