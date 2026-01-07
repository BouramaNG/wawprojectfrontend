import api from './api'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   */
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password })
      
      // Gérer les deux types d'utilisateurs (admin et partner)
      if (response.data.token && response.data.user) {
        const user = response.data.user
        const userType = response.data.user_type || 'admin' // 'admin' ou 'partner'
        
        // Pour les admins (User)
        if (userType === 'admin') {
          // Si le rôle est fourni séparément dans la réponse, l'ajouter à l'utilisateur
          if (response.data.role && !user.role) {
            user.role = response.data.role
          }
          
          // Si le rôle est un string, le convertir en objet pour cohérence
          if (typeof user.role === 'string') {
            user.role = { name: user.role }
          }
        }
        
        // Pour les partenaires (PartnerUser)
        if (userType === 'partner') {
          // Le rôle est déjà dans user.role (string)
          if (typeof user.role === 'string') {
            user.role = { name: user.role }
          }
        }
        
        // Ajouter le type d'utilisateur
        user.user_type = userType
        
        // Stocker le token et les infos utilisateur
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
        localStorage.setItem('auth_user_type', userType) // Stocker le type pour référence
        
        return {
          success: true,
          user: user,
          token: response.data.token,
          user_type: userType,
        }
      }
      
      throw new Error('Réponse invalide du serveur')
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Erreur de connexion'
      return {
        success: false,
        error: message,
      }
    }
  },

  /**
   * Déconnexion utilisateur
   */
  async logout() {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    
    // Nettoyer immédiatement le localStorage pour éviter les problèmes
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem('auth_user_type')
    
    // Essayer d'invalider le token côté serveur (mais ne pas bloquer si ça échoue)
    try {
      if (token) {
        // Utiliser le bon endpoint selon le type d'utilisateur
        if (userType === 'partner') {
          await api.post('/partner-auth/logout')
        } else {
          await api.post('/logout')
        }
      }
    } catch (error) {
      // Ignorer les erreurs de déconnexion serveur (token peut être déjà expiré)
    }
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return !!localStorage.getItem(AUTH_TOKEN_KEY)
  },

  /**
   * Récupérer le token
   */
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },

  /**
   * Récupérer l'utilisateur actuel
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(AUTH_USER_KEY)
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        return null
      }
    }
    return null
  },

  /**
   * Récupérer les infos utilisateur depuis le serveur
   */
  async fetchCurrentUser() {
    try {
      const userType = localStorage.getItem('auth_user_type') || 'admin'
      
      // Utiliser le bon endpoint selon le type d'utilisateur
      let endpoint = '/me'
      if (userType === 'partner') {
        endpoint = '/partner-auth/me'
      }
      
      const response = await api.get(endpoint)
      
      // Gérer les deux formats de réponse
      let user = null
      if (userType === 'partner') {
        // Pour les partenaires, les données sont dans response.data.data
        if (response.data.success && response.data.data) {
          user = response.data.data
        } else if (response.data.data) {
          user = response.data.data
        } else if (response.data) {
          user = response.data
        }
      } else {
        // Pour les admins, les données sont directement dans response.data
        user = response.data
      }
      
      if (user) {
        // S'assurer que le rôle est formaté correctement
        if (typeof user.role === 'string') {
          user.role = { name: user.role }
        }
        
        // Ajouter le type d'utilisateur
        user.user_type = userType
        
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
        return user
      }
      
      return null
    } catch (error) {
      // Pour les partenaires, ne pas déconnecter immédiatement en cas d'erreur 401
      // car le token Sanctum peut être valide mais le middleware peut échouer
      if (error.response?.status === 401) {
        const userType = localStorage.getItem('auth_user_type')
        if (userType !== 'partner') {
          // Déconnecter seulement pour les admins
          this.logout()
        }
      }
      return null
    }
  },

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  hasRole(roleName) {
    const user = this.getCurrentUser()
    if (!user) return false
    
    // Récupérer le rôle de différentes manières
    let userRole = null
    if (user.role && typeof user.role === 'object' && user.role.name) {
      userRole = user.role.name
    } else if (typeof user.role === 'string') {
      userRole = user.role
    }
    
    if (!userRole) return false
    
    // Comparaison insensible à la casse
    return userRole.toLowerCase().trim() === roleName.toLowerCase().trim()
  },

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin() {
    return this.hasRole('admin')
  },
}

export default authService

