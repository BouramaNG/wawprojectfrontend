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
  console.log('[GUARD] Vérification permission route', {
    route_name: to.name,
    route_path: to.path,
    from_name: from.name,
  })

  if (!authService.isAuthenticated()) {
    console.log('[GUARD] Non authentifié, redirection vers login')
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
    return
  }

  const routeName = to.name
  const requiredPermission = routePermissions[routeName]
  
  console.log('[GUARD] Permissions route', {
    route_name: routeName,
    required_permission: requiredPermission,
  })

  // Si aucune permission définie, autoriser l'accès (par défaut - backend vérifiera)
  if (!requiredPermission) {
    console.log('[GUARD] Aucune permission définie, autorisation par défaut (backend vérifiera)')
    next()
    return
  }

  // Vérifier si l'utilisateur a la permission requise
  const user = authService.getCurrentUser()
  const userType = user?.user_type || localStorage.getItem('auth_user_type') || 'admin'
  
  console.log('[GUARD] Informations utilisateur', {
    user_present: !!user,
    user_type: userType,
    user_role: user?.role,
    user_permissions: user?.permissions,
  })
  
  // Si c'est un utilisateur partenaire, autoriser l'accès (le backend vérifiera les permissions)
  if (userType === 'partner') {
    console.log('[GUARD] Utilisateur partenaire détecté, autorisation par défaut (backend vérifiera)')
    next()
    return
  }
  
  // Les admins ont toutes les permissions
  if (authService.isAdmin()) {
    console.log('[GUARD] Utilisateur admin, autorisation automatique')
    next()
    return
  }

  // Vérifier les permissions de l'utilisateur
  const userPermissions = user?.permissions || []
  
  // Si les permissions ne sont pas encore chargées, autoriser par défaut (backend vérifiera)
  if (!userPermissions || userPermissions.length === 0) {
    console.warn('[GUARD] Permissions non chargées, autorisation par défaut (backend vérifiera)')
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
  
  console.log('[GUARD] Vérification permission', {
    required_permission: requiredPermission,
    user_permissions: permissionNames,
    has_permission: hasPermission,
  })

  if (hasPermission) {
    console.log('[GUARD] Permission accordée')
    next()
  } else {
    console.warn('[GUARD] Permission refusée, redirection vers dashboard')
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

