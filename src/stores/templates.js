import { defineStore } from 'pinia'
import { ref } from 'vue'
import { templates } from '@/services/api'

export const useTemplatesStore = defineStore('templates', {
  state: () => ({
    items: ref([]),
    current: ref(null),
    loading: ref(false),
    pagination: ref({
      current_page: 1,
      per_page: 15,
      total: 0,
    }),
    filters: ref({
      search: '',
      status: '',
      country_code: '',
    }),
  }),

  actions: {
    async fetchList(params = {}) {
      this.loading = true
      try {
        const response = await templates.list({
          ...this.filters,
          ...params,
          page: this.pagination.current_page,
        })
        // L'API retourne {success: true, templates: [...], pagination: {...}}
        const data = response.data
        this.items = data.templates || data.data || []
        if (data.pagination) {
          this.pagination = {
            current_page: data.pagination.current_page || 1,
            per_page: data.pagination.per_page || 15,
            total: data.pagination.total || 0,
            last_page: data.pagination.last_page || 1,
          }
        }
      } catch (error) {
        console.error('Erreur chargement templates:', error)
        this.items = []
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id) {
      this.loading = true
      try {
        const response = await templates.show(id)
        this.current = response.data
        return response.data
      } catch (error) {
        console.error('Erreur chargement template:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      try {
        const response = await templates.create(data)
        return response.data
      } catch (error) {
        console.error('Erreur création template:', error)
        throw error
      }
    },

    async update(id, data) {
      try {
        const response = await templates.update(id, data)
        return response.data
      } catch (error) {
        console.error('Erreur mise à jour template:', error)
        throw error
      }
    },
  },
})

