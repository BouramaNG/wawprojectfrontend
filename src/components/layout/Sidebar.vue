<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <img
            :src="logoUrl"
            alt="WAW Logo"
            class="h-10 w-auto object-contain"
            @error="handleImageError"
          />
          <h1 class="text-xl font-bold text-primary-600">WAW TELECOM</h1>
        </div>
        <button
          @click="toggle"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200"
          :class="{
            'bg-primary-50 text-primary-600 font-medium': $route.name === item.name,
            'text-gray-700 hover:bg-gray-100': $route.name !== item.name
          }"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from '@/services/auth'
import logoImage from '@/assets/logo-waw-officiel.png'

const logoUrl = computed(() => logoImage)
import {
  HomeIcon,
  DocumentTextIcon,
  CubeIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const isOpen = ref(true) // Ouvert par défaut sur desktop

const handleImageError = (event) => {
  // Si l'image ne charge pas, masquer l'erreur et continuer
  event.target.style.display = 'none'
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

// Tous les items du menu
const allMenuItems = [
  { name: 'dashboard', path: '/', label: 'Dashboard', icon: HomeIcon, adminOnly: false },
  { name: 'templates', path: '/templates', label: 'Templates', icon: DocumentTextIcon, adminOnly: true },
  { name: 'packages', path: '/packages', label: 'Packages', icon: CubeIcon, adminOnly: true },
  { name: 'esims', path: '/esims', label: '📱 eSIMs', icon: DevicePhoneMobileIcon, adminOnly: true },
  { name: 'prices', path: '/prices', label: 'Prix', icon: CurrencyDollarIcon, adminOnly: true },
  { name: 'partners', path: '/partners', label: 'Partenaires', icon: UserGroupIcon, adminOnly: true },
  { name: 'orders', path: '/orders', label: 'Commandes', icon: ShoppingBagIcon, adminOnly: true },
  { name: 'roles', path: '/roles', label: 'Rôles', icon: ShieldCheckIcon, adminOnly: true },
  { name: 'users', path: '/users', label: 'Utilisateurs', icon: UserGroupIcon, adminOnly: true },
  { name: 'activities', path: '/activities', label: 'Activités', icon: ClipboardDocumentListIcon, adminOnly: true },
  { name: 'api-documentation', path: '/api-documentation', label: 'Documentation API', icon: BookOpenIcon, adminOnly: false },
]

// Filtrer les items selon le type d'utilisateur
const menuItems = computed(() => {
  const userType = localStorage.getItem('auth_user_type') || 'admin'
  
  if (userType === 'partner') {
    // Pour les partenaires, montrer Dashboard, Packages, 📱 eSIMs, Commandes
    // (mais pas Templates, Prix, Partenaires, Rôles, Activités qui sont admin uniquement)
    return allMenuItems.filter(item => 
      !item.adminOnly || 
      ['packages', 'esims', 'orders'].includes(item.name)
    )
  }
  
  // Pour les admins, montrer tous les items
  return allMenuItems
})
</script>

