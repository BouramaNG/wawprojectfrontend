import { ref } from 'vue'

const notification = ref({
  show: false,
  type: 'info',
  title: 'Notification',
  message: '',
  copyableText: null,
  confirmText: 'OK',
  cancelText: 'Annuler',
  showCancel: false,
  onConfirm: null,
  onClose: null,
})

export function useNotification() {
  const showNotification = (options) => {
    notification.value = {
      show: true,
      type: options.type || 'info',
      title: options.title || 'Notification',
      message: options.message || '',
      copyableText: options.copyableText || null,
      confirmText: options.confirmText || 'OK',
      cancelText: options.cancelText || 'Annuler',
      showCancel: options.showCancel || false,
      onConfirm: options.onConfirm || null,
      onClose: options.onClose || null,
    }
  }

  const showSuccess = (message, options = {}) => {
    showNotification({
      type: 'success',
      title: options.title || 'Succès',
      message,
      copyableText: options.copyableText || null,
      ...options,
    })
  }

  const showError = (message, options = {}) => {
    showNotification({
      type: 'error',
      title: options.title || 'Erreur',
      message,
      copyableText: options.copyableText || null,
      ...options,
    })
  }

  const showWarning = (message, options = {}) => {
    showNotification({
      type: 'warning',
      title: options.title || 'Attention',
      message,
      copyableText: options.copyableText || null,
      ...options,
    })
  }

  const showInfo = (message, options = {}) => {
    showNotification({
      type: 'info',
      title: options.title || 'Information',
      message,
      copyableText: options.copyableText || null,
      ...options,
    })
  }

  const closeNotification = () => {
    notification.value.show = false
    if (notification.value.onClose) {
      notification.value.onClose()
    }
  }

  const handleConfirm = () => {
    if (notification.value.onConfirm) {
      notification.value.onConfirm()
    }
    if (!notification.value.showCancel) {
      closeNotification()
    }
  }

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification,
    handleConfirm,
  }
}
