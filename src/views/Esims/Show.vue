<template>
  <div class="space-y-6">
    <!-- Header avec breadcrumb -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link
          to="/esims"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </router-link>
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-cyan-400">
            📱 Détails eSIM
          </h1>
          <p v-if="esim?.local?.iccid" class="text-gray-600 dark:text-gray-400 mt-1 font-mono text-sm">
            {{ esim.local.iccid }}
          </p>
        </div>
      </div>
      <div v-if="esim" class="flex items-center space-x-3">
        <span
          class="px-4 py-2 text-sm font-semibold rounded-full inline-flex items-center"
          :class="getStatusClass(getSimStatus())"
        >
          <span :class="getStatusIconClass(getSimStatus())" class="w-2 h-2 rounded-full mr-2"></span>
          {{ formatStatus(getSimStatus()) }}
        </span>
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
    <div v-else-if="esim" class="space-y-6">
      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-blue-100 text-sm font-medium">ID</span>
            <svg class="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <p class="text-2xl font-bold">{{ esim.local?.id || '-' }}</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-100 text-sm font-medium">IMSI</span>
            <svg class="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-lg font-bold font-mono truncate">{{ esim.local?.mapped_imsi || esim.console_connect?.mapped_imsi || '-' }}</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-purple-100 text-sm font-medium">Type</span>
            <svg class="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-xl font-bold">{{ esim.console_connect?.sim_type || 'eSIM' }}</p>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-orange-100 text-sm font-medium">Créé le</span>
            <svg class="w-6 h-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-sm font-semibold">{{ formatDateShort(esim.local?.created_at || esim.local?.operator_created_at) }}</p>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'overview'"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Vue d'ensemble
              </div>
            </button>
            <button
              @click="activeTab = 'rating'"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'rating'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Facturation
              </div>
            </button>
          </nav>
        </div>

        <!-- Overview Tab Content -->
        <div v-if="activeTab === 'overview'" class="p-6 space-y-6">
          <!-- General Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informations Générales
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">ICCID</label>
                <div class="flex items-center justify-between">
                  <p class="text-gray-900 dark:text-gray-100 font-mono text-sm">{{ esim.local?.iccid || '-' }}</p>
                  <button
                    @click="copyToClipboard(esim.local?.iccid)"
                    class="ml-2 p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    title="Copier ICCID"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Date de Création (UTC)</label>
                <p class="text-gray-900 dark:text-gray-100 text-sm">{{ formatDate(esim.local?.created_at || esim.local?.operator_created_at) }}</p>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Type SIM</label>
                <p class="text-gray-900 dark:text-gray-100 text-sm">{{ esim.console_connect?.sim_type || 'eSIM' }}</p>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Statut SIM</label>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusClass(getSimStatus())"
                >
                  <span :class="getStatusIconClass(getSimStatus())" class="w-2 h-2 rounded-full mr-2"></span>
                  {{ formatStatus(getSimStatus()) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Service Status -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Statut des Services
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-green-800 dark:text-green-300">Données</span>
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-green-700 dark:text-green-400">Activé</p>
              </div>

              <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-green-800 dark:text-green-300">SMS</span>
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-green-700 dark:text-green-400">Activé</p>
              </div>

              <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-green-800 dark:text-green-300">Voix</span>
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-green-700 dark:text-green-400">Activé</p>
              </div>
            </div>
          </div>

          <!-- IMSI Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              IMSI
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Mapped IMSI</label>
                <p class="text-gray-900 dark:text-gray-100 font-mono text-sm">{{ esim.local?.mapped_imsi || esim.console_connect?.mapped_imsi || '-' }}</p>
              </div>
              <div v-if="esim.euicc_profile?.imsi" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">IMSI 26</label>
                <p class="text-gray-900 dark:text-gray-100 font-mono text-sm">{{ esim.euicc_profile.imsi }}</p>
              </div>
            </div>
          </div>

          <!-- Packages associés -->
          <div v-if="esim.packages && esim.packages.length > 0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Packages Associés ({{ esim.packages.length }})
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="packageItem in esim.packages"
                :key="packageItem.id"
                class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-base font-bold text-gray-900 dark:text-gray-100 truncate mb-0.5">
                      {{ packageItem.plan_name || 'Package #' + packageItem.id }}
                    </h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {{ packageItem.country_name || packageItem.country_code || 'N/A' }}
                    </p>
                  </div>
                  <span
                    class="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0"
                    :class="packageItem.status === 'archived' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'"
                  >
                    {{ packageItem.status === 'archived' ? 'Archivé' : 'Actif' }}
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div class="bg-white dark:bg-gray-800/50 rounded-md p-2">
                    <span class="text-gray-500 dark:text-gray-400 block mb-0.5">Données</span>
                    <span class="font-semibold text-gray-900 dark:text-gray-100">
                      {{ packageItem.data_limit ? (packageItem.data_limit >= 1024 ? (packageItem.data_limit / 1024).toFixed(1) + ' GB' : packageItem.data_limit + ' MB') : 'N/A' }}
                    </span>
                  </div>
                  <div class="bg-white dark:bg-gray-800/50 rounded-md p-2">
                    <span class="text-gray-500 dark:text-gray-400 block mb-0.5">Validité</span>
                    <span class="font-semibold text-gray-900 dark:text-gray-100">
                      {{ packageItem.validity_days ? packageItem.validity_days + 'j' : 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- EUICC Profile -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Profil EUICC
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">État</label>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                  :class="getEuiccStateClass(esim.euicc_profile?.state)"
                >
                  {{ esim.euicc_profile?.state || 'N/A' }}
                </span>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Dernière Opération</label>
                <p class="text-gray-900 dark:text-gray-100 text-sm">{{ formatDate(esim.euicc_profile?.last_operation_date) }}</p>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:col-span-2">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Code d'Activation</label>
                <div class="flex items-center space-x-2">
                  <input
                    :type="showActivationCode ? 'text' : 'password'"
                    :value="esim.local?.activation_code || esim.euicc_profile?.activation_code || '-'"
                    readonly
                    class="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm dark:text-gray-100"
                  />
                  <button
                    @click="showActivationCode = !showActivationCode"
                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg v-if="!showActivationCode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.736m0 0L21 21" />
                    </svg>
                  </button>
                  <button
                    v-if="esim.lpa || esim.local?.lpa"
                    @click="copyToClipboard(esim.lpa || esim.local?.lpa)"
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors"
                  >
                    Copier LPA
                  </button>
                </div>
                <div v-if="getQrCodeUrl()" class="mt-4 flex items-center space-x-3">
                  <button
                    @click="showQrCode = !showQrCode"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 8h4.01M3 12h4.01M12 16v-4m0 0H8m4 0h4.01" />
                    </svg>
                    {{ showQrCode ? 'Masquer QR Code' : 'Afficher QR Code' }}
                  </button>
                  <button
                    @click="downloadQrCode"
                    :disabled="!getQrCodeUrl()"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger QR Code
                  </button>
                </div>
                <div v-if="showQrCode && getQrCodeUrl()" class="mt-4 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center">
                  <img :src="getQrCodeUrl()" alt="QR Code eSIM" class="w-64 h-64 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg" />
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                    Scannez ce QR code avec votre téléphone pour activer automatiquement l'eSIM
                  </p>
                </div>
              </div>

              <div v-if="esim.euicc_profile?.eid" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">EID</label>
                <p class="text-gray-900 dark:text-gray-100 font-mono text-sm">{{ esim.euicc_profile.eid }}</p>
              </div>

              <div v-if="esim.euicc_profile?.profile_reuse_policy" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Réutilisation Activée</label>
                <p class="text-gray-900 dark:text-gray-100 text-sm">{{ esim.euicc_profile.profile_reuse_policy.reuse_enabled ? 'Oui' : 'Non' }}</p>
              </div>
            </div>
          </div>

          <!-- MSISDNs -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              MSISDNs
            </h3>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <p v-if="!esim.console_connect?.msisdns || esim.console_connect.msisdns.length === 0" class="text-gray-600 dark:text-gray-400">
                Aucun MSISDN assigné
              </p>
              <div v-else class="flex flex-wrap gap-2">
                <span
                  v-for="msisdn in esim.console_connect.msisdns"
                  :key="msisdn"
                  class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100"
                >
                  {{ msisdn }}
                </span>
              </div>
            </div>
          </div>

          <!-- APNs -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                APNs
              </div>
              <button
                @click="refreshApns"
                class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </h3>
            <div class="space-y-4">
              <div v-if="esim.console_connect?.apns?.['3g']" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Réseau 3G</label>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="apn in esim.console_connect.apns['3g']"
                    :key="apn"
                    class="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100"
                  >
                    {{ apn }}
                    <button
                      @click="copyToClipboard(apn)"
                      class="ml-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>
              <div v-if="esim.console_connect?.apns?.['4g_lte_5g']" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Réseau 4G/LTE/5G</label>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="apn in esim.console_connect.apns['4g_lte_5g']"
                    :key="apn"
                    class="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100"
                  >
                    {{ apn }}
                    <button
                      @click="copyToClipboard(apn)"
                      class="ml-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>
              <div v-if="!esim.console_connect?.apns || (Object.keys(esim.console_connect.apns).length === 0)" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p class="text-gray-600 dark:text-gray-400">Aucune information APN disponible</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Rating and Charging Tab Content -->
        <div v-if="activeTab === 'rating'" class="p-6 space-y-6">
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-sm text-yellow-800 dark:text-yellow-300">
                Un crédit de package et un solde insuffisants peuvent entraîner des interruptions de service. Consultez l'onglet Facturation pour voir ou modifier les détails.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Groupe de Facturation</label>
              <p class="text-gray-900 dark:text-gray-100 text-sm">{{ esim.console_connect?.billing_group_id || 'N/A' }}</p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Solde Débité Depuis</label>
              <p class="text-gray-900 dark:text-gray-100 text-sm">{{ esim.console_connect?.balance_drains_from || 'Solde SIM' }}</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <label class="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide mb-1 block">Solde SIM</label>
              <p class="text-2xl font-bold text-green-700 dark:text-green-400">
                {{ formatCurrency(esim.console_connect?.sim_balance) }} {{ esim.console_connect?.currency || 'USD' }}
              </p>
            </div>

            <div class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
              <label class="text-xs font-medium text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-1 block">Découvert SIM</label>
              <p class="text-2xl font-bold text-orange-700 dark:text-orange-400">
                {{ formatCurrency(esim.console_connect?.sim_overdraft) }} {{ esim.console_connect?.currency || 'USD' }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:col-span-2">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Résumé des Packages Actifs</label>
              <p class="text-gray-900 dark:text-gray-100 text-sm">{{ esim.console_connect?.active_packages_summary || 'Aucun package actif trouvé' }}</p>
            </div>
          </div>

          <!-- Policies -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Politiques
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">
                  Vitesse de Limitation (kbps)
                </label>
                <p class="text-gray-900 dark:text-gray-100 text-sm">{{ esim.console_connect?.throttle_speed ?? '0' }}</p>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block flex items-center">
                  ID de Configuration de Route
                  <span class="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded">BETA</span>
                </label>
                <p class="text-gray-900 dark:text-gray-100 text-sm">{{ esim.console_connect?.route_configuration_id || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { esims as esimsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { authService } from '@/services/auth'

const route = useRoute()
const loading = ref(true)
const esim = ref(null)
const error = ref('')
const activeTab = ref('overview')
const showActivationCode = ref(false)
const showQrCode = ref(false)
const { success, error: showError } = useToast()

const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    if (typeof date === 'number') {
      return new Date(date).toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch (e) {
    return 'N/A'
  }
}

const formatDateShort = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch (e) {
    return 'N/A'
  }
}

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0.00'
  return parseFloat(value).toFixed(2)
}

const getSimStatus = () => {
  if (!esim.value) return null
  const status = esim.value.local?.sim_status || 
                 esim.value.console_connect?.status || 
                 esim.value.console_connect?.sim_status ||
                 null
  return status && status.trim() !== '' ? status : null
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  const statusMap = {
    'pre-service': 'Pre-Service',
    'pre_service': 'Pre-Service',
    'in-service': 'In-Service',
    'in_service': 'In-Service',
    'terminated': 'Terminated',
  }
  return statusMap[status.toLowerCase()] || status
}

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  const statusLower = status.toLowerCase()
  const classes = {
    'pre-service': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'pre_service': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'in-service': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'in_service': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'terminated': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return classes[statusLower] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusIconClass = (status) => {
  if (!status) return 'bg-gray-400'
  const statusLower = status.toLowerCase()
  const classes = {
    'pre-service': 'bg-yellow-500',
    'pre_service': 'bg-yellow-500',
    'in-service': 'bg-green-500',
    'in_service': 'bg-green-500',
    'terminated': 'bg-red-500',
  }
  return classes[statusLower] || 'bg-gray-400'
}

const getEuiccStateClass = (state) => {
  if (!state) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  const stateLower = state.toLowerCase()
  if (stateLower.includes('released')) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
  if (stateLower.includes('installed')) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const copyToClipboard = async (text) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    success('Copié dans le presse-papiers !')
  } catch (err) {
    showError('Erreur lors de la copie')
    console.error('Erreur copie:', err)
  }
}

// Fonction pour obtenir l'URL du QR code
const getQrCodeUrl = () => {
  if (esim.value?.qr_code_url) {
    return esim.value.qr_code_url
  }
  // Si pas de qr_code_url mais qu'on a un LPA, générer l'URL
  if (esim.value?.local?.lpa) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(esim.value.local.lpa)}`
  }
  // Si pas de LPA mais qu'on a activation_code et sm_dp_address, construire le LPA
  if (esim.value?.local?.activation_code) {
    const smDpAddress = esim.value.local.sm_dp_address || 'consumer.rsp.global'
    const lpa = `LPA:1$${smDpAddress}$${esim.value.local.activation_code}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(lpa)}`
  }
  return null
}

const downloadQrCode = async () => {
  const qrCodeUrl = getQrCodeUrl()
  if (!qrCodeUrl) {
    showError('QR Code non disponible pour cette eSIM')
    return
  }
  
  try {
    const response = await fetch(qrCodeUrl)
    const blob = await response.blob()
    const filename = `qrcode-esim-${esim.value.local?.iccid || esim.value.local?.id || 'unknown'}.png`
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success('QR Code téléchargé avec succès !')
  } catch (err) {
    console.error('Erreur téléchargement QR Code:', err)
    showError('Erreur lors du téléchargement du QR Code')
  }
}

const refreshApns = async () => {
  success('APNs actualisés (simulé)!')
}

const loadEsim = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await esimsApi.show(route.params.id)
    if (response.data.success) {
      esim.value = response.data.esim
    } else {
      error.value = response.data.message || 'Erreur lors du chargement de l\'eSIM'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du chargement de l\'eSIM'
    console.error('Erreur chargement eSIM:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEsim()
  
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
