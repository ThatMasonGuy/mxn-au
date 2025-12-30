<template>
  <div class="server-manager">
    <!-- Header -->
    <div class="manager-header">
      <h2 class="font-mono text-lg flex items-center gap-2">
        <span class="text-emerald-400">&gt;</span>
        <span>Server Connections</span>
      </h2>

      <button @click="showAddModal = true" class="btn-add">
        <span class="font-mono text-sm">+ ADD SERVER</span>
      </button>
    </div>

    <!-- Server List -->
    <div class="server-list">
      <div v-if="servers.length === 0" class="empty-state">
        <ServerIcon class="w-16 h-16 text-gray-600 mb-4" />
        <p class="text-gray-400 mb-4">No servers configured yet</p>
        <button @click="showAddModal = true" class="btn-primary">
          Add Your First Server
        </button>
      </div>

      <div v-else class="grid gap-4">
        <div v-for="server in servers" :key="server.id" @click="selectServer(server)" class="server-card"
          :class="{ 'active': selectedServerId === server.id }">

          <!-- Server Info -->
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3 flex-1">
              <!-- Status Indicator -->
              <div class="status-indicator" :class="server.status || 'unknown'">
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="font-mono text-base text-gray-100 mb-1">
                  {{ server.name }}
                </h3>
                <p class="font-mono text-xs text-gray-500 mb-2">
                  {{ server.username }}@{{ server.host }}:{{ server.port || 22 }}
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="tag in server.tags" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button @click.stop="editServer(server)" class="action-btn" title="Edit">
                <PencilIcon class="w-4 h-4" />
              </button>

              <button @click.stop="confirmDelete(server)" class="action-btn text-red-400 hover:bg-red-500/10"
                title="Delete">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Last Connected -->
          <div v-if="server.lastConnected" class="mt-3 pt-3 border-t border-white/5">
            <p class="text-xs text-gray-500 font-mono">
              Last connected: {{ formatDate(server.lastConnected) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Server Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="font-mono text-lg">
                {{ editingServer ? 'Edit Server' : 'Add New Server' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-200">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>

            <form @submit.prevent="saveServer" class="modal-body">
              <!-- Server Name -->
              <div class="form-group">
                <label class="form-label">Server Name</label>
                <input v-model="formData.name" type="text" class="form-input" placeholder="Production Server"
                  required />
              </div>

              <!-- Host -->
              <div class="form-group">
                <label class="form-label">Host / IP Address</label>
                <input v-model="formData.host" type="text" class="form-input" placeholder="192.168.1.100 or example.com"
                  required />
              </div>

              <!-- Port -->
              <div class="form-group">
                <label class="form-label">SSH Port</label>
                <input v-model.number="formData.port" type="number" class="form-input" placeholder="22" min="1"
                  max="65535" />
              </div>

              <!-- Username -->
              <div class="form-group">
                <label class="form-label">Username</label>
                <input v-model="formData.username" type="text" class="form-input" placeholder="root" required />
              </div>

              <!-- Auth Method -->
              <div class="form-group">
                <label class="form-label">Authentication Method</label>
                <select v-model="formData.authMethod" class="form-input">
                  <option value="password">Password</option>
                  <option value="key">SSH Key</option>
                </select>
              </div>

              <!-- Password (if password auth) -->
              <div v-if="formData.authMethod === 'password'" class="form-group">
                <label class="form-label">Password</label>
                <input v-model="formData.password" type="password" class="form-input" placeholder="••••••••"
                  :required="formData.authMethod === 'password'" />
                <p class="form-hint">
                  🔒 Encrypted and stored securely in Firestore
                </p>
              </div>

              <!-- SSH Key (if key auth) -->
              <div v-if="formData.authMethod === 'key'" class="form-group">
                <label class="form-label">Private Key</label>
                <textarea v-model="formData.privateKey" class="form-input font-mono text-xs" rows="6"
                  placeholder="-----BEGIN OPENSSH PRIVATE KEY-----" :required="formData.authMethod === 'key'">
                </textarea>
                <p class="form-hint">
                  🔒 Encrypted and stored securely in Firestore
                </p>
              </div>

              <!-- Tags -->
              <div class="form-group">
                <label class="form-label">Tags (comma separated)</label>
                <input v-model="formData.tagsInput" type="text" class="form-input"
                  placeholder="production, oracle, discord-bot" />
              </div>

              <!-- Actions -->
              <div class="flex gap-3 mt-6">
                <button type="submit" class="btn-primary flex-1">
                  {{ editingServer ? 'Update Server' : 'Add Server' }}
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

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="deleteConfirm" class="modal-overlay" @click.self="deleteConfirm = null">
          <div class="modal-content max-w-md">
            <div class="modal-header">
              <h3 class="font-mono text-lg text-red-400">Delete Server</h3>
            </div>

            <div class="modal-body">
              <p class="text-gray-300 mb-4">
                Are you sure you want to delete
                <span class="font-mono text-emerald-400">{{ deleteConfirm?.name }}</span>?
              </p>
              <p class="text-sm text-gray-500">
                This will remove all saved credentials and command history for this server.
              </p>

              <div class="flex gap-3 mt-6">
                <button @click="deleteServer" class="btn-danger flex-1">
                  Delete Server
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
import { ServerIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useServers } from '@/composables/useServers'
import { encryptCredential } from '@/utils/crypto'

const emit = defineEmits(['serverSelected'])

// Get server management functions
const { addServer, updateServer, deleteServer: deleteServerFromDb, getServers } = useServers()

// State
const servers = ref([])
const selectedServerId = ref(null)
const showAddModal = ref(false)
const editingServer = ref(null)
const deleteConfirm = ref(null)

// Form data
const defaultFormData = {
  name: '',
  host: '',
  port: 22,
  username: '',
  authMethod: 'password',
  password: '',
  privateKey: '',
  tagsInput: '',
  tags: []
}

const formData = ref({ ...defaultFormData })

// Load servers on mount
onMounted(async () => {
  await loadServers()
})

// Load servers from Firestore
const loadServers = async () => {
  try {
    servers.value = await getServers()
  } catch (error) {
    console.error('Error loading servers:', error)
  }
}

// Select server
const selectServer = (server) => {
  selectedServerId.value = server.id
  emit('serverSelected', server)
}

// Edit server
const editServer = (server) => {
  editingServer.value = server
  formData.value = {
    ...server,
    tagsInput: server.tags?.join(', ') || '',
    password: '', // Don't load encrypted password
    privateKey: '' // Don't load encrypted key
  }
  showModal.value = true
}

// Save server (add or update)
const saveServer = async () => {
  try { 
    // Process tags
    const tags = formData.value.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
    
    const serverData = {
      name: formData.value.name,
      host: formData.value.host,
      port: formData.value.port || 22,
      username: formData.value.username,
      authMethod: formData.value.authMethod,
      tags
    }

    // Encrypt and add credentials
    // After encryption, make sure to REMOVE the old fields
    if (formData.value.authMethod === 'password') {
      if (!formData.value.password) {
        alert('Password is required!')
        return
      }
      serverData.encryptedPassword = encryptCredential(formData.value.password)
      // Remove key fields if switching from key to password
      delete serverData.encryptedKey
    } else {
      // SSH Key
      if (!formData.value.privateKey) {
        alert('Private key is required!')
        return
      }
      serverData.encryptedKey = encryptCredential(formData.value.privateKey)
      // Remove password fields if switching from password to key
      delete serverData.encryptedPassword
    }

    if (editingServer.value) {
      // Update existing
      await updateServer(editingServer.value.id, serverData)
    } else {
      // Add new
      await addServer(serverData)
    }

    await loadServers()
    closeModal()
  } catch (error) {
    console.error('Error saving server:', error)
    alert('Failed to save server. Check console for details.')
  }
}

// Delete server
const confirmDelete = (server) => {
  deleteConfirm.value = server
}

const deleteServer = async () => {
  try {
    await deleteServerFromDb(deleteConfirm.value.id)

    await loadServers()

    if (selectedServerId.value === deleteConfirm.value.id) {
      selectedServerId.value = null
    }

    deleteConfirm.value = null
  } catch (error) {
    console.error('Error deleting server:', error)
  }
}

// Close modal
const closeModal = () => {
  showAddModal.value = false
  editingServer.value = null
  formData.value = { ...defaultFormData }
}

// Format date
const formatDate = (date) => {
  if (!date) return 'Never'
  const d = date.toDate ? date.toDate() : new Date(date)
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24)),
    'day'
  )
}
</script>

<style scoped>
.server-manager {
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
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.server-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.server-card {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.server-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(16, 185, 129, 0.3);
}

.server-card.active {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.5);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.status-indicator.offline {
  background: #6b7280;
}

.status-indicator.unknown {
  background: #f59e0b;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: monospace;
  color: #10b981;
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