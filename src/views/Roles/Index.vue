<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestion des Rôles</h1>
        <p class="text-gray-600 mt-1">Gérer les rôles et permissions des utilisateurs</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        + Nouveau Rôle
      </button>
    </div>

    <div class="card">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <DataTable
        v-else
        :columns="columns"
        :data="roles"
        :pagination="null"
        :actions="true"
      >
        <template #cell-users_count="{ value }">
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {{ value }} utilisateur(s)
          </span>
        </template>

        <template #actions="{ item }">
          <div class="flex items-center space-x-2">
            <button
              @click="managePermissions(item)"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm hover:shadow"
              title="Gérer les permissions"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Permissions
            </button>
            <button
              @click="editRole(item)"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
              title="Modifier le rôle"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
            <button
              @click="handleDelete(item)"
              :disabled="isSystemRole(item)"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              :class="isSystemRole(item) ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'"
              :title="isSystemRole(item) ? 'Rôle système, ne peut pas être supprimé' : 'Supprimer le rôle'"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Modal Création/Modification -->
    <Modal
      v-model="showCreateModal"
      :title="editingRole ? 'Modifier le rôle' : 'Créer un rôle'"
    >
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom du rôle <span class="text-red-500">*</span>
            </label>
            <input
              v-model="roleForm.name"
              type="text"
              required
              maxlength="255"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="ex: manager, editor"
              :disabled="saving"
            />
            <p class="mt-1 text-sm text-gray-500">Le nom sera converti en minuscules automatiquement</p>
          </div>
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          @click="showCreateModal = false; editingRole = null; roleForm.name = ''"
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
          {{ editingRole ? 'Modifier' : 'Créer' }}
        </button>
      </template>
    </Modal>

    <!-- Modal Gestion des Permissions -->
    <Modal
      v-model="showPermissionsModal"
      :title="`Gérer les permissions - ${selectedRole?.name || ''}`"
      max-width="4xl"
    >
      <div v-if="loadingPermissions" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <p class="text-xs text-gray-600 mb-4 sticky top-0 bg-white pb-2 z-10">
          Cochez les permissions que ce rôle peut exécuter. Les utilisateurs avec ce rôle pourront uniquement effectuer les actions autorisées.
        </p>

        <div v-for="(permissions, group) in groupedPermissions" :key="group" class="border border-gray-200 rounded-lg p-3">
          <h3 class="text-sm font-semibold text-gray-900 mb-2 capitalize sticky top-0 bg-white py-1 z-10">{{ group }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label
              v-for="permission in permissions"
              :key="permission.id"
              class="flex items-start space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer border border-gray-200 text-xs"
              :class="{ 'bg-primary-50 border-primary-300': selectedPermissions.includes(permission.id) }"
            >
              <input
                type="checkbox"
                :value="permission.id"
                v-model="selectedPermissions"
                class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 leading-tight">{{ permission.name }}</p>
                <p class="text-xs text-gray-500 leading-tight mt-0.5">{{ permission.description }}</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="showPermissionsModal = false; selectedRole = null; selectedPermissions = []"
          class="btn-secondary mr-3"
          :disabled="savingPermissions"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="savePermissions"
          :disabled="savingPermissions || loadingPermissions"
          class="btn-primary disabled:opacity-50"
        >
          <span v-if="savingPermissions" class="inline-block animate-spin mr-2">⏳</span>
          Enregistrer les permissions
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { roles as rolesApi } from '@/services/api'
import DataTable from '@/components/common/DataTable.vue'
import Modal from '@/components/common/Modal.vue'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError, showWarning } = useNotification()

const loading = ref(false)
const roles = ref([])
const showCreateModal = ref(false)
const editingRole = ref(null)
const saving = ref(false)

// Permissions
const showPermissionsModal = ref(false)
const selectedRole = ref(null)
const allPermissions = ref({})
const selectedPermissions = ref([])
const loadingPermissions = ref(false)
const savingPermissions = ref(false)

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Nom', sortable: true },
  { key: 'users_count', label: 'Utilisateurs', sortable: true },
]

const roleForm = ref({
  name: '',
})

const isSystemRole = (role) => {
  return ['admin', 'user'].includes(role.name.toLowerCase())
}

const loadRoles = async () => {
  loading.value = true
  try {
    const response = await rolesApi.list()
    const data = response.data
    roles.value = data.roles || data.data || []
  } catch (error) {
    console.error('Erreur chargement rôles:', error)
    roles.value = []
  } finally {
    loading.value = false
  }
}

const editRole = (role) => {
  editingRole.value = role
  roleForm.value = {
    name: role.name,
  }
  showCreateModal.value = true
}

const handleSubmit = async () => {
  saving.value = true
  try {
    let response
    if (editingRole.value) {
      response = await rolesApi.update(editingRole.value.id, roleForm.value)
    } else {
      response = await rolesApi.create(roleForm.value)
    }
    
    if (response.data.success) {
      showSuccess(editingRole.value ? 'Rôle modifié avec succès !' : 'Rôle créé avec succès !')
      showCreateModal.value = false
      editingRole.value = null
      roleForm.value = { name: '' }
      await loadRoles()
    } else {
      showError(response.data.message || 'Erreur lors de la sauvegarde du rôle')
    }
  } catch (error) {
    console.error('Erreur sauvegarde rôle:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde du rôle'
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

const handleDelete = async (role) => {
  if (isSystemRole(role)) {
    showWarning('Impossible de supprimer un rôle système (admin, user)')
    return
  }

  showWarning(
    `Êtes-vous sûr de vouloir supprimer le rôle "${role.name}" ?`,
    {
      title: 'Confirmation de suppression',
      showCancel: true,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onConfirm: async () => {
        try {
          const response = await rolesApi.delete(role.id)
          if (response.data.success) {
            showSuccess('Rôle supprimé avec succès !')
            await loadRoles()
          } else {
            showError(response.data.message || 'Erreur lors de la suppression du rôle')
          }
        } catch (error) {
          console.error('Erreur suppression rôle:', error)
          const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression du rôle'
          showError(errorMessage)
        }
      },
    }
  )
}

const groupedPermissions = computed(() => {
  return allPermissions.value
})

const managePermissions = async (role) => {
  selectedRole.value = role
  selectedPermissions.value = []
  showPermissionsModal.value = true
  loadingPermissions.value = true

  try {
    const response = await rolesApi.getPermissions(role.id)
    if (response.data.success) {
      allPermissions.value = response.data.all_permissions || {}
      selectedPermissions.value = response.data.role_permissions || []
    } else {
      showError(response.data.message || 'Erreur lors du chargement des permissions')
    }
  } catch (error) {
    console.error('Erreur chargement permissions:', error)
    showError('Erreur lors du chargement des permissions')
  } finally {
    loadingPermissions.value = false
  }
}

const savePermissions = async () => {
  if (!selectedRole.value) return

  savingPermissions.value = true
  try {
    const response = await rolesApi.updatePermissions(selectedRole.value.id, selectedPermissions.value)
    if (response.data.success) {
      showSuccess('Permissions mises à jour avec succès !')
      showPermissionsModal.value = false
      selectedRole.value = null
      selectedPermissions.value = []
    } else {
      showError(response.data.message || 'Erreur lors de la sauvegarde des permissions')
    }
  } catch (error) {
    console.error('Erreur sauvegarde permissions:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde des permissions'
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat().join(', ')
      showError(errors)
    } else {
      showError(errorMessage)
    }
  } finally {
    savingPermissions.value = false
  }
}

onMounted(() => {
  loadRoles()
})
</script>

