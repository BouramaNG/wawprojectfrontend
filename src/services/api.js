import axios from 'axios'
import { authService } from './auth'

// Construire l'URL de base - si VITE_API_URL contient déjà /api, ne pas l'ajouter
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  // Si l'URL se termine déjà par /api, l'utiliser telle quelle
  if (envUrl.endsWith('/api')) {
    return envUrl
  }
  // Si l'URL contient déjà /api quelque part, l'utiliser telle quelle
  if (envUrl.includes('/api')) {
    return envUrl
  }
  // Sinon, ajouter /api seulement si ce n'est pas déjà présent
  return envUrl.endsWith('/') ? `${envUrl}api` : `${envUrl}/api`
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Intercepteur pour auth - Ajouter le token à chaque requête
api.interceptors.request.use(config => {
  const token = authService.getToken()
  const userType = localStorage.getItem('auth_user_type') || 'admin'
  
  if (token) {
    // Pour les admins (JWT), utiliser "Bearer"
    // Pour les partenaires (Sanctum), utiliser aussi "Bearer" (Sanctum supporte les deux)
    config.headers.Authorization = `Bearer ${token}`
    
    // Ajouter un header pour identifier le type d'utilisateur si nécessaire
    if (userType === 'partner') {
      config.headers['X-User-Type'] = 'partner'
    }
  }
  return config
})

// Intercepteur pour gérer les erreurs 401 (non authentifié)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const userType = localStorage.getItem('auth_user_type') || 'admin'
      const requestUrl = error.config?.url || ''
      
      console.log('[API_INTERCEPTOR] Erreur 401 détectée', {
        user_type: userType,
        url: requestUrl,
        is_admin_route: requestUrl.includes('/admin/'),
        is_change_password: requestUrl.includes('/change-password'),
      })
      
      // Ne pas rediriger pour les erreurs de changement de mot de passe
      // (mot de passe incorrect, etc.) - laisser le composant gérer l'erreur
      if (requestUrl.includes('/change-password')) {
        console.log('[API_INTERCEPTOR] Erreur 401 sur changement de mot de passe, ne pas rediriger')
        return Promise.reject(error)
      }
      
      // Pour les partenaires, ne pas déconnecter si c'est une route admin
      // car c'est normal qu'ils n'y aient pas accès
      if (userType === 'partner' && requestUrl.includes('/admin/')) {
        console.log('[API_INTERCEPTOR] Partenaire tentant d\'accéder à une route admin, ne pas déconnecter')
        return Promise.reject(error)
      }
      
      // Pour les autres cas (token invalide, expiré, etc.), déconnecter
      console.log('[API_INTERCEPTOR] Déconnexion suite à 401')
      await authService.logout()
      
      // Rediriger vers login si on n'est pas déjà sur la page login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Templates
export const templates = {
  list: (params) => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.get('/partner-auth/templates', { params })
    }
    return api.get('/admin/package-templates/local', { params })
  },
  create: (data) => api.post('/admin/package-templates', data),
  show: (id) => api.get(`/admin/package-templates/${id}`),
  update: (id, data) => api.put(`/admin/package-templates/${id}`, data),
  toggleStatus: (id) => api.patch(`/admin/package-templates/${id}/status`),
}

// Packages
export const packages = {
  list: (params) => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.get('/partner-auth/packages', { params })
    }
    return api.get('/admin/packages', { params })
  },
  create: (data) => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.post('/partner-auth/packages', data)
    }
    return api.post('/admin/packages', data)
  },
  show: (id) => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.get(`/partner-auth/packages/${id}`)
    }
    return api.get(`/admin/packages/${id}`)
  },
}

// eSIMs
export const esims = {
  list: (params) => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.get('/partner-auth/esims', { params })
    }
    return api.get('/admin/esims', { params })
  },
  show: (id) => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.get(`/partner-auth/esims/${id}`)
    }
    return api.get(`/admin/esims/${id}`)
  },
  stats: () => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.get('/partner-auth/esims/stats')
    }
    return api.get('/admin/esims/stock-stats')
  },
}

// Prices
export const prices = {
  list: (params) => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.get('/partner-auth/prices', { params })
    }
    return api.get('/admin/prices', { params })
  },
  create: (data) => api.post('/admin/prices', data),
  show: (id) => api.get(`/admin/prices/${id}`),
  update: (id, data) => api.put(`/admin/prices/${id}`, data),
  delete: (id) => api.delete(`/admin/prices/${id}`),
  toggle: (id) => api.patch(`/admin/prices/${id}/toggle`),
}

// Partners
export const partners = {
  list: (params) => api.get('/admin/partners', { params }),
  create: (data) => api.post('/admin/partners', data),
  show: (id) => api.get(`/admin/partners/${id}`),
  update: (id, data) => api.put(`/admin/partners/${id}`, data),
  generateApiKey: (id, data) => api.post(`/admin/partners/${id}/api-keys`, data),
  delete: (id) => api.delete(`/admin/partners/${id}`),
  // Utilisateurs partenaires
  listUsers: (partnerId) => api.get(`/admin/partners/${partnerId}/users`),
  createUser: (partnerId, data) => api.post(`/admin/partners/${partnerId}/users`, data),
  updateUser: (partnerId, userId, data) => api.put(`/admin/partners/${partnerId}/users/${userId}`, data),
  deleteUser: (partnerId, userId) => api.delete(`/admin/partners/${partnerId}/users/${userId}`),
}

// Orders
export const orders = {
  list: (params) => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.get('/partner-auth/orders', { params })
    }
    return api.get('/admin/orders', { params })
  },
  show: (id) => {
    const userType = localStorage.getItem('auth_user_type') || 'admin'
    if (userType === 'partner') {
      return api.get(`/partner-auth/orders/${id}`)
    }
    return api.get(`/admin/orders/${id}`)
  },
}

// Dashboard Stats
export const dashboard = {
  stats: () => api.get('/admin/dashboard/stats'),
}

// Roles
export const roles = {
  list: (params) => api.get('/admin/roles', { params }),
  create: (data) => api.post('/admin/roles', data),
  show: (id) => api.get(`/admin/roles/${id}`),
  update: (id, data) => api.put(`/admin/roles/${id}`, data),
  delete: (id) => api.delete(`/admin/roles/${id}`),
  getPermissions: (id) => api.get(`/admin/roles/${id}/permissions`),
  updatePermissions: (id, permissionIds) => api.put(`/admin/roles/${id}/permissions`, { permission_ids: permissionIds }),
}

// Activities
export const activities = {
  list: (params) => api.get('/admin/activities', { params }),
  show: (id) => api.get(`/admin/activities/${id}`),
}

// Users (Admin)
export const users = {
  list: (params) => api.get('/admin/users', { params }),
  show: (id) => api.get(`/admin/users/${id}`),
  create: (data) => api.post('/admin/users', data),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
}

export default api

