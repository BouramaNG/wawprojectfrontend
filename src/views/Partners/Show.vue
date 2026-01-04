<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link
          to="/partners"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </router-link>
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-purple-400">
            Détails Partenaire
          </h1>
          <p v-if="partner?.name" class="text-gray-600 dark:text-gray-400 mt-1 font-semibold text-lg">
            {{ partner.name }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Chargement des détails...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700 dark:text-red-400 font-medium">{{ error }}</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="partner" class="space-y-6">
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-blue-100 text-sm font-medium">Commandes</span>
            <svg class="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ partner.orders_count || 0 }}</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-100 text-sm font-medium">Clés API</span>
            <svg class="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ partner.api_keys_count || 0 }}</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-purple-100 text-sm font-medium">Utilisateurs</span>
            <svg class="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ partnerUsers.length }}</p>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-orange-100 text-sm font-medium">Statut</span>
            <svg class="w-6 h-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-lg font-bold">{{ partner.is_active ? 'Actif' : 'Inactif' }}</p>
        </div>
      </div>

      <!-- Informations Partenaire -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Informations Partenaire
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">ID</label>
            <p class="text-gray-900 dark:text-gray-100 font-semibold">{{ partner.id || '-' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Nom</label>
            <p class="text-gray-900 dark:text-gray-100 font-semibold">{{ partner.name || '-' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Email</label>
            <p class="text-gray-900 dark:text-gray-100">{{ partner.email || '-' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Contact</label>
            <p class="text-gray-900 dark:text-gray-100">{{ partner.contact_name || '-' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Téléphone</label>
            <p class="text-gray-900 dark:text-gray-100">{{ partner.contact_phone || '-' }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Créé le</label>
            <p class="text-gray-900 dark:text-gray-100 text-sm">{{ formatDate(partner.created_at) }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">📱 eSIMs Allouées</label>
            <p class="text-gray-900 dark:text-gray-100 font-semibold">{{ partner.allocated_esims_count || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Section Configuration Partenaire -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuration Partenaire
          </h2>
          <button
            @click="openEditConfigModal"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <label class="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2 block">eSIMs Allouées</label>
            <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ partner.allocated_esims_count || 0 }}</p>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">eSIMs réservées en "pre-service" pour ce partenaire</p>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <label class="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-2 block">Packages Autorisés</label>
            <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ authorizedPackages.length }}</p>
            <p class="text-xs text-purple-600 dark:text-purple-400 mt-1">Packages visibles dans le dashboard partenaire</p>
          </div>
        </div>

        <div v-if="authorizedPackages.length > 0" class="mt-4">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Liste des packages autorisés</label>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="pkg in authorizedPackages"
              :key="pkg.id"
              class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
            >
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ pkg.plan_name || 'Package #' + pkg.id }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {{ pkg.country_name || pkg.country_code || 'N/A' }} - {{ pkg.data_limit ? pkg.data_limit + ' GB' : 'N/A' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Utilisateurs Partenaires -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Utilisateurs Partenaires
          </h2>
          <button
            @click="openCreateUserModal"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter Utilisateur
          </button>
        </div>

        <div v-if="loadingUsers" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <div v-else-if="partnerUsers.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p class="text-gray-600 dark:text-gray-400 font-medium">Aucun utilisateur partenaire</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Créez un utilisateur pour permettre l'accès au partenaire</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rôle</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permissions</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="user in partnerUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-gray-100">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                  >
                    {{ user.role === 'admin' ? 'Admin' : 'Utilisateur' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="perm in (user.permissions || []).slice(0, 3)"
                      :key="perm"
                      class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                    >
                      {{ perm }}
                    </span>
                    <span v-if="(user.permissions || []).length > 3" class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      +{{ (user.permissions || []).length - 3 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold"
                    :class="user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                  >
                    <span :class="user.is_active ? 'bg-green-500' : 'bg-gray-400'" class="w-2 h-2 rounded-full mr-1"></span>
                    {{ user.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editUser(user)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      title="Modifier"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="handleDeleteUser(user)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      title="Supprimer"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section Clés API -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Clés API
        </h2>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">Comment utiliser les clés API ?</p>
              <div class="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <p><strong>API Key</strong> : Identifie votre partenaire (comme un nom d'utilisateur)</p>
                <p><strong>API Secret</strong> : Prouve que vous êtes le propriétaire (comme un mot de passe)</p>
                <p class="mt-2"><strong>⚠️ Important</strong> : Le Secret n'est visible qu'une seule fois lors de la création. Conservez-le en sécurité !</p>
              </div>
            </div>
          </div>
        </div>
        <button
          @click="showApiKeyModal = true"
          class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Générer une Clé API
        </button>
      </div>
    </div>

    <!-- Modal Création/Modification Utilisateur -->
    <Modal
      v-model="showUserModal"
      :title="editingUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur partenaire'"
    >
      <form @submit.prevent="handleSubmitUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom <span class="text-red-500">*</span>
          </label>
          <input
            v-model="userForm.name"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="userForm.email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mot de passe
            <span v-if="editingUser" class="text-xs text-gray-500 ml-2">(Laissez vide pour ne pas modifier)</span>
            <span v-else class="text-xs text-gray-500 ml-2">(Optionnel - un email d'invitation sera envoyé)</span>
          </label>
          <input
            v-model="userForm.password"
            type="password"
            :minlength="8"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
            placeholder="Minimum 8 caractères (optionnel)"
          />
          <p v-if="!editingUser" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Si aucun mot de passe n'est fourni, un email d'invitation sera envoyé à l'utilisateur pour définir son mot de passe.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rôle
          </label>
          <select
            v-model="userForm.role"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Permissions
          </label>
          <div class="space-y-2">
            <label v-for="perm in availablePermissions" :key="perm.value" class="flex items-center">
              <input
                v-model="userForm.permissions"
                type="checkbox"
                :value="perm.value"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ perm.label }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="flex items-center">
            <input
              v-model="userForm.is_active"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Actif</span>
          </label>
        </div>
      </form>

      <template #footer>
        <div class="flex items-center justify-end space-x-3">
          <button
            type="button"
            @click="closeUserModal"
            class="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="handleSubmitUser"
            :disabled="savingUser"
            class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span v-if="savingUser" class="inline-block animate-spin mr-2">⏳</span>
            {{ editingUser ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Modal Génération Clé API -->
    <Modal
      v-model="showApiKeyModal"
      title="Générer une Clé API"
    >
      <form @submit.prevent="handleGenerateApiKey" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom de la clé
          </label>
          <input
            v-model="apiKeyForm.name"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
            placeholder="Production, Development, etc."
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date d'expiration (optionnel)
          </label>
          <input
            v-model="apiKeyForm.expires_at"
            type="date"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Permissions
          </label>
          <div class="space-y-2">
            <label v-for="perm in apiPermissions" :key="perm.value" class="flex items-center">
              <input
                v-model="apiKeyForm.permissions"
                type="checkbox"
                :value="perm.value"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ perm.label }}</span>
            </label>
          </div>
        </div>

        <div v-if="generatedApiKey" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 space-y-3">
          <div>
            <label class="block text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">API Key</label>
            <div class="flex items-center space-x-2">
              <input
                :value="generatedApiKey.api_key"
                readonly
                class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded-lg font-mono text-sm dark:text-gray-100"
              />
              <button
                @click="copyToClipboard(generatedApiKey.api_key)"
                class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Copier
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">API Secret</label>
            <div class="flex items-center space-x-2">
              <input
                :type="showSecret ? 'text' : 'password'"
                :value="generatedApiKey.api_secret"
                readonly
                class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded-lg font-mono text-sm dark:text-gray-100"
              />
              <button
                @click="showSecret = !showSecret"
                class="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                {{ showSecret ? 'Masquer' : 'Afficher' }}
              </button>
              <button
                @click="copyToClipboard(generatedApiKey.api_secret)"
                class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Copier
              </button>
            </div>
            <p class="text-xs text-red-600 dark:text-red-400 mt-2 font-semibold">⚠️ Conservez ce secret en sécurité. Il ne sera plus visible après cette réponse.</p>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex items-center justify-end space-x-3">
          <button
            type="button"
            @click="closeApiKeyModal"
            class="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            {{ generatedApiKey ? 'Fermer' : 'Annuler' }}
          </button>
          <button
            v-if="!generatedApiKey"
            type="button"
            @click="handleGenerateApiKey"
            :disabled="generatingApiKey"
            class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span v-if="generatingApiKey" class="inline-block animate-spin mr-2">⏳</span>
            Générer
          </button>
        </div>
      </template>
    </Modal>

    <!-- Modal Modification Configuration -->
    <Modal
      v-model="showConfigModal"
      title="Modifier la Configuration"
    >
      <form @submit.prevent="handleSaveConfig" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre d'eSIMs à attribuer
          </label>
          <input
            v-model.number="configForm.allocated_esims_count"
            type="number"
            min="0"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
            placeholder="Ex: 10"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Le système réservera automatiquement ce nombre d'eSIMs en "pre-service" pour ce partenaire</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Packages autorisés
          </label>
          <div v-if="loadingTemplates" class="text-sm text-gray-500">Chargement des packages...</div>
          <div v-else-if="templates.length === 0" class="text-sm text-gray-500">Aucun package disponible</div>
          <div v-else class="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-2">
            <label
              v-for="template in templates"
              :key="template.id"
              class="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
            >
              <input
                v-model="configForm.package_template_ids"
                type="checkbox"
                :value="template.id"
                class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ template.name || template.plan_name || 'Package #' + template.id }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ template.country || template.country_name || template.country_code || 'N/A' }} - 
                  {{ getDataLimit(template) }} - 
                  {{ getValidityDays(template) }}
                </div>
              </div>
            </label>
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Sélectionnez les packages que ce partenaire pourra voir dans son dashboard</p>
        </div>
      </form>

      <template #footer>
        <div class="flex items-center justify-end space-x-3">
          <button
            type="button"
            @click="showConfigModal = false"
            class="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="handleSaveConfig"
            :disabled="savingConfig"
            class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span v-if="savingConfig" class="inline-block animate-spin mr-2">⏳</span>
            Enregistrer
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { partners as partnersApi, templates as templatesApi } from '@/services/api'
import Modal from '@/components/common/Modal.vue'
import { useToast } from '@/composables/useToast'

// Forcer le mode clair sur cette page
onMounted(() => {
  document.documentElement.classList.remove('dark')
})

onUnmounted(() => {
  // Restaurer le thème sauvegardé quand on quitte la page
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

const route = useRoute()
const loading = ref(true)
const partner = ref(null)
const error = ref('')
const partnerUsers = ref([])
const loadingUsers = ref(false)
const showUserModal = ref(false)
const editingUser = ref(null)
const savingUser = ref(false)
const showApiKeyModal = ref(false)
const generatingApiKey = ref(false)
const generatedApiKey = ref(null)
const showSecret = ref(false)
const showConfigModal = ref(false)
const loadingTemplates = ref(false)
const templates = ref([])
const authorizedPackages = ref([])
const savingConfig = ref(false)
const configForm = ref({
  allocated_esims_count: 0,
  package_template_ids: [],
})

const { success, error: showError } = useToast()

// Fonction pour obtenir la limite de données (convertir MB en GB si nécessaire)
const getDataLimit = (template) => {
  if (template.data_limit) {
    return template.data_limit + ' GB'
  }
  if (template.data_mb) {
    const gb = (template.data_mb / 1024).toFixed(2)
    return gb + ' GB'
  }
  return 'N/A'
}

// Fonction pour obtenir la validité en jours
const getValidityDays = (template) => {
  // Essayer validity_days d'abord (format transformé)
  if (template.validity_days !== null && template.validity_days !== undefined && template.validity_days !== 0) {
    return template.validity_days + ' jours'
  }
  // Sinon essayer duration_days (format original)
  if (template.duration_days !== null && template.duration_days !== undefined && template.duration_days !== 0) {
    return template.duration_days + ' jours'
  }
  // Si aucune valeur, afficher "Non spécifié" au lieu de "N/A"
  return 'Non spécifié'
}

const availablePermissions = [
  { value: 'packages.create', label: 'Créer des packages' },
  { value: 'packages.view', label: 'Voir les packages' },
  { value: 'esims.view', label: 'Voir les eSIMs' },
  { value: 'esims.activate', label: 'Activer des eSIMs' },
  { value: 'orders.create', label: 'Créer des commandes' },
  { value: 'orders.view', label: 'Voir les commandes' },
  { value: 'templates.view', label: 'Voir les templates' },
  { value: 'prices.view', label: 'Voir les prix' },
]

const apiPermissions = [
  { value: 'packages', label: 'Packages' },
  { value: 'esims', label: 'eSIMs' },
  { value: 'templates', label: 'Templates' },
  { value: 'prices', label: 'Prix' },
  { value: 'orders', label: 'Commandes' },
]

const userForm = ref({
  name: '',
  email: '',
  password: '',
  role: 'user',
  permissions: [],
  is_active: true,
})

const apiKeyForm = ref({
  name: 'Default',
  expires_at: '',
  permissions: [],
})

const formatDate = (date) => {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return '-'
  }
}

const loadPartner = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await partnersApi.show(route.params.id)
    if (response.data.success) {
      partner.value = response.data.partner || response.data.data
      await loadUsers()
      await loadAuthorizedPackages()
    } else {
      error.value = response.data.message || 'Erreur lors du chargement du partenaire'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du chargement du partenaire'
    console.error('Erreur chargement partenaire:', err)
  } finally {
    loading.value = false
  }
}

const loadAuthorizedPackages = async () => {
  if (!partner.value) return
  try {
    // Charger les packages autorisés depuis la relation (peut être authorized_packages ou authorizedPackages)
    // Les packages sont déjà transformés par le backend avec data_limit et validity_days
    const packages = partner.value.authorized_packages || partner.value.authorizedPackages || []
    authorizedPackages.value = packages.map(pkg => ({
      ...pkg,
      // S'assurer que data_limit est disponible (converti depuis data_mb par le backend)
      data_limit: pkg.data_limit ?? (pkg.data_mb ? Math.round((pkg.data_mb / 1024) * 100) / 100 : null),
      // S'assurer que validity_days est disponible
      validity_days: pkg.validity_days ?? pkg.duration_days ?? null,
      // S'assurer que plan_name est disponible
      plan_name: pkg.plan_name ?? pkg.name ?? `Package #${pkg.id}`,
      // S'assurer que country_name est disponible
      country_name: pkg.country_name ?? pkg.country ?? pkg.country_code ?? 'N/A',
    }))
  } catch (err) {
    console.error('Erreur chargement packages autorisés:', err)
    authorizedPackages.value = []
  }
}

const loadTemplates = async () => {
  loadingTemplates.value = true
  try {
    const response = await templatesApi.list({ per_page: 1000 })
    if (response.data.success) {
      templates.value = response.data.templates || response.data.data || []
    }
  } catch (error) {
    console.error('Erreur chargement templates:', error)
  } finally {
    loadingTemplates.value = false
  }
}

const openEditConfigModal = async () => {
  if (!partner.value) return
  configForm.value = {
    allocated_esims_count: partner.value.allocated_esims_count || 0,
    package_template_ids: authorizedPackages.value.map(p => p.id) || [],
  }
  await loadTemplates()
  showConfigModal.value = true
}

const handleSaveConfig = async () => {
  if (!partner.value) return
  savingConfig.value = true
  try {
    const data = {
      ...configForm.value,
      package_template_ids: configForm.value.package_template_ids.length > 0 
        ? configForm.value.package_template_ids 
        : undefined,
    }
    const response = await partnersApi.update(partner.value.id, data)
    if (response.data.success) {
      success('Configuration mise à jour avec succès !')
      showConfigModal.value = false
      await loadPartner()
    } else {
      showError(response.data.message || 'Erreur lors de la sauvegarde')
    }
  } catch (err) {
    console.error('Erreur sauvegarde configuration:', err)
    showError(err.response?.data?.message || 'Erreur lors de la sauvegarde')
  } finally {
    savingConfig.value = false
  }
}

const loadUsers = async () => {
  if (!partner.value) return
  loadingUsers.value = true
  try {
    const response = await partnersApi.listUsers(partner.value.id)
    if (response.data.success) {
      partnerUsers.value = response.data.data || []
    }
  } catch (err) {
    console.error('Erreur chargement utilisateurs:', err)
    showError('Erreur lors du chargement des utilisateurs')
  } finally {
    loadingUsers.value = false
  }
}

const openCreateUserModal = () => {
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    permissions: [],
    is_active: true,
  }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    permissions: [],
    is_active: true,
  }
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
    permissions: user.permissions || [],
    is_active: user.is_active,
  }
  showUserModal.value = true
}

const handleSubmitUser = async () => {
  if (!partner.value) return
  
  savingUser.value = true
  try {
    let response
    const data = { ...userForm.value }
    if (!data.password && editingUser.value) {
      delete data.password
    }

    if (editingUser.value) {
      response = await partnersApi.updateUser(partner.value.id, editingUser.value.id, data)
    } else {
      response = await partnersApi.createUser(partner.value.id, data)
    }

    if (response.data.success) {
      success(editingUser.value ? 'Utilisateur modifié avec succès !' : 'Utilisateur créé avec succès !')
      closeUserModal()
      await loadUsers()
    } else {
      showError(response.data.message || 'Erreur lors de la sauvegarde')
    }
  } catch (err) {
    console.error('Erreur sauvegarde utilisateur:', err)
    showError(err.response?.data?.message || 'Erreur lors de la sauvegarde')
  } finally {
    savingUser.value = false
  }
}

const handleDeleteUser = async (user) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)) {
    return
  }

  try {
    const response = await partnersApi.deleteUser(partner.value.id, user.id)
    if (response.data.success) {
      success('Utilisateur supprimé avec succès !')
      await loadUsers()
    } else {
      showError(response.data.message || 'Erreur lors de la suppression')
    }
  } catch (err) {
    console.error('Erreur suppression utilisateur:', err)
    showError('Erreur lors de la suppression')
  }
}

const handleGenerateApiKey = async () => {
  if (!partner.value) return
  
  generatingApiKey.value = true
  try {
    const data = { ...apiKeyForm.value }
    if (!data.expires_at) {
      delete data.expires_at
    }
    const response = await partnersApi.generateApiKey(partner.value.id, data)
    if (response.data.success) {
      generatedApiKey.value = response.data.data
      success('Clé API générée avec succès !')
    } else {
      showError(response.data.message || 'Erreur lors de la génération')
    }
  } catch (err) {
    console.error('Erreur génération clé API:', err)
    showError('Erreur lors de la génération')
  } finally {
    generatingApiKey.value = false
  }
}

const closeApiKeyModal = () => {
  showApiKeyModal.value = false
  generatedApiKey.value = null
  showSecret.value = false
  apiKeyForm.value = {
    name: 'Default',
    expires_at: '',
    permissions: [],
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    success('Copié dans le presse-papiers !')
  } catch (err) {
    showError('Erreur lors de la copie')
  }
}

onMounted(() => {
  loadPartner()
})
</script>
