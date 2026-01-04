<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion des Utilisateurs</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Gérer les utilisateurs admin de la plateforme</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        + Nouvel Utilisateur
      </button>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-blue-100 text-sm font-medium">Total Utilisateurs</span>
          <svg class="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ users.length }}</p>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-green-100 text-sm font-medium">Admins</span>
          <svg class="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ adminCount }}</p>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-purple-100 text-sm font-medium">Support</span>
          <svg class="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ supportCount }}</p>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-orange-100 text-sm font-medium">Autres Rôles</span>
          <svg class="w-6 h-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ otherRolesCount }}</p>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            @input="handleSearch"
          />
        </div>
        <div class="w-full md:w-64">
          <select
            v-model="roleFilter"
            @change="loadUsers"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Tous les rôles</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="card">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="text-gray-600 dark:text-gray-400">Aucun utilisateur trouvé</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gradient-to-r from-primary-600 to-cyan-600">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Utilisateur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Rôle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Téléphone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Créé le</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getRoleClass(user.role?.name)"
                >
                  {{ user.role?.name || 'Aucun rôle' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ user.phone || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editUser(user)"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="handleDelete(user)"
                    :disabled="user.id === currentUserId"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="user.id === currentUserId ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'"
                    :title="user.id === currentUserId ? 'Vous ne pouvez pas supprimer votre propre compte' : 'Supprimer'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Affichage de {{ (pagination.current_page - 1) * pagination.per_page + 1 }} à {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} sur {{ pagination.total }} utilisateurs
        </div>
        <div class="flex space-x-2">
          <button
            @click="loadUsers(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button
            @click="loadUsers(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Création/Modification -->
    <Modal
      v-model="showCreateModal"
      :title="editingUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'"
    >
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom complet <span class="text-red-500">*</span>
            </label>
            <input
              v-model="userForm.name"
              type="text"
              required
              maxlength="255"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="ex: Jean Dupont"
              :disabled="saving"
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
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="ex: jean.dupont@wawtelecom.com"
              :disabled="saving"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <input
              v-model="userForm.phone"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="ex: +221 77 123 45 67"
              :disabled="saving"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rôle <span class="text-red-500">*</span>
            </label>
            <select
              v-model="userForm.role_id"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              :disabled="saving"
            >
              <option value="">Sélectionner un rôle</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe <span class="text-gray-500">(optionnel - un email d'invitation sera envoyé)</span>
            </label>
            <input
              v-model="userForm.password"
              type="password"
              minlength="6"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="Laisser vide pour envoyer un email d'invitation"
              :disabled="saving"
            />
            <p class="mt-1 text-xs text-gray-500">Si vous laissez vide, un email d'invitation sera envoyé à l'utilisateur pour définir son mot de passe.</p>
          </div>
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          @click="showCreateModal = false; editingUser = null; resetForm()"
          class="btn-secondary mr-3"
          :disabled="saving"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="saving"
          class="btn-primary disabled:opacity-50"
        >
          <span v-if="saving" class="inline-block animate-spin mr-2">⏳</span>
          {{ editingUser ? 'Modifier' : 'Créer' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { users as usersApi, roles as rolesApi } from '@/services/api'
import Modal from '@/components/common/Modal.vue'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError, showWarning, showInfo } = useNotification()

const loading = ref(false)
const users = ref([])
const roles = ref([])
const pagination = ref(null)
const showCreateModal = ref(false)
const editingUser = ref(null)
const saving = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')

const currentUserId = ref(null)

const userForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  role_id: '',
})

const filteredUsers = computed(() => {
  let result = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone && user.phone.includes(query))
    )
  }

  if (roleFilter.value) {
    result = result.filter(user => user.role_id === parseInt(roleFilter.value))
  }

  return result
})

const adminCount = computed(() => {
  return users.value.filter(u => u.role?.name === 'admin').length
})

const supportCount = computed(() => {
  return users.value.filter(u => u.role?.name === 'support').length
})

const otherRolesCount = computed(() => {
  return users.value.filter(u => u.role?.name !== 'admin' && u.role?.name !== 'support').length
})

const getRoleClass = (roleName) => {
  const classes = {
    'admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'support': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'manager': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'viewer': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  }
  return classes[roleName] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const formatDate = (date) => {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch (e) {
    return '-'
  }
}

const loadUsers = async (page = 1) => {
  loading.value = true
  try {
    const params = { page, per_page: 15 }
    if (roleFilter.value) {
      params.role_id = roleFilter.value
    }
    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const response = await usersApi.list(params)
    if (response.data.success) {
      users.value = response.data.data || []
      pagination.value = response.data.pagination || null
    }
  } catch (error) {
    console.error('Erreur chargement utilisateurs:', error)
    users.value = []
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    const response = await rolesApi.list()
    const data = response.data
    roles.value = data.roles || data.data || []
  } catch (error) {
    console.error('Erreur chargement rôles:', error)
    roles.value = []
  }
}

const handleSearch = () => {
  // Recherche côté client pour l'instant
  // On pourrait aussi faire une recherche côté serveur
}

const resetForm = () => {
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role_id: '',
  }
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    password: '',
    role_id: user.role_id,
  }
  showCreateModal.value = true
}

const handleSubmit = async () => {
  saving.value = true
  try {
    const formData = { ...userForm.value }
    
    // Si on modifie et que le mot de passe est vide, ne pas l'envoyer
    if (editingUser.value && !formData.password) {
      delete formData.password
    }

    let response
    if (editingUser.value) {
      response = await usersApi.update(editingUser.value.id, formData)
    } else {
      response = await usersApi.create(formData)
    }
    
    if (response.data.success) {
      let message = editingUser.value ? 'Utilisateur modifié avec succès !' : response.data.message || 'Utilisateur créé avec succès !'
      
      // Si c'est une création et qu'il y a une URL d'invitation, l'afficher
      if (!editingUser.value && response.data.invitation_url) {
        const mailer = response.data.mailer || 'unknown'
        if (mailer === 'log') {
          message += '\n\n⚠️ ATTENTION: Le mailer est configuré sur "log", l\'email n\'a pas été réellement envoyé.\n\nLien d\'invitation à copier et envoyer manuellement:'
        } else {
          message += '\n\nLien d\'invitation (au cas où l\'email ne serait pas reçu):'
        }
        
        showSuccess(message, {
          copyableText: response.data.invitation_url,
        })
      } else {
        showSuccess(message)
      }
      
      showCreateModal.value = false
      editingUser.value = null
      resetForm()
      await loadUsers()
    } else {
      showError(response.data.message || 'Erreur lors de la sauvegarde de l\'utilisateur')
    }
  } catch (error) {
    console.error('Erreur sauvegarde utilisateur:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde de l\'utilisateur'
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat().join(', ')
      showError(errors)
    } else {
      showError(errorMessage)
    }
  } finally {
    saving.value = false
  }
}

const handleDelete = async (user) => {
  if (user.id === currentUserId.value) {
    showWarning('Vous ne pouvez pas supprimer votre propre compte')
    return
  }

  showWarning(
    `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`,
    {
      title: 'Confirmation de suppression',
      showCancel: true,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          const response = await usersApi.delete(user.id)
          if (response.data.success) {
            showSuccess('Utilisateur supprimé avec succès !')
            await loadUsers()
          } else {
            showError(response.data.message || 'Erreur lors de la suppression de l\'utilisateur')
          }
        } catch (error) {
          console.error('Erreur suppression utilisateur:', error)
          const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression de l\'utilisateur'
          showError(errorMessage)
        }
      },
    }
  )
}

onMounted(async () => {
  // Récupérer l'ID de l'utilisateur actuel
  try {
    const authData = localStorage.getItem('auth_user')
    if (authData) {
      const user = JSON.parse(authData)
      currentUserId.value = user.id
    }
  } catch (e) {
    console.error('Erreur récupération utilisateur actuel:', e)
  }

  await Promise.all([loadUsers(), loadRoles()])
})
</script>

