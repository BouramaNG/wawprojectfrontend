<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">⚙️ Paramètres</h1>
      <p class="text-gray-600">Gérez vos préférences et la configuration de votre compte</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Chargement des paramètres...</p>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Changement de mot de passe -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">🔒 Sécurité - Mot de passe</h2>
        <p class="text-sm text-gray-600 mb-6">Modifiez votre mot de passe pour sécuriser votre compte</p>

        <form @submit.prevent="changePassword" class="space-y-4 max-w-2xl">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
            <div class="relative">
              <input
                v-model="passwordForm.current_password"
                :type="showCurrentPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-12"
                placeholder="Entrez votre mot de passe actuel"
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
            <div class="relative">
              <input
                v-model="passwordForm.new_password"
                :type="showNewPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-12"
                placeholder="Entrez votre nouveau mot de passe (min. 6 caractères)"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <div class="mt-2">
              <div class="flex items-center space-x-2 text-xs text-gray-600">
                <div
                  class="h-1 flex-1 rounded-full"
                  :class="passwordStrength >= 1 ? 'bg-red-500' : 'bg-gray-200'"
                ></div>
                <div
                  class="h-1 flex-1 rounded-full"
                  :class="passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-gray-200'"
                ></div>
                <div
                  class="h-1 flex-1 rounded-full"
                  :class="passwordStrength >= 3 ? 'bg-green-500' : 'bg-gray-200'"
                ></div>
              </div>
              <p class="text-xs mt-1" :class="passwordStrengthText.color">
                {{ passwordStrengthText.text }}
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
            <div class="relative">
              <input
                v-model="passwordForm.new_password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-12"
                :class="passwordMatch ? 'border-gray-200' : 'border-red-300'"
                placeholder="Confirmez votre nouveau mot de passe"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="!passwordMatch && passwordForm.new_password_confirmation" class="text-xs text-red-600 mt-1">
              Les mots de passe ne correspondent pas
            </p>
          </div>

          <div class="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              :disabled="!canChangePassword || changingPassword"
              class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span v-if="changingPassword" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              <span>{{ changingPassword ? 'Changement en cours...' : 'Changer le mot de passe' }}</span>
            </button>
            <button
              type="button"
              @click="resetPasswordForm"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Clés API -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900">🔑 Clés API</h2>
            <p class="text-sm text-gray-600 mt-1">Gérez vos clés API pour l'intégration</p>
          </div>
          <button
            @click="showApiKeyModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            + Nouvelle clé
          </button>
        </div>

        <div v-if="apiKeys.length === 0" class="text-center py-8">
          <div class="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <p class="text-gray-600">Aucune clé API configurée</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="key in apiKeys"
            :key="key.id"
            class="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="font-semibold text-gray-900">{{ key.name || 'Clé API' }}</h3>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="key.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ key.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-600">API Key:</span>
                    <code class="text-sm bg-gray-100 px-2 py-1 rounded font-mono">{{ key.api_key }}</code>
                    <button
                      @click="copyToClipboard(key.api_key)"
                      class="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      📋 Copier
                    </button>
                  </div>
                  <div v-if="key.last_used_at" class="text-xs text-gray-500">
                    Dernière utilisation: {{ formatDate(key.last_used_at) }}
                  </div>
                  <div v-if="key.expires_at" class="text-xs text-gray-500">
                    Expire le: {{ formatDate(key.expires_at) }}
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="toggleApiKey(key.id, !key.is_active)"
                  class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                  :class="key.is_active 
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'"
                >
                  {{ key.is_active ? 'Désactiver' : 'Activer' }}
                </button>
                <button
                  @click="deleteApiKey(key.id)"
                  class="px-3 py-1.5 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions API -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">🔐 Permissions API</h2>
        <p class="text-sm text-gray-600 mb-4">Gérez les permissions de vos clés API</p>

        <div v-if="apiKeys.length > 0" class="space-y-3">
          <div
            v-for="key in apiKeys"
            :key="key.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <h3 class="font-semibold text-gray-900 mb-3">{{ key.name || 'Clé API' }}</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="permission in (key.permissions || [])"
                :key="permission"
                class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium"
              >
                {{ permission }}
              </span>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600 text-sm">Aucune clé API configurée</p>
      </div>

      <!-- Préférences -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">🎨 Préférences</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900">Notifications par email</label>
              <p class="text-xs text-gray-600">Recevoir des notifications par email</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="preferences.emailNotifications"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900">Notifications de commandes</label>
              <p class="text-xs text-gray-600">Être notifié lors de nouvelles commandes</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="preferences.orderNotifications"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <button
            @click="savePreferences"
            :disabled="saving"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Enregistrement...' : 'Enregistrer les préférences' }}
          </button>
        </div>
      </div>

      <!-- Documentation API -->
      <div class="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">📚 Documentation API</h2>
            <p class="text-sm text-gray-600">Consultez la documentation complète de l'API</p>
          </div>
          <router-link
            to="/api-documentation"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Voir la documentation
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal pour nouvelle clé API -->
    <div
      v-if="showApiKeyModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showApiKeyModal = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-900 mb-4">Créer une nouvelle clé API</h3>
        <p class="text-sm text-gray-600 mb-4">
          Pour créer une nouvelle clé API, veuillez contacter votre administrateur.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showApiKeyModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal pour les messages -->
    <NotificationModal
      :show="showModal"
      :type="modalType"
      :title="modalTitle"
      :message="modalMessage"
      @update:show="showModal = $event"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { authService } from '@/services/auth'
import api, { dashboard } from '@/services/api'
import NotificationModal from '@/components/common/NotificationModal.vue'
import { useNotification } from '@/composables/useNotification'

const { showInfo, showWarning } = useNotification()

const loading = ref(true)
const saving = ref(false)
const changingPassword = ref(false)
const showApiKeyModal = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showModal = ref(false)
const modalType = ref('info')
const modalTitle = ref('Notification')
const modalMessage = ref('')
const apiKeys = ref([])
const preferences = ref({
  emailNotifications: true,
  orderNotifications: true,
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
})

const passwordMatch = computed(() => {
  if (!passwordForm.value.new_password_confirmation) return true
  return passwordForm.value.new_password === passwordForm.value.new_password_confirmation
})

const passwordStrength = computed(() => {
  const password = passwordForm.value.new_password
  if (!password) return 0
  if (password.length < 6) return 1
  if (password.length < 8) return 2
  if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 3
  return 2
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return { text: '', color: 'text-gray-600' }
  if (strength === 1) return { text: 'Faible', color: 'text-red-600' }
  if (strength === 2) return { text: 'Moyen', color: 'text-yellow-600' }
  return { text: 'Fort', color: 'text-green-600' }
})

const canChangePassword = computed(() => {
  return (
    passwordForm.value.current_password &&
    passwordForm.value.new_password &&
    passwordForm.value.new_password_confirmation &&
    passwordMatch.value &&
    passwordForm.value.new_password.length >= 6
  )
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const showNotification = (type, title, message) => {
  modalType.value = type
  modalTitle.value = title
  modalMessage.value = message
  showModal.value = true
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showNotification('success', 'Succès', 'Clé API copiée dans le presse-papiers!')
  } catch (error) {
    console.error('Erreur copie:', error)
    showNotification('error', 'Erreur', 'Impossible de copier la clé API')
  }
}

const loadSettings = async () => {
  try {
    loading.value = true
    const user = authService.getCurrentUser()
    const userType = localStorage.getItem('auth_user_type') || 'admin'

    if (userType === 'partner' && user?.partner_id) {
      // Charger les clés API du partenaire
      try {
        const dashboardData = await dashboard.get()
        if (dashboardData?.data?.partner?.api_keys) {
          apiKeys.value = dashboardData.data.partner.api_keys
        }
      } catch (error) {
        console.error('Erreur chargement clés API:', error)
        // Ne pas bloquer le chargement si l'API échoue
      }
    }

    // Charger les préférences depuis localStorage
    try {
      const savedPrefs = localStorage.getItem('partner_preferences')
      if (savedPrefs) {
        preferences.value = { ...preferences.value, ...JSON.parse(savedPrefs) }
      }
    } catch (error) {
      console.error('Erreur chargement préférences:', error)
    }
  } catch (error) {
    console.error('Erreur chargement paramètres:', error)
  } finally {
    // Toujours mettre loading à false, même en cas d'erreur
    loading.value = false
  }
}

const savePreferences = async () => {
  saving.value = true
  try {
    localStorage.setItem('partner_preferences', JSON.stringify(preferences.value))
    await new Promise(resolve => setTimeout(resolve, 500))
    showNotification('success', 'Succès', 'Préférences enregistrées avec succès!')
  } catch (error) {
    console.error('Erreur sauvegarde préférences:', error)
    showNotification('error', 'Erreur', 'Erreur lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

const toggleApiKey = async (keyId, isActive) => {
  // TODO: Implémenter l'API pour activer/désactiver une clé
  console.log('Toggle API key:', keyId, isActive)
  showInfo('Fonctionnalité à implémenter: contactez votre administrateur')
}

const deleteApiKey = async (keyId) => {
  showWarning(
    'Êtes-vous sûr de vouloir supprimer cette clé API ?',
    {
      title: 'Confirmation de suppression',
      showCancel: true,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: () => {
        // TODO: Implémenter l'API pour supprimer une clé
        console.log('Delete API key:', keyId)
        showInfo('Fonctionnalité à implémenter: contactez votre administrateur')
      },
    }
  )
}

const changePassword = async () => {
  if (!canChangePassword.value) return

  changingPassword.value = true
  try {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    let endpoint = '/change-password'
    
    // Utiliser l'endpoint approprié selon le type d'utilisateur
    if (userType === 'partner') {
      endpoint = '/partner-auth/change-password'
    }

    const response = await api.post(endpoint, {
      current_password: passwordForm.value.current_password,
      new_password: passwordForm.value.new_password,
      new_password_confirmation: passwordForm.value.new_password_confirmation,
    })

    if (response.data.success) {
      showNotification('success', 'Succès', 'Mot de passe modifié avec succès!')
      resetPasswordForm()
    } else {
      throw new Error(response.data.message || 'Erreur lors du changement de mot de passe')
    }
  } catch (error) {
    console.error('Erreur changement mot de passe:', error)
    
    let errorMessage = 'Erreur lors du changement de mot de passe. Veuillez contacter votre administrateur.'
    
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      
      if (status === 401) {
        errorMessage = 'Le mot de passe actuel est incorrect'
      } else if (status === 422) {
        errorMessage = data.message || 'Veuillez vérifier que les mots de passe correspondent et respectent les critères (min. 6 caractères)'
      } else if (status === 404) {
        errorMessage = 'Endpoint non trouvé. Veuillez contacter votre administrateur.'
      } else if (data && data.message) {
        errorMessage = data.message
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    
    showNotification('error', 'Erreur', errorMessage)
  } finally {
    changingPassword.value = false
  }
}

const resetPasswordForm = () => {
  passwordForm.value = {
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  }
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

onMounted(async () => {
  // Forcer le mode clair pour les partenaires
  const userType = localStorage.getItem('auth_user_type') || 'admin'
  if (userType === 'partner') {
    document.documentElement.classList.remove('dark')
  }
  
  // Charger les paramètres
  await loadSettings()
  
  // Fallback: s'assurer que loading est à false après un délai
  setTimeout(() => {
    if (loading.value) {
      console.warn('[SETTINGS] Timeout - Forcer loading à false')
      loading.value = false
    }
  }, 5000)
})
</script>

