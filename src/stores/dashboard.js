import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboard } from '@/services/api'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: ref({
      totalEsims: 0,
      availableEsims: 0,
      activePackages: 0,
      totalOrders: 0,
      monthlyRevenue: 0,
      activePartners: 0,
      activeTemplates: 0,
    }),
    loading: ref(false),
    activities: ref([]),
  }),

  actions: {
    async fetchStats() {
      this.loading = true
      try {
        const response = await dashboard.stats()
        this.stats = response.data
      } catch (error) {
        console.error('Erreur chargement stats:', error)
      } finally {
        this.loading = false
      }
    },
  },
})

