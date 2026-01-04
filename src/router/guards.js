import { authService } from '@/services/auth'
import { usePermissions } from '@/composables/usePermissions'

/**
 * Guard pour protéger les routes nécessitant une authentification
 */
export function requireAuth(to, from, next) {
  if (authService.isAuthenticated()) {
    next()
  } else {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }
}

/**
 * Guard pour rediriger si déjà authentifié (ex: page login)
 */
export function requireGuest(to, from, next) {
  if (authService.isAuthenticated()) {
    next('/')
  } else {
    next()
  }
}

/**
 * Guard pour vérifier le rôle de l'utilisateur
 */
export function requireRole(roleName) {
  return (to, from, next) => {
    if (!authService.isAuthenticated()) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
      return
    }

    if (authService.hasRole(roleName)) {
      next()
    } else {
      next({
        name: 'dashboard',
      })
    }
  }
}

/**
 * Guard pour vérifier si l'utilisateur est admin
 */
export function requireAdmin(to, from, next) {
  if (!authService.isAuthenticated()) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
    return
  }

  if (authService.isAdmin()) {
    next()
  } else {
    next({
      name: 'dashboard',
    })
  }
}

/**
 * Configuration des permissions par route
 * Définit quelles permissions sont nécessaires pour accéder à chaque route
 * Si une route nécessite plusieurs permissions, l'utilisateur doit avoir au moins l'une d'elles
 */
const routePermissions = {
  // Routes avec permissions spécifiques
  'templates': 'templates.view',
  'templates.create': 'templates.create',
  'templates.show': 'templates.view',
  'packages': 'packages.view',
  'packages.create': 'packages.create',
  'packages.show': 'packages.view',
  'esims': 'esims.view',
  'esims.show': 'esims.view',
  'prices': 'prices.view',
  'partners': 'partners.view',
  'partners.create': 'partners.create',
  'partners.show': 'partners.view',
  'partners.api-docs': 'partners.view',
  'roles': 'roles.view',
  'users': 'users.view',
  'orders': 'orders.view',
  'orders.show': 'orders.view',
  'activities': 'activities.view',
  
  // Routes accessibles à tous les utilisateurs authentifiés avec permission dashboard.view
  'dashboard': 'dashboard.view',
  'profile': 'dashboard.view', // Accessible à tous les utilisateurs authentifiés
  'settings': 'dashboard.view', // Accessible à tous les utilisateurs authentifiés
  'api-documentation': 'dashboard.view', // Accessible à tous les utilisateurs authentifiés
}

/**
 * Guard pour vérifier les permissions par page
 * Utilise la configuration routePermissions
 */
export function checkRoutePermission(to, from, next) {
  if (!authService.isAuthenticated()) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
    return
  }

  const routeName = to.name
  const requiredPermission = routePermissions[routeName]

  // Si aucune permission définie, autoriser l'accès (par défaut - backend vérifiera)
  if (!requiredPermission) {
    next()
    return
  }

  // Vérifier si l'utilisateur a la permission requise
  const user = authService.getCurrentUser()
  const userType = user?.user_type || localStorage.getItem('auth_user_type') || 'admin'
  
  // Si c'est un utilisateur partenaire, autoriser l'accès (le backend vérifiera les permissions)
  if (userType === 'partner') {
    next()
    return
  }
  
  // Les admins ont toutes les permissions
  if (authService.isAdmin()) {
    next()
    return
  }

  // Vérifier les permissions de l'utilisateur
  const userPermissions = user?.permissions || []
  
  // Si les permissions ne sont pas encore chargées, autoriser par défaut (backend vérifiera)
  if (!userPermissions || userPermissions.length === 0) {
    next()
    return
  }

  // Extraire les noms de permissions si ce sont des objets
  const permissionNames = userPermissions.map(p => {
    if (typeof p === 'string') {
      return p
    }
    return p.name || p
  })

  // Vérifier si l'utilisateur a la permission requise
  const hasPermission = permissionNames.includes(requiredPermission)

  if (hasPermission) {
    next()
  } else {
    // Rediriger vers dashboard si on n'y est pas déjà
    if (from.name !== 'dashboard' && from.name !== routeName) {
      next({
        name: 'dashboard',
      })
    } else {
      // Éviter la boucle infinie - rester sur la route actuelle
      next(false)
    }
  }
}

