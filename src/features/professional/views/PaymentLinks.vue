<template>
    <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Payment Links</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">Create and manage Stripe payment links.</p>
        </div>
        <button
          @click="showCreateDialog = true"
          :disabled="!stripeConnected"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus :size="16" />
          New Link
        </button>
      </div>
  
      <!-- Stripe Not Connected Banner -->
      <div v-if="!stripeConnected" class="mb-5 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex items-center gap-2 flex-1">
          <AlertCircle :size="18" class="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <p class="text-sm text-yellow-700 dark:text-yellow-400">
            Stripe is not connected. Connect your Stripe account in Company Settings to create payment links.
          </p>
        </div>
        <router-link
          to="/professional/company"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/60 transition-colors whitespace-nowrap"
        >
          <Settings :size="14" />
          Connect Stripe
        </router-link>
      </div>
  
      <!-- Summary -->
      <div v-if="paymentLinks.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <p class="text-xs text-gray-500 dark:text-gray-400">Total Links</p>
          <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ paymentLinks.length }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <p class="text-xs text-gray-500 dark:text-gray-400">Active</p>
          <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ activeCount }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <p class="text-xs text-gray-500 dark:text-gray-400">Total Value</p>
          <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(totalValue) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <p class="text-xs text-gray-500 dark:text-gray-400">Completed</p>
          <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ completedCount }}</p>
        </div>
      </div>
  
      <!-- Empty State -->
      <div v-if="paymentLinks.length === 0" class="text-center py-16">
        <CreditCard :size="48" class="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <p class="text-gray-500 dark:text-gray-400 mb-1">No payment links yet</p>
        <button
          v-if="stripeConnected"
          @click="showCreateDialog = true"
          class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Create your first payment link
        </button>
      </div>
  
      <!-- Links List -->
      <div v-else class="space-y-3">
        <div
          v-for="link in sortedLinks"
          :key="link.id"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ link.description }}</h3>
                <span class="inline-flex text-xs px-2 py-0.5 rounded-full font-medium" :class="linkStatusClass(link.status)">
                  {{ formatLinkStatus(link.status) }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-3 text-sm">
                <span class="font-bold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(link.amount) }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ link.currency || 'AUD' }}</span>
                <span v-if="link.type" class="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{{ link.type }}</span>
                <span v-if="link.catalogueItemName" class="text-xs text-gray-500 dark:text-gray-400">· {{ link.catalogueItemName }}</span>
              </div>
              <p v-if="link.createdAt" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Created {{ formatDate(link.createdAt) }}
              </p>
            </div>
  
            <!-- Actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <!-- Copy URL -->
              <button
                v-if="link.url"
                @click="copyUrl(link)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                :title="copiedId === link.id ? 'Copied!' : 'Copy link'"
              >
                <Check v-if="copiedId === link.id" :size="14" class="text-emerald-500" />
                <Copy v-else :size="14" />
                {{ copiedId === link.id ? 'Copied' : 'Copy' }}
              </button>
  
              <!-- Open -->
              <a
                v-if="link.url"
                :href="link.url"
                target="_blank"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink :size="14" />
                Open
              </a>
  
              <!-- Pending spinner -->
              <span v-if="link.status === 'pending_creation'" class="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Loader2 :size="14" class="animate-spin" />
                Creating...
              </span>
  
              <!-- Delete -->
              <button
                @click="confirmDelete(link)"
                class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create Dialog -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="showCreateDialog" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showCreateDialog = false">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">New Payment Link</h3>
  
              <form @submit.prevent="handleCreate" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <input
                    v-model="createForm.description"
                    type="text"
                    required
                    placeholder="What is this payment for?"
                    class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
  
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount *</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{{ currencySymbol }}</span>
                      <input
                        v-model.number="createForm.amount"
                        type="number"
                        min="0.50"
                        step="0.01"
                        required
                        placeholder="0.00"
                        class="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                    <select
                      v-model="createForm.currency"
                      class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="AUD">AUD</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="EUR">EUR</option>
                      <option value="NZD">NZD</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    v-model="createForm.type"
                    class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="one_time">One-time payment</option>
                    <option value="recurring">Recurring / Subscription</option>
                  </select>
                </div>
  
                <!-- Catalogue Item Link -->
                <div v-if="professionalStore.catalogue.length">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link to Catalogue Item</label>
                  <select
                    v-model="createForm.catalogueItemId"
                    @change="onCatalogueSelect"
                    class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">None</option>
                    <option v-for="item in professionalStore.catalogue" :key="item.id" :value="item.id">
                      {{ item.name }} — {{ currencySymbol }}{{ formatCurrency(item.price) }}
                    </option>
                  </select>
                </div>
  
                <div class="flex justify-end gap-3 pt-2">
                  <button type="button" @click="showCreateDialog = false" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="creating"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Loader2 v-if="creating" :size="14" class="animate-spin" />
                    <CreditCard v-else :size="14" />
                    Create Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>
  
      <!-- Delete Confirmation -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="deleteTarget" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete Payment Link</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-5">
                Delete "{{ deleteTarget.description }}"? The Stripe link will no longer work.
              </p>
              <div class="flex justify-end gap-3">
                <button @click="deleteTarget = null" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
                <button @click="handleDelete" class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useMainStore } from '@/shared/stores/useMainStore'
  import { useProfessionalStore } from '@/features/professional/stores/useProfessionalStore'
  import { useToast } from '@/shared/components/ui/toast'
  import {
    Plus, CreditCard, Copy, Check, ExternalLink, Trash2, Loader2, AlertCircle, Settings
  } from 'lucide-vue-next'
  
  const mainStore = useMainStore()
  const professionalStore = useProfessionalStore()
  const { toast } = useToast()
  
  const showCreateDialog = ref(false)
  const creating = ref(false)
  const deleteTarget = ref(null)
  const copiedId = ref(null)
  
  const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')
  const stripeConnected = computed(() => professionalStore.settings.stripeConnected)
  const paymentLinks = computed(() => professionalStore.paymentLinks || [])
  
  const sortedLinks = computed(() => {
    return [...paymentLinks.value].sort((a, b) => {
      const da = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
      const db = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
      return db - da
    })
  })
  
  const activeCount = computed(() => paymentLinks.value.filter(l => l.status === 'active').length)
  const completedCount = computed(() => paymentLinks.value.filter(l => l.status === 'completed').length)
  const totalValue = computed(() => paymentLinks.value.reduce((s, l) => s + (l.amount || 0), 0))
  
  const createForm = reactive({
    description: '',
    amount: null,
    currency: professionalStore.settings.currency || 'AUD',
    type: 'one_time',
    catalogueItemId: '',
    catalogueItemName: ''
  })
  
  function onCatalogueSelect() {
    if (createForm.catalogueItemId) {
      const item = professionalStore.catalogue.find(i => i.id === createForm.catalogueItemId)
      if (item) {
        createForm.description = `Payment for ${item.name}`
        createForm.amount = item.price
        createForm.catalogueItemName = item.name
      }
    } else {
      createForm.catalogueItemName = ''
    }
  }
  
  async function handleCreate() {
    if (!mainStore.user?.uid) return
    creating.value = true
    try {
      await professionalStore.createPaymentLink(mainStore.user.uid, {
        description: createForm.description,
        amount: createForm.amount,
        currency: createForm.currency,
        type: createForm.type,
        catalogueItemId: createForm.catalogueItemId || '',
        catalogueItemName: createForm.catalogueItemName || ''
      })
      toast({ title: 'Created', description: 'Payment link request created. It will be ready shortly.' })
      showCreateDialog.value = false
      // Reset form
      createForm.description = ''
      createForm.amount = null
      createForm.catalogueItemId = ''
      createForm.catalogueItemName = ''
      createForm.type = 'one_time'
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create payment link', variant: 'destructive' })
    } finally {
      creating.value = false
    }
  }
  
  async function copyUrl(link) {
    if (!link.url) return
    try {
      await navigator.clipboard.writeText(link.url)
      copiedId.value = link.id
      setTimeout(() => { copiedId.value = null }, 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = link.url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      copiedId.value = link.id
      setTimeout(() => { copiedId.value = null }, 2000)
    }
  }
  
  function confirmDelete(link) { deleteTarget.value = link }
  
  async function handleDelete() {
    if (!deleteTarget.value || !mainStore.user?.uid) return
    try {
      await professionalStore.deletePaymentLink(mainStore.user.uid, deleteTarget.value.id)
      toast({ title: 'Deleted', description: 'Payment link deleted' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete payment link', variant: 'destructive' })
    }
    deleteTarget.value = null
  }
  
  function linkStatusClass(status) {
    const map = {
      pending_creation: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
      active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
      expired: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
      failed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    }
    return map[status] || map.pending_creation
  }
  
  function formatLinkStatus(status) {
    const map = {
      pending_creation: 'Creating',
      active: 'Active',
      completed: 'Paid',
      expired: 'Expired',
      failed: 'Failed',
    }
    return map[status] || status
  }
  
  function formatDate(date) {
    if (!date) return ''
    try {
      const d = date.toDate ? date.toDate() : new Date(date)
      return d.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch { return '' }
  }
  
  function formatCurrency(value) {
    return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  
  onMounted(async () => {
    if (mainStore.user?.uid) {
      await Promise.all([
        professionalStore.fetchPaymentLinks(mainStore.user.uid),
        professionalStore.catalogue.length ? null : professionalStore.fetchCatalogue(mainStore.user.uid)
      ])
    }
  })
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }
  </style>