<template>
  <div>
    <Loading :show="isLoading" :message="loadingMessage" />
    <RouterView />
    <ToastContainer />
    <NotificationModal
      v-model:show="notification.show"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      :copyable-text="notification.copyableText"
      :confirm-text="notification.confirmText"
      :cancel-text="notification.cancelText"
      :show-cancel="notification.showCancel"
      @confirm="handleNotificationConfirm"
      @close="handleNotificationClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import ToastContainer from '@/components/common/ToastContainer.vue'
import Loading from '@/components/common/Loading.vue'
import NotificationModal from '@/components/common/NotificationModal.vue'
import { useNotification } from '@/composables/useNotification'

const { notification, handleConfirm, closeNotification } = useNotification()

const router = useRouter()
const isLoading = ref(false)
const loadingMessage = ref('Chargement...')

// Intercepter les changements de route pour afficher le loading
router.beforeEach((to, from, next) => {
  if (from.name !== null) {
    // Seulement afficher le loading si on change de page (pas au premier chargement)
    isLoading.value = true
    loadingMessage.value = 'Chargement de la page...'
  }
  next()
})

router.afterEach(() => {
  // Masquer le loading après un court délai pour une transition fluide
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

// Initialiser le dark mode depuis localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    // Utiliser la préférence système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    }
  }
})

const handleNotificationConfirm = () => {
  handleConfirm()
}

const handleNotificationClose = () => {
  closeNotification()
}
</script>

