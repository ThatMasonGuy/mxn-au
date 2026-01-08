<template>
  <div class="alias-manager">
    <!-- Header -->
    <div class="manager-header">
      <div>
        <h2 class="font-mono text-lg flex items-center gap-2">
          <span class="text-emerald-400">&gt;</span>
          <span>Custom Aliases</span>
        </h2>
        <p class="text-xs text-gray-500 mt-1">
          Define aliases once, sync to all servers
        </p>
      </div>

      <button @click="showAddModal = true" class="btn-add">
        <span class="font-mono text-sm">+ ADD ALIAS</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
      <p class="text-gray-400 mt-4">Loading aliases...</p>
    </div>

    <!-- Alias List -->
    <div v-else class="alias-list">
      <div v-if="aliases.length === 0" class="empty-state">
        <CommandLineIcon class="w-16 h-16 text-gray-600 mb-4" />
        <p class="text-gray-400 mb-4">No custom aliases yet</p>
        <button @click="loadDefaults" class="btn-secondary mb-2">
          Load Default Aliases
        </button>
        <button @click="showAddModal = true" class="btn-primary">
          Create Your First Alias
        </button>
      </div>

      <div v-else>
        <!-- Categories -->
        <div v-for="category in categories" :key="category" class="category-section">
          <h3 class="category-title">{{ category }}</h3>

          <div class="grid gap-3">
            <div v-for="alias in getAliasesByCategory(category)" :key="alias.id" class="alias-card">

              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <!-- Alias name -->
                  <div class="flex items-center gap-2 mb-2">
                    <span class="alias-name">{{ alias.name }}</span>
                    <span v-if="alias.category" class="alias-badge">
                      {{ alias.category }}
                    </span>
                  </div>

                  <!-- Command -->
                  <div class="alias-command">
                    <code>{{ alias.command }}</code>
                  </div>

                  <!-- Description -->
                  <p v-if="alias.description" class="alias-description">
                    {{ alias.description }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2">
                  <button @click="copyAlias(alias)" class="action-btn" title="Copy command">
                    <DocumentDuplicateIcon class="w-4 h-4" />
                  </button>

                  <button @click="editAlias(alias)" class="action-btn" title="Edit">
                    <PencilIcon class="w-4 h-4" />
                  </button>

                  <button @click="confirmDelete(alias)" class="action-btn text-red-400 hover:bg-red-500/10"
                    title="Delete">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Setup Instructions -->
        <div class="setup-section">
          <h3 class="setup-title">🚀 Apply to New Server</h3>
          <p class="text-sm text-gray-400 mb-4">
            Run this command on your server to install all aliases:
          </p>

          <div class="setup-command-box">
            <pre class="setup-command">{{ setupCommand }}</pre>
            <button @click="copySetupCommand" class="copy-btn">
              <DocumentDuplicateIcon class="w-4 h-4" />
              <span>COPY</span>
            </button>
          </div>

          <button @click="showScriptModal = true" class="btn-secondary mt-3">
            View Full Script
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="font-mono text-lg">
                {{ editingAlias ? 'Edit Alias' : 'Add New Alias' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-200">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>

            <form @submit.prevent="saveAlias" class="modal-body">
              <!-- Alias Name -->
              <div class="form-group">
                <label class="form-label">Alias Name</label>
                <input v-model="formData.name" type="text" class="form-input font-mono" placeholder="ll"
                  pattern="[a-zA-Z0-9_-]+" required />
                <p class="form-hint">
                  Letters, numbers, hyphens, and underscores only
                </p>
              </div>

              <!-- Command -->
              <div class="form-group">
                <label class="form-label">Command</label>
                <input v-model="formData.command" type="text" class="form-input font-mono" placeholder="ls -lah"
                  required />
                <p class="form-hint">
                  The actual command that will be executed
                </p>
              </div>

              <!-- Description -->
              <div class="form-group">
                <label class="form-label">Description (optional)</label>
                <input v-model="formData.description" type="text" class="form-input"
                  placeholder="List all files in long format" />
              </div>

              <!-- Category -->
              <div class="form-group">
                <label class="form-label">Category</label>
                <select v-model="formData.category" class="form-input">
                  <option value="navigation">Navigation</option>
                  <option value="system">System</option>
                  <option value="network">Network</option>
                  <option value="git">Git</option>
                  <option value="docker">Docker</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <!-- Preview -->
              <div class="preview-box">
                <div class="text-xs text-gray-500 mb-2">Preview:</div>
                <code class="text-sm">
                  alias {{ formData.name || 'name' }}='{{ formData.command || 'command' }}'
                </code>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 mt-6">
                <button type="submit" class="btn-primary flex-1">
                  {{ editingAlias ? 'Update Alias' : 'Add Alias' }}
                </button>
                <button type="button" @click="closeModal" class="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Script View Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showScriptModal" class="modal-overlay" @click.self="showScriptModal = false">
          <div class="modal-content max-w-3xl">
            <div class="modal-header">
              <h3 class="font-mono text-lg">Alias Setup Script</h3>
              <button @click="showScriptModal = false" class="text-gray-400 hover:text-gray-200">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>

            <div class="modal-body">
              <p class="text-sm text-gray-400 mb-4">
                This script will be appended to your ~/.bashrc file:
              </p>

              <div class="script-box">
                <pre class="text-xs">{{ aliasScript }}</pre>
              </div>

              <button @click="copyScript" class="btn-primary w-full mt-4">
                <DocumentDuplicateIcon class="w-4 h-4 inline mr-2" />
                Copy Full Script
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="deleteConfirm" class="modal-overlay" @click.self="deleteConfirm = null">
          <div class="modal-content max-w-md">
            <div class="modal-header">
              <h3 class="font-mono text-lg text-red-400">Delete Alias</h3>
            </div>

            <div class="modal-body">
              <p class="text-gray-300 mb-4">
                Are you sure you want to delete
                <span class="font-mono text-emerald-400">{{ deleteConfirm?.name }}</span>?
              </p>

              <div class="flex gap-3 mt-6">
                <button @click="performDelete" class="btn-danger flex-1">
                  Delete Alias
                </button>
                <button @click="deleteConfirm = null" class="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  CommandLineIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'
import { useAliases } from '@/composables/useAliases'
import { toast } from 'vue-sonner'

const {
  aliases,
  loading,
  loadAliases,
  addAlias,
  updateAlias,
  deleteAlias,
  generateAliasScript,
  getSetupCommand,
  getDefaultAliases
} = useAliases()

// State
const showAddModal = ref(false)
const showScriptModal = ref(false)
const editingAlias = ref(null)
const deleteConfirm = ref(null)

// Form data
const defaultFormData = {
  name: '',
  command: '',
  description: '',
  category: 'custom'
}

const formData = ref({ ...defaultFormData })

// Computed
const categories = computed(() => {
  const cats = [...new Set(aliases.value.map(a => a.category || 'custom'))]
  return cats.sort()
})

const aliasScript = computed(() => generateAliasScript())
const setupCommand = computed(() => getSetupCommand())

// Methods
onMounted(async () => {
  await loadAliases()
})

const getAliasesByCategory = (category) => {
  return aliases.value.filter(a => (a.category || 'custom') === category)
}

const loadDefaults = async () => {
  const defaults = getDefaultAliases()
  for (const alias of defaults) {
    try {
      await addAlias(alias)
    } catch (error) {
      console.error('Error loading default alias:', error)
    }
  }
}

const editAlias = (alias) => {
  editingAlias.value = alias
  formData.value = { ...alias }
  showAddModal.value = true
}

const saveAlias = async () => {
  try {
    if (editingAlias.value) {
      await updateAlias(editingAlias.value.id, formData.value)
    } else {
      await addAlias(formData.value)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving alias:', error)
    alert('Failed to save alias. Check console for details.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingAlias.value = null
  formData.value = { ...defaultFormData }
}

const confirmDelete = (alias) => {
  deleteConfirm.value = alias
}

const performDelete = async () => {
  try {
    await deleteAlias(deleteConfirm.value.id)
    deleteConfirm.value = null
  } catch (error) {
    console.error('Error deleting alias:', error)
  }
}

const copyAlias = async (alias) => {
  try {
    await navigator.clipboard.writeText(alias.command)
    toast.success(`Copied: ${alias.name}`)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const copySetupCommand = async () => {
  try {
    await navigator.clipboard.writeText(setupCommand.value)
    toast.success('Setup command copied!')
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const copyScript = async () => {
  try {
    await navigator.clipboard.writeText(aliasScript.value)
    toast.success('Full script copied!')
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}
</script>

<style scoped>
.alias-manager {
  background: #0d1117;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.manager-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.alias-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.category-section {
  margin-bottom: 32px;
}

.category-title {
  font-family: monospace;
  font-size: 0.875rem;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(16, 185, 129, 0.2);
}

.alias-card {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.2s;
}

.alias-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(16, 185, 129, 0.3);
}

.alias-name {
  font-family: monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #10b981;
}

.alias-badge {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 4px;
  font-size: 0.625rem;
  font-family: monospace;
  color: #10b981;
  text-transform: uppercase;
}

.alias-command {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  margin-bottom: 8px;
}

.alias-command code {
  font-family: monospace;
  font-size: 0.875rem;
  color: #e5e7eb;
}

.alias-description {
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
}

.setup-section {
  margin-top: 32px;
  padding: 20px;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
}

.setup-title {
  font-family: monospace;
  font-size: 1rem;
  color: #10b981;
  margin-bottom: 8px;
}

.setup-command-box {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 12px;
  padding-right: 80px;
}

.setup-command {
  font-family: monospace;
  font-size: 0.75rem;
  color: #e5e7eb;
  overflow-x: auto;
}

.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 4px;
  color: #10b981;
  font-family: monospace;
  font-size: 0.75rem;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: rgba(16, 185, 129, 0.3);
  border-color: #10b981;
}

.script-box {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.script-box pre {
  font-family: monospace;
  color: #e5e7eb;
  line-height: 1.6;
}

.preview-box {
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  padding: 6px;
  border-radius: 4px;
  color: #9ca3af;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e5e7eb;
}

.btn-add {
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  color: #10b981;
  transition: all 0.2s;
}

.btn-add:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
}

.btn-primary {
  padding: 10px 20px;
  background: #10b981;
  color: #0d1117;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.2s;
  font-family: monospace;
}

.btn-primary:hover {
  background: #059669;
}

.btn-secondary {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s;
  font-family: monospace;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-danger {
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.2s;
  font-family: monospace;
}

.btn-danger:hover {
  background: #dc2626;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.modal-content {
  background: #161b22;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-family: monospace;
  color: #10b981;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e5e7eb;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(255, 255, 255, 0.04);
}

.form-hint {
  margin-top: 6px;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>