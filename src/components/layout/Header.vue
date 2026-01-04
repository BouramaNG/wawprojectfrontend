<template>
  <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between h-16 px-6">
      <div class="flex items-center space-x-3 lg:hidden">
        <img
          :src="logoUrl"
          alt="WAW Logo"
          class="h-8 w-auto object-contain"
          @error="handleImageError"
        />
      </div>
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="flex-1 max-w-xl mx-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg
            class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :title="isDarkMode ? 'Mode clair' : 'Mode sombre'"
        >
          <svg v-if="!isDarkMode" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span v-if="notificationsCount > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- Menu Profil -->
        <div class="relative" ref="profileMenuRef" @click.stop>
          <button
            @click="showProfileMenu = !showProfileMenu"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {{ userInitials }}
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ userName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ userRole }}</p>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showProfileMenu"
            class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <div class="px-4 py-3 border-b border-gray-200">
              <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ currentUser?.email }}</p>
              <p class="text-xs text-primary-600 mt-1">{{ userRole }}</p>
            </div>
            <router-link
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="showProfileMenu = false"
            >
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mon profil
              </div>
            </router-link>
            <router-link
              to="/settings"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="showProfileMenu = false"
            >
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres
              </div>
            </router-link>
            <div class="border-t border-gray-200 my-2"></div>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'
import logoImage from '@/assets/logo-waw-officiel.png'

const logoUrl = computed(() => logoImage)

const router = useRouter()
const showProfileMenu = ref(false)
const profileMenuRef = ref(null)
const currentUser = ref(null)
const notificationsCount = ref(0)

const userName = computed(() => {
  if (currentUser.value) {
    return currentUser.value.name || 'Utilisateur'
  }
  return 'Utilisateur'
})

const userInitials = computed(() => {
  if (currentUser.value?.name) {
    const names = currentUser.value.name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return currentUser.value.name.substring(0, 2).toUpperCase()
  }
  return 'U'
})

const userRole = computed(() => {
  if (currentUser.value?.role) {
    const roleName = currentUser.value.role.name || currentUser.value.role
    return roleName.charAt(0).toUpperCase() + roleName.slice(1)
  }
  return 'Utilisateur'
})

const closeProfileMenu = (event) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(event.target)) {
    showProfileMenu.value = false
  }
}

const handleLogout = async () => {
  try {
    showProfileMenu.value = false
    // Déconnexion (nettoie le localStorage)
    await authService.logout()
    // Forcer la redirection vers login
    await router.push('/login')
    // Recharger la page pour s'assurer que tout est nettoyé
    window.location.href = '/login'
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    // En cas d'erreur, forcer le nettoyage et la redirection
    authService.logout()
    window.location.href = '/login'
  }
}

// Fermer le menu quand on clique en dehors
onMounted(() => {
  document.addEventListener('click', closeProfileMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeProfileMenu)
})

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(() => {
  // Vérifier la préférence sauvegardée
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    isDarkMode.value = saved === 'true'
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    }
  } else {
    // Détecter la préférence système
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    }
  }
})

// Directive pour fermer le menu au clic extérieur
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}

const handleImageError = (event) => {
  // Si l'image ne charge pas, masquer l'erreur et continuer
  event.target.style.display = 'none'
}

onMounted(async () => {
  currentUser.value = authService.getCurrentUser()
  // Rafraîchir les infos utilisateur depuis le serveur
  const user = await authService.fetchCurrentUser()
  if (user) {
    currentUser.value = user
  }
})

onUnmounted(() => {
  if (profileMenuRef.value?.clickOutsideEvent) {
    document.removeEventListener('click', profileMenuRef.value.clickOutsideEvent)
  }
})
</script>

