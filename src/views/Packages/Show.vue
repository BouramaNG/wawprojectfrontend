<template>
  <div class="space-y-6">
    <!-- Header avec breadcrumb -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link
          to="/packages"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </router-link>
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-purple-400">
            Détails Package
          </h1>
          <p v-if="package_?.local?.plan_name" class="text-gray-600 dark:text-gray-400 mt-1 font-semibold text-lg">
            {{ package_.local.plan_name }}
          </p>
          <p v-if="package_?.local?.id" class="text-gray-500 dark:text-gray-500 mt-1 text-sm font-mono">
            ID: {{ package_.local.id }}
          </p>
        </div>
      </div>
      <div v-if="package_" class="flex items-center space-x-3">
        <span
          class="px-4 py-2 text-sm font-semibold rounded-full inline-flex items-center"
          :class="getStatusClass(getPackageStatus())"
        >
          <span :class="getStatusIconClass(getPackageStatus())" class="w-2 h-2 rounded-full mr-2"></span>
          {{ formatStatus(getPackageStatus()) }}
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
    <div v-else-if="package_" class="space-y-6">
      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-blue-100 text-sm font-medium">Données</span>
            <svg class="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p class="text-2xl font-bold">{{ formatData(package_.local?.data_limit || package_.telna?.data_usage_allowance) }}</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-100 text-sm font-medium">Validité</span>
            <svg class="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-xl font-bold">{{ formatValidity(package_) }}</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-purple-100 text-sm font-medium">Pays</span>
            <svg class="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-lg font-bold">{{ package_.local?.country_name || package_.local?.country_code || '-' }}</p>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-orange-100 text-sm font-medium">Prix</span>
            <svg class="w-6 h-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-lg font-bold">{{ formatPrice(package_.local?.price) }}</p>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <!-- General Section -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            General
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Package Template Name</label>
              <p class="text-gray-900 dark:text-gray-100 font-semibold">{{ package_.local?.plan_name || package_.telna?.name || 'N/A' }}</p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Package Template ID</label>
              <p class="text-gray-900 dark:text-gray-100 font-mono">{{ package_.local?.id || package_.telna?.id || 'N/A' }}</p>
            </div>

            <div v-if="package_.telna?.preferred_imsi_profile_id" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Preferred IMSI Profile ID</label>
              <p class="text-gray-900 dark:text-gray-100">{{ package_.telna.preferred_imsi_profile_id }}</p>
            </div>

            <div v-if="formatDate(package_.local?.created_at || package_.telna?.created_at)" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Date Created (UTC)</label>
              <p class="text-gray-900 dark:text-gray-100 text-sm">{{ formatDate(package_.local?.created_at || package_.telna?.created_at) }}</p>
            </div>

            <div v-if="formatDate(package_.local?.updated_at || package_.telna?.updated_at)" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Date Modified (UTC)</label>
              <p class="text-gray-900 dark:text-gray-100 text-sm">{{ formatDate(package_.local?.updated_at || package_.telna?.updated_at) }}</p>
            </div>

            <div v-if="formatDate(package_.telna?.deactivated_at)" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Date Deactivated (UTC)</label>
              <p class="text-gray-900 dark:text-gray-100 text-sm">{{ formatDate(package_.telna.deactivated_at) }}</p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Status</label>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                :class="getStatusClass(getPackageStatus())"
              >
                <span :class="getStatusIconClass(getPackageStatus())" class="w-2 h-2 rounded-full mr-2"></span>
                {{ formatStatus(getPackageStatus()) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Traffic Policy Section -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Traffic Policy
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="package_.telna?.traffic_policy_id" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Traffic Policy ID</label>
              <p class="text-gray-900 dark:text-gray-100">{{ package_.telna.traffic_policy_id }}</p>
            </div>

            <div v-if="package_.telna?.traffic_policy_description" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Traffic Policy Description</label>
              <p class="text-gray-900 dark:text-gray-100">{{ package_.telna.traffic_policy_description }}</p>
            </div>
          </div>
        </div>

        <!-- Allowances Section -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Allowances
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <label class="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1 block">Data (MB)</label>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-300">{{ formatDataMB(package_.local?.data_limit || package_.telna?.data_usage_allowance) }}</p>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <label class="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-1 block">Voice (Hours)</label>
              <p class="text-2xl font-bold text-purple-900 dark:text-purple-300">{{ package_.telna?.voice_allowance_hours || '0' }}</p>
            </div>

            <div class="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-800 rounded-xl p-4">
              <label class="text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wide mb-1 block">SMS (Number)</label>
              <p class="text-2xl font-bold text-pink-900 dark:text-pink-300">{{ package_.telna?.sms_allowance_count || '0' }}</p>
            </div>

            <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-4">
              <label class="text-xs font-medium text-cyan-700 dark:text-cyan-400 uppercase tracking-wide mb-1 block">Duration Type</label>
              <p class="text-lg font-bold text-cyan-900 dark:text-cyan-300">{{ package_.telna?.duration_type || 'Fixed Duration' }}</p>
            </div>

            <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 md:col-span-2">
              <label class="text-xs font-medium text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-1 block">Duration (Hours)</label>
              <p class="text-2xl font-bold text-orange-900 dark:text-orange-300">{{ formatDurationHours(package_) }}</p>
            </div>
          </div>
        </div>

        <!-- Activation and Availability Policy Section -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Activation and Availability Policy
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="formatDate(package_.telna?.earliest_activation_time)" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Earliest Activation Time (UTC)</label>
              <p class="text-gray-900 dark:text-gray-100 text-sm">{{ formatDate(package_.telna.earliest_activation_time) }}</p>
            </div>

            <div v-if="package_.telna?.activation_expiry_hours" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Activation Expiry (Hours)</label>
              <p class="text-gray-900 dark:text-gray-100">{{ package_.telna.activation_expiry_hours }}</p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Availability</label>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                :class="getAvailabilityClass(package_.telna?.availability)"
              >
                {{ package_.telna?.availability || 'Available' }}
              </span>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Activation Type</label>
              <p class="text-gray-900 dark:text-gray-100">{{ package_.telna?.activation_type || 'Upon Location Updates (the first one)' }}</p>
            </div>

            <div v-if="formatDate(package_.telna?.earliest_available_time)" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Earliest Available Time (UTC)</label>
              <p class="text-gray-900 dark:text-gray-100 text-sm">{{ formatDate(package_.telna.earliest_available_time) }}</p>
            </div>

            <div v-if="formatDate(package_.telna?.latest_available_time)" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Latest Available Time (UTC)</label>
              <p class="text-gray-900 dark:text-gray-100 text-sm">{{ formatDate(package_.telna.latest_available_time) }}</p>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Notes
          </h2>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p class="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{{ package_.local?.plan_name || package_.telna?.notes || 'Aucune note disponible' }}</p>
          </div>
        </div>
      </div>

      <!-- Associated eSIMs Section -->
      <div v-if="esims && esims.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          📱 eSIMs Attachées ({{ esims.length }})
        </h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ICCID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IMSI</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pays</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="esim in esims" :key="esim.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm font-mono text-gray-900 dark:text-gray-100">{{ esim.iccid || '-' }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm font-mono text-gray-900 dark:text-gray-100">{{ esim.mapped_imsi || '-' }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    :class="getEsimStatusClass(esim.sim_status)"
                  >
                    <span :class="getEsimStatusIconClass(esim.sim_status)" class="w-2 h-2 rounded-full mr-2"></span>
                    {{ formatEsimStatus(esim.sim_status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ esim.country_code || '-' }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link
                    v-if="esim.id"
                    :to="`/esims/${esim.id}`"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Voir détails
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { packages as packagesApi } from '@/services/api'

const route = useRoute()
const loading = ref(true)
const package_ = ref(null)
const esims = ref([])
const error = ref('')

const formatData = (mb) => {
  if (!mb && mb !== 0) return '-'
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`
  }
  return `${mb} MB`
}

const formatDataMB = (mb) => {
  if (!mb && mb !== 0) return '0.0000'
  return parseFloat(mb).toFixed(4)
}

const formatValidity = (pkg) => {
  if (pkg?.local?.validity_days) {
    return `${pkg.local.validity_days} jours`
  }
  if (pkg?.telna?.duration_hours) {
    const days = Math.floor(pkg.telna.duration_hours / 24)
    return days > 0 ? `${days} jours` : `${pkg.telna.duration_hours} heures`
  }
  return '-'
}

const formatDurationHours = (pkg) => {
  if (pkg?.telna?.duration_hours) {
    return pkg.telna.duration_hours
  }
  if (pkg?.local?.validity_days) {
    return pkg.local.validity_days * 24
  }
  return '0'
}

const formatPrice = (price) => {
  if (!price && price !== 0) return '-'
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

const formatDate = (date) => {
  if (!date) return null
  try {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch (e) {
    return null
  }
}

const getPackageStatus = () => {
  if (!package_.value) return null
  return package_.value.telna?.status || 
         package_.value.local?.status || 
         (package_.value.local?.is_active ? 'active' : 'inactive') ||
         null
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  const statusMap = {
    'active': 'Active',
    'inactive': 'Inactive',
    'expired': 'Expired',
  }
  return statusMap[status.toLowerCase()] || status
}

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  const statusLower = status.toLowerCase()
  const classes = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'expired': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return classes[statusLower] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusIconClass = (status) => {
  if (!status) return 'bg-gray-400'
  const statusLower = status.toLowerCase()
  const classes = {
    'active': 'bg-green-500',
    'inactive': 'bg-gray-400',
    'expired': 'bg-red-500',
  }
  return classes[statusLower] || 'bg-gray-400'
}

const getAvailabilityClass = (availability) => {
  if (!availability) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  const availLower = availability.toLowerCase()
  if (availLower.includes('available')) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const formatEsimStatus = (status) => {
  if (!status) return 'Unknown'
  const statusMap = {
    'pre-service': 'Pre-Service',
    'in-service': 'In-Service',
    'terminated': 'Terminated',
  }
  return statusMap[status.toLowerCase()] || status
}

const getEsimStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  const statusLower = status.toLowerCase()
  const classes = {
    'pre-service': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'in-service': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'terminated': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return classes[statusLower] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getEsimStatusIconClass = (status) => {
  if (!status) return 'bg-gray-400'
  const statusLower = status.toLowerCase()
  const classes = {
    'pre-service': 'bg-yellow-500',
    'in-service': 'bg-green-500',
    'terminated': 'bg-red-500',
  }
  return classes[statusLower] || 'bg-gray-400'
}

const loadPackage = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await packagesApi.show(route.params.id)
    if (response.data.success) {
      package_.value = response.data.package
      // Charger les eSIMs attachées au package
      if (response.data.esims) {
        esims.value = response.data.esims
      } else if (package_.value?.local?.console_connect_id) {
        // Si pas d'eSIMs dans la réponse, essayer de les charger
        await loadEsims()
      }
    } else {
      error.value = response.data.message || 'Erreur lors du chargement du package'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du chargement du package'
    console.error('Erreur chargement package:', err)
  } finally {
    loading.value = false
  }
}

const loadEsims = async () => {
  try {
    const { esims: esimsApi } = await import('@/services/api')
    const packageId = package_.value?.local?.console_connect_id || package_.value?.local?.id
    if (!packageId) return
    
    // Chercher les eSIMs avec ce package_id (operator_package_id)
    const response = await esimsApi.list({ 
      per_page: 100 
    })
    
    // Filtrer côté client si nécessaire
    if (response.data.success && response.data.esims) {
      esims.value = response.data.esims.filter(esim => 
        esim.operator_package_id === packageId
      )
    } else if (response.data.data) {
      const data = Array.isArray(response.data.data) ? response.data.data : []
      esims.value = data.filter(esim => 
        esim.operator_package_id === packageId
      )
    }
  } catch (err) {
    console.error('Erreur chargement eSIMs:', err)
  }
}

onMounted(() => {
  loadPackage()
})
</script>
