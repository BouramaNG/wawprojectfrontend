import { computed } from 'vue'
import { authService } from '@/services/auth'

/**
 * Composable pour vérifier les permissions de l'utilisateur
 */
export function usePermissions() {
  const user = computed(() => authService.getCurrentUser())
  
  const permissions = computed(() => {
    if (!user.value || !user.value.permissions) {
      return []
    }
    const perms = Array.isArray(user.value.permissions) ? user.value.permissions : []
    
    // Extraire les noms de permissions si ce sont des objets
    return perms.map(p => {
      if (typeof p === 'string') {
        return p
      }
      return p.name || p
    })
  })

  /**
   * Vérifier si l'utilisateur a une permission spécifique
   */
  const hasPermission = (permissionName) => {
    // Les admins ont toutes les permissions
    if (authService.isAdmin()) {
      return true
    }

    if (!permissions.value || permissions.value.length === 0) {
      return false
    }

    return permissions.value.includes(permissionName)
  }

  /**
   * Vérifier si l'utilisateur peut voir (view)
   */
  const canView = (resource) => {
    return hasPermission(`${resource}.view`) || hasPermission(`${resource}.*`)
  }

  /**
   * Vérifier si l'utilisateur peut créer
   */
  const canCreate = (resource) => {
    return hasPermission(`${resource}.create`) || hasPermission(`${resource}.*`)
  }

  /**
   * Vérifier si l'utilisateur peut modifier
   */
  const canUpdate = (resource) => {
    return hasPermission(`${resource}.update`) || hasPermission(`${resource}.*`)
  }

  /**
   * Vérifier si l'utilisateur peut supprimer
   */
  const canDelete = (resource) => {
    return hasPermission(`${resource}.delete`) || hasPermission(`${resource}.*`)
  }

  /**
   * Obtenir le message à afficher pour les actions non autorisées
   */
  const getUnauthorizedMessage = () => {
    return 'Vous n\'avez pas la permission d\'effectuer cette action. Veuillez contacter l\'administrateur.'
  }

  return {
    permissions,
    hasPermission,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    getUnauthorizedMessage,
  }
}

