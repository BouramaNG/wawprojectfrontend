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
        <h2 class="text-3xl font-extrabold text-gray-900">Mot de passe oublié ?</h2>
        <p class="mt-2 text-sm text-gray-600">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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

        <div v-if="success" class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">{{ success }}</p>
            </div>
          </div>
        </div>

        <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="votre@email.com"
              :disabled="loading"
            />
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading || !form.email"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              <span v-if="loading" class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
              {{ loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
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

      <div class="text-center">
        <p class="text-xs text-gray-500">
          Le lien de réinitialisation expire dans 60 minutes.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const form = ref({
  email: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const handleSubmit = async () => {
  if (!form.value.email) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await api.post('/partner-auth/forgot-password', {
      email: form.value.email,
    })

    if (response.data.success) {
      success.value = response.data.message || 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé. Vérifiez votre boîte de réception.'
    } else {
      error.value = response.data.message || 'Erreur lors de l\'envoi de l\'email'
    }
  } catch (err) {
    console.error('Erreur forgot password:', err)
    error.value = err.response?.data?.message || 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

