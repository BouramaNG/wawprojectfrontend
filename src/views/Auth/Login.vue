<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo / Titre -->
      <div class="text-center">
        <div class="mb-4 flex justify-center">
          <img
            :src="logoUrl"
            alt="WAW Logo"
            class="h-20 w-auto object-contain"
            @error="handleImageError"
          />
        </div>
        <h1 class="text-4xl font-bold text-primary-600 mb-2">WAW TELECOM</h1>
        <p class="text-gray-600">Connectez-vous à votre tableau de bord</p>
      </div>

      <!-- Formulaire -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Message d'erreur -->
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {{ error }}
          </div>

          <!-- Email -->
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="admin@waw.com"
              :disabled="loading"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="••••••••"
              :disabled="loading"
            />
          </div>

          <!-- Options -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="loading"
              />
              <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            <router-link to="/partner/forgot-password" class="text-sm text-primary-600 hover:text-primary-800">
              Mot de passe oublié ?
            </router-link>
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
          >
            <span v-if="loading" class="inline-block animate-spin mr-2">⏳</span>
            <span v-else>Se connecter</span>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-600">
        © 2025 WAW. Tous droits réservés.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'
import logoImage from '@/assets/logo-waw-officiel.png'

const logoUrl = computed(() => logoImage)

const router = useRouter()

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')
const rememberMe = ref(false)

// Rediriger si déjà connecté
onMounted(() => {
  if (authService.isAuthenticated()) {
    router.push('/')
  }
})

const handleImageError = (event) => {
  // Si l'image ne charge pas, masquer l'erreur et continuer
  event.target.style.display = 'none'
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await authService.login(form.value.email, form.value.password)

    if (result.success) {
      // Stocker le type d'utilisateur immédiatement
      if (result.user_type) {
        localStorage.setItem('auth_user_type', result.user_type)
      }
      
      // Pour les utilisateurs partenaires, ne pas appeler fetchCurrentUser immédiatement
      // car ils utilisent un endpoint différent et le token Sanctum
      if (result.user_type === 'partner') {
        // Rediriger directement pour les partenaires
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push('/')
      } else {
        // Pour les admins, récupérer les infos complètes
        await authService.fetchCurrentUser()
        
        // Petit délai pour s'assurer que tout est stocké
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Rediriger vers le dashboard
        router.push('/')
      }
    } else {
      error.value = result.error || 'Erreur de connexion. Vérifiez vos identifiants.'
    }
  } catch (err) {
    console.error('[LOGIN_VUE] Exception lors de la connexion', err)
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

