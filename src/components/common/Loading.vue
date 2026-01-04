<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-95 backdrop-blur-sm"
    >
      <div class="text-center">
        <!-- Logo avec animation -->
        <div class="mb-6">
          <img
            :src="logoUrl"
            alt="WAW Logo"
            class="w-32 h-32 mx-auto animate-pulse"
            :class="{ 'animate-spin-slow': spinning }"
            @error="handleImageError"
          />
        </div>
        
        <!-- Texte de chargement -->
        <div class="flex items-center justify-center space-x-2">
          <div class="flex space-x-1">
            <div
              class="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
              style="animation-delay: 0s"
            ></div>
            <div
              class="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
              style="animation-delay: 0.2s"
            ></div>
            <div
              class="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
              style="animation-delay: 0.4s"
            ></div>
          </div>
          <p class="ml-3 text-gray-600 font-medium">{{ message || 'Chargement...' }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import logoImage from '@/assets/logo-waw-officiel.png'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: 'Chargement...',
  },
  spinning: {
    type: Boolean,
    default: false,
  },
})

const logoUrl = computed(() => logoImage)

const handleImageError = (event) => {
  // Si l'image ne charge pas, masquer l'erreur et continuer
  event.target.style.display = 'none'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>

