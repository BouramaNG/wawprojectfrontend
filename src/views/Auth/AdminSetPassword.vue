<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo et Header -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <img
            src="@/assets/logo-waw-officiel.png"
            alt="WAW Telecom"
            class="h-20 w-auto"
            @error="handleImageError"
          />
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900">Définir votre mot de passe</h2>
        <p class="mt-2 text-sm text-gray-600">
          Bienvenue <span v-if="userData.name" class="font-semibold">{{ userData.name }}</span> !
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Veuillez définir un mot de passe sécurisé pour activer votre compte administrateur.
        </p>
      </div>

      <!-- Formulaire -->
      <div class="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              :value="userData.email"
              type="email"
              disabled
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Minimum 6 caractères"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 12m3.29-5.71L12 12" />
                </svg>
              </button>
            </div>
            <div class="mt-2">
              <div class="flex items-center space-x-2">
                <div
                  class="flex-1 h-2 rounded-full"
                  :class="passwordStrength >= 1 ? 'bg-red-500' : 'bg-gray-200'"
                ></div>
                <div
                  class="flex-1 h-2 rounded-full"
                  :class="passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-gray-200'"
                ></div>
                <div
                  class="flex-1 h-2 rounded-full"
                  :class="passwordStrength >= 3 ? 'bg-green-500' : 'bg-gray-200'"
                ></div>
              </div>
              <p class="mt-1 text-xs text-gray-500">{{ passwordStrengthText }}</p>
            </div>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="password_confirmation"
                v-model="passwordConfirmation"
                :type="showPasswordConfirmation ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                :class="{ 'border-red-500': passwordConfirmation && !passwordMatch }"
                placeholder="Confirmez votre mot de passe"
              />
              <button
                type="button"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="showPasswordConfirmation" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 12m3.29-5.71L12 12" />
                </svg>
              </button>
            </div>
            <p v-if="passwordConfirmation && !passwordMatch" class="mt-1 text-xs text-red-600">
              Les mots de passe ne correspondent pas
            </p>
          </div>

          <button
            type="submit"
            :disabled="!canSubmit || submitting"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="submitting" class="inline-block animate-spin mr-2">⏳</span>
            {{ submitting ? 'Définition en cours...' : 'Définir le mot de passe' }}
          </button>
        </form>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Vous avez déjà un compte ?
            <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError } = useNotification()

const route = useRoute()
const router = useRouter()

const token = ref('')
const userData = ref({ name: '', email: '' })
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const error = ref('')
const submitting = ref(false)

const passwordMatch = computed(() => {
  return password.value === passwordConfirmation.value
})

const passwordStrength = computed(() => {
  if (password.value.length === 0) return 0
  if (password.value.length < 6) return 1
  if (password.value.length < 10) return 2
  if (password.value.length >= 10 && /[A-Z]/.test(password.value) && /[0-9]/.test(password.value)) return 3
  return 2
})

const passwordStrengthText = computed(() => {
  if (password.value.length === 0) return ''
  if (password.value.length < 6) return 'Trop court (minimum 6 caractères)'
  if (passwordStrength.value === 2) return 'Moyen'
  if (passwordStrength.value === 3) return 'Fort'
  return 'Faible'
})

const canSubmit = computed(() => {
  return (
    password.value.length >= 6 &&
    passwordMatch.value &&
    !submitting.value
  )
})

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const validateToken = async () => {
  try {
    const response = await api.get('/admin-auth/validate-invitation', {
      params: { token: token.value },
    })

    if (response.data.success) {
      userData.value = response.data.data
    } else {
      error.value = response.data.message || 'Token invalide'
    }
  } catch (err) {
    console.error('Erreur validation token:', err)
    error.value = err.response?.data?.message || 'Erreur lors de la validation du token'
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  error.value = ''
  submitting.value = true

  try {
    const response = await api.post('/admin-auth/set-password', {
      token: token.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    if (response.data.success) {
      showSuccess('Mot de passe défini avec succès ! Vous pouvez maintenant vous connecter.')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      error.value = response.data.message || 'Erreur lors de la définition du mot de passe'
      showError(error.value)
    }
  } catch (err) {
    console.error('Erreur définition mot de passe:', err)
    error.value = err.response?.data?.message || 'Erreur lors de la définition du mot de passe'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  token.value = route.query.token

  if (!token.value) {
    error.value = 'Token d\'invitation manquant'
    return
  }

  await validateToken()
})
</script>

