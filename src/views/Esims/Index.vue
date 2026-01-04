<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-cyan-400">
          📱 Gestion eSIMs
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 text-lg">Surveillez et gérez votre stock d'eSIMs</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="showFilters = !showFilters"
          :class="[
            'inline-flex items-center px-4 py-2 rounded-xl font-semibold transition-all duration-200',
            showFilters
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtres
        </button>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-blue-100 text-sm font-medium">Total 📱 eSIMs</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats?.total || 0 }}</p>
          <p class="text-xs text-blue-100 mt-1">Toutes les 📱 eSIMs</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-100 text-sm font-medium">Disponibles</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats?.available || stats?.unassigned || 0 }}</p>
          <p class="text-xs text-green-100 mt-1">Non assignées</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-cyan-100 text-sm font-medium">En Service</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats?.in_service || getStatusCount('in-service') || 0 }}</p>
          <p class="text-xs text-cyan-100 mt-1">Actives</p>
        </div>
      </div>

      <div class="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <span class="text-purple-100 text-sm font-medium">Assignées</span>
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats?.assigned || 0 }}</p>
          <p class="text-xs text-purple-100 mt-1">Utilisées</p>
        </div>
      </div>
    </div>

    <!-- Filtres améliorés -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="showFilters" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Filtres de recherche</h3>
          <button
            @click="clearAllFilters"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
          >
            Réinitialiser
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recherche (ICCID, IMSI)</label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="89012601234567890123"
                class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-gray-100 transition-all"
                @input="debouncedSearch"
              />
              <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
            <select
              v-model="filters.status"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-gray-100 transition-all"
              @change="loadEsims()"
            >
              <option value="">Tous les statuts</option>
              <option value="pre-service">Pré-service</option>
              <option value="in-service">En service</option>
              <option value="terminated">Terminé</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Inventaire</label>
            <select
              v-model="filters.inventory"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-gray-100 transition-all"
              @change="loadEsims()"
            >
              <option value="">Tous les inventaires</option>
              <option value="51762">IMSI 2</option>
              <option value="51761">IMSI 7</option>
              <option value="51760">IMSI 25</option>
              <option value="50580">IMSI 26</option>
            </select>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Vue Grille -->
    <div v-if="viewMode === 'grid' && !loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in esims"
        :key="item.id"
        class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 transform hover:-translate-y-2"
      >
        <div class="p-6">
          <!-- Header Card -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">eSIM #{{ item.id }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ item.id }}</p>
                </div>
              </div>
            </div>
            <span
              class="px-3 py-1 text-xs font-semibold rounded-full"
              :class="getStatusBadgeClass(item.sim_status)"
            >
              {{ formatStatus(item.sim_status) }}
            </span>
          </div>

          <!-- ICCID -->
          <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">ICCID</span>
              <button
                @click="copyToClipboard(item.iccid)"
                class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Copier ICCID"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <p class="text-sm font-mono text-gray-900 dark:text-gray-100 mt-1 break-all">{{ item.iccid || '-' }}</p>
          </div>

          <!-- Informations -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">IMSI</span>
              </div>
              <span class="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">{{ item.mapped_imsi || '-' }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">Pays</span>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.country_code || '-' }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">Créé le</span>
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatDate(item.created_at) }}</span>
            </div>
          </div>

          <router-link
            :to="`/esims/${item.id}`"
            class="block w-full py-3 text-center bg-gradient-to-r from-primary-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Voir les détails
          </router-link>
        </div>
      </div>

      <div v-if="esims.length === 0" class="col-span-full">
        <div class="text-center py-16">
          <svg class="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Aucune eSIM trouvée</p>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Aucune eSIM ne correspond à vos critères de recherche</p>
        </div>
      </div>
    </div>

    <!-- Pagination pour la vue grille -->
    <div v-if="viewMode === 'grid' && pagination && pagination.total > pagination.per_page" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 px-6 py-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Affichage de <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span> à
          <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span>
          sur <span class="font-medium">{{ pagination.total }}</span> résultats
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="handlePageChange(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Précédent
          </button>
          <div class="flex items-center space-x-1">
            <button
              v-for="page in getPageNumbers()"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                page === pagination.current_page
                  ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="handlePageChange(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Suivant
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Vue Table -->
    <div v-else-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Liste des eSIMs</h3>
        <div class="flex items-center gap-2">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-2 rounded-lg transition-all duration-200',
              viewMode === 'grid' 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'table'"
            :class="[
              'p-2 rounded-lg transition-all duration-200',
              viewMode === 'table' 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>

      <DataTable
        v-else
        :columns="columns"
        :data="esims"
        :pagination="pagination"
        :actions="true"
        @page-change="handlePageChange"
      >
        <template #cell-iccid="{ item }">
          <div class="flex items-center gap-2">
            <span class="font-mono text-sm text-gray-900 dark:text-gray-100">{{ item.iccid || '-' }}</span>
            <button
              @click="copyToClipboard(item.iccid)"
              class="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title="Copier ICCID"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </template>

        <template #cell-mapped_imsi="{ item }">
          <span class="font-mono text-sm text-gray-700 dark:text-gray-300">{{ item.mapped_imsi || '-' }}</span>
        </template>

        <template #cell-sim_status="{ item }">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
            :class="getStatusBadgeClass(item.sim_status)"
          >
            <span :class="getStatusDotClass(item.sim_status)" class="w-2 h-2 rounded-full mr-2"></span>
            {{ formatStatus(item.sim_status) }}
          </span>
        </template>

        <template #cell-country_code="{ item }">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 bg-gradient-to-br from-primary-500 to-cyan-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              {{ (item.country_code || 'XX').substring(0, 2).toUpperCase() }}
            </span>
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.country_code || '-' }}</span>
          </div>
        </template>

        <template #cell-created_at="{ item }">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ formatDate(item.created_at) }}</span>
        </template>

        <template #actions="{ item }">
          <router-link
            :to="`/esims/${item.id}`"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-cyan-600 rounded-lg hover:from-primary-700 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Détails
          </router-link>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { esims as esimsApi } from '@/services/api'
import DataTable from '@/components/common/DataTable.vue'
import { useDebounce } from '@/composables/useDebounce'
import { useToast } from '@/composables/useToast'
import { authService } from '@/services/auth'

const { success } = useToast()

const loading = ref(false)
const esims = ref([])
const stats = ref(null)
const pagination = ref(null)
const showFilters = ref(true) // Afficher les filtres par défaut
const viewMode = ref('grid') // 'grid' ou 'table'

const filters = ref({
  search: '',
  status: '',
  inventory: '',
})

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'iccid', label: 'ICCID', sortable: true },
  { key: 'mapped_imsi', label: 'IMSI', sortable: true },
  { key: 'sim_status', label: 'Statut', sortable: true },
  { key: 'country_code', label: 'Pays', sortable: true },
  { key: 'created_at', label: 'Créé le', sortable: true },
]

// Fonction pour obtenir la valeur d'un champ (gère les valeurs null/undefined)
const getValue = (item, key) => {
  if (!item) return '-'
  const value = item[key]
  if (value === null || value === undefined || value === '') return '-'
  return value
}

const { debouncedFn: debouncedSearch } = useDebounce(() => {
  loadEsims()
}, 500)

const handlePageChange = async (page) => {
  await loadEsims(page)
}

const loadEsims = async (page = 1) => {
  loading.value = true
  try {
    const params = { page, ...filters.value }
    const response = await esimsApi.list(params)
    const data = response.data
    console.log('[ESIMS] Réponse API:', { data, has_esims: !!data.esims, has_data: !!data.data })
    // L'API retourne {success: true, esims: [...], stats: {...}} pour admin
    // ou {success: true, data: [...], pagination: {...}} pour partenaire
    esims.value = data.esims || data.data || []
    if (data.stats) {
      stats.value = data.stats
    }
    // Si pas de pagination dans la réponse, créer une pagination par défaut
    pagination.value = data.pagination || {
      current_page: 1,
      per_page: 15,
      total: esims.value.length,
      last_page: 1,
    }
    console.log('[ESIMS] eSIMs chargés:', esims.value.length)
    // Charger les stats si elles ne sont pas déjà chargées
    if (!stats.value) {
      await loadStats()
    }
  } catch (error) {
    console.error('Erreur chargement eSIMs:', error)
    esims.value = []
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await esimsApi.stats()
    if (response.data && response.data.success) {
      stats.value = response.data.stats || response.data
    } else {
      // Si l'endpoint n'existe pas, utiliser les stats de la liste
      stats.value = {
        total: pagination.value?.total || 0,
        available: esims.value.filter(e => !e.is_assigned || e.sim_status === 'pre-service' || e.sim_status === 'pre_service').length,
        unassigned: esims.value.filter(e => !e.is_assigned).length,
        in_service: esims.value.filter(e => e.sim_status === 'in-service' || e.sim_status === 'in_service').length,
        assigned: esims.value.filter(e => e.is_assigned || e.order_id).length,
        by_status: {}
      }
    }
  } catch (error) {
    console.error('Erreur chargement stats:', error)
    // En cas d'erreur, utiliser les stats calculées depuis la liste
    stats.value = {
      total: pagination.value?.total || esims.value.length,
      available: esims.value.filter(e => !e.is_assigned || e.sim_status === 'pre-service' || e.sim_status === 'pre_service').length,
      unassigned: esims.value.filter(e => !e.is_assigned).length,
      in_service: esims.value.filter(e => e.sim_status === 'in-service' || e.sim_status === 'in_service').length,
      assigned: esims.value.filter(e => e.is_assigned || e.order_id).length,
      by_status: {}
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      const parts = dateString.split(' ')
      if (parts.length > 0) {
        const dateOnly = new Date(parts[0])
        if (!isNaN(dateOnly.getTime())) {
          return dateOnly.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        }
      }
      return '-'
    }
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (e) {
    return '-'
  }
}

const formatStatus = (status) => {
  if (!status) return 'Inconnu'
  const statusMap = {
    'pre-service': 'Pré-service',
    'pre_service': 'Pré-service',
    'in-service': 'En service',
    'in_service': 'En service',
    'terminated': 'Terminé',
  }
  return statusMap[status.toLowerCase()] || status
}

const getStatusBadgeClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  const statusLower = status.toLowerCase()
  if (statusLower === 'pre-service' || statusLower === 'pre_service') {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  } else if (statusLower === 'in-service' || statusLower === 'in_service') {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  } else if (statusLower === 'terminated') {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusDotClass = (status) => {
  if (!status) return 'bg-gray-500'
  const statusLower = status.toLowerCase()
  if (statusLower === 'pre-service' || statusLower === 'pre_service') {
    return 'bg-yellow-500'
  } else if (statusLower === 'in-service' || statusLower === 'in_service') {
    return 'bg-green-500'
  } else if (statusLower === 'terminated') {
    return 'bg-red-500'
  }
  return 'bg-gray-500'
}

const getStatusCount = (status) => {
  if (!stats.value?.by_status) return 0
  const statusKey = status === 'in-service' ? 'in-service' : status
  return stats.value.by_status[statusKey]?.count || 0
}

const getPageNumbers = () => {
  if (!pagination.value) return []
  
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(last, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    success('Copié dans le presse-papiers !')
  } catch (err) {
    console.error('Erreur copie:', err)
  }
}

const clearAllFilters = () => {
  filters.value = {
    search: '',
    status: '',
    inventory: '',
  }
  loadEsims(1)
}

onMounted(() => {
  loadEsims()
  loadStats()
  
  // Forcer le mode clair si c'est un utilisateur partenaire
  const userType = authService.getCurrentUser()?.user_type || localStorage.getItem('auth_user_type')
  if (userType === 'partner') {
    document.documentElement.classList.remove('dark')
  }
})

onUnmounted(() => {
  const userType = authService.getCurrentUser()?.user_type || localStorage.getItem('auth_user_type')
  if (userType === 'partner') {
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
  }
})
</script>
