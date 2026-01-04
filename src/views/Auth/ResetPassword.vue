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
        <h2 class="text-3xl font-extrabold text-gray-900">Réinitialiser votre mot de passe</h2>
        <p class="mt-2 text-sm text-gray-600">
          Définissez un nouveau mot de passe sécurisé pour votre compte.
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
              :value="email"
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
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="8"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-12"
                placeholder="Minimum 8 caractères"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                :type="showPasswordConfirmation ? 'text' : 'password'"
                required
                minlength="8"
                class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-12"
                :class="passwordMatch ? 'border-gray-200' : 'border-red-300'"
                placeholder="Confirmez votre mot de passe"
              />
              <button
                type="button"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPasswordConfirmation" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="!passwordMatch && form.password_confirmation" class="text-xs text-red-600 mt-1">
              Les mots de passe ne correspondent pas
            </p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="!canSubmit || loading"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              <span v-if="loading" class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
              {{ loading ? 'Réinitialisation en cours...' : 'Réinitialiser mon mot de passe' }}
            </button>
          </div>
        </form>

        <div class="text-center">
          <router-link
            to="/login"
            class="text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            ← Retour à la connexion
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const token = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const form = ref({
  password: '',
  password_confirmation: '',
})

const passwordMatch = computed(() => {
  if (!form.value.password_confirmation) return true
  return form.value.password === form.value.password_confirmation
})

const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return 0
  if (password.length < 8) return 1
  if (password.length < 12) return 2
  if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) return 3
  return 2
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return { text: '', color: 'text-gray-600' }
  if (strength === 1) return { text: 'Faible', color: 'text-red-600' }
  if (strength === 2) return { text: 'Moyen', color: 'text-yellow-600' }
  return { text: 'Fort', color: 'text-green-600' }
})

const canSubmit = computed(() => {
  return (
    form.value.password &&
    form.value.password_confirmation &&
    passwordMatch.value &&
    form.value.password.length >= 8 &&
    token.value &&
    email.value
  )
})

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  loading.value = true
  error.value = ''

  try {
    const response = await api.post('/partner-auth/reset-password', {
      email: email.value,
      token: token.value,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    })

    if (response.data.success) {
      // Rediriger vers la page de connexion avec un message de succès
      router.push({
        name: 'login',
        query: { message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.' },
      })
    } else {
      error.value = response.data.message || 'Erreur lors de la réinitialisation du mot de passe'
    }
  } catch (err) {
    console.error('Erreur reset password:', err)
    error.value = err.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  token.value = route.query.token || ''
  email.value = route.query.email || ''
  
  if (!token.value || !email.value) {
    error.value = 'Token ou email manquant dans l\'URL'
  }
})
</script>

