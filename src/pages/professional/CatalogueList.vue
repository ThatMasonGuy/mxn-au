<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Catalogue</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Your products and services.</p>
      </div>
      <router-link to="/professional/catalogue/new" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium self-start sm:self-auto">
        <Plus :size="16" />
        Add Item
      </router-link>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <div class="flex-1">
        <div class="relative">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search catalogue..."
            class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
        </div>
      </div>
      <select
        v-model="filterType"
        class="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="">All Types</option>
        <option value="product">Products</option>
        <option value="service">Services</option>
      </select>
    </div>

    <!-- Empty State -->
    <div v-if="filteredItems.length === 0" class="text-center py-16">
      <Package :size="48" class="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p class="text-gray-500 dark:text-gray-400 mb-1">{{ searchQuery || filterType ? 'No matching items' : 'No catalogue items yet' }}</p>
      <router-link v-if="!searchQuery && !filterType" to="/professional/catalogue/new" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
        Add your first item
      </router-link>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group"
      >
        <!-- Image -->
        <div
          class="relative h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center cursor-pointer"
          @click="$router.push(`/professional/catalogue/${item.id}/edit`)"
        >
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
          <Package v-else :size="40" class="text-gray-300 dark:text-gray-600" />

          <!-- Type Badge -->
          <span
            class="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium"
            :class="item.type === 'service'
              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
              : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'"
          >
            {{ item.type === 'service' ? 'Service' : 'Product' }}
          </span>
        </div>

        <!-- Details -->
        <div class="p-4">
          <h3
            class="font-semibold text-gray-900 dark:text-gray-100 truncate mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            @click="$router.push(`/professional/catalogue/${item.id}/edit`)"
          >
            {{ item.name }}
          </h3>
          <p v-if="item.description" class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {{ item.description }}
          </p>

          <div class="flex items-end justify-between">
            <div>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">
                {{ currencySymbol }}{{ formatCurrency(item.price) }}
              </p>
              <p v-if="item.unit" class="text-xs text-gray-500 dark:text-gray-400">per {{ item.unit }}</p>
            </div>
            <div v-if="item.sku" class="text-xs text-gray-400 dark:text-gray-500">
              {{ item.sku }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              @click="generateQuickLink(item)"
              class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              :title="!stripeConnected ? 'Connect Stripe first' : 'Generate payment link'"
            >
              <CreditCard :size="13" />
              Payment Link
            </button>
            <button
              @click="$router.push(`/professional/catalogue/${item.id}/edit`)"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Pencil :size="14" />
            </button>
            <button
              @click="confirmDelete(item)"
              class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteTarget" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete Item</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Delete "{{ deleteTarget.name }}"? This cannot be undone.
            </p>
            <div class="flex justify-end gap-3">
              <button @click="deleteTarget = null" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
              <button @click="handleDelete" class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Quick Link Created Toast (inline) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="quickLinkItem" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="quickLinkItem = null">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Generate Payment Link</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create a one-time payment link for <strong>{{ quickLinkItem.name }}</strong> ({{ currencySymbol }}{{ formatCurrency(quickLinkItem.price) }}).
            </p>

            <div v-if="!stripeConnected" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
              <p class="text-sm text-yellow-700 dark:text-yellow-400">
                Stripe is not connected. Connect it in
                <router-link to="/professional/company" class="underline font-medium" @click="quickLinkItem = null">Company Settings</router-link>
                first.
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (optional)</label>
              <Input v-model="quickLinkDescription" :placeholder="`Payment for ${quickLinkItem.name}`" />
            </div>

            <div class="flex justify-end gap-3">
              <button @click="quickLinkItem = null" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
              <button
                @click="createQuickLink"
                :disabled="!stripeConnected || creatingLink"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="creatingLink" :size="14" class="animate-spin" />
                Create Link
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import {
  Plus, Search, Package, CreditCard, Pencil, Trash2, Loader2
} from 'lucide-vue-next'

const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const searchQuery = ref('')
const filterType = ref('')
const deleteTarget = ref(null)
const quickLinkItem = ref(null)
const quickLinkDescription = ref('')
const creatingLink = ref(false)

const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')
const stripeConnected = computed(() => professionalStore.settings.stripeConnected)

const filteredItems = computed(() => {
  let list = [...professionalStore.sortedCatalogue]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(item =>
      (item.name || '').toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q) ||
      (item.sku || '').toLowerCase().includes(q)
    )
  }

  if (filterType.value) {
    list = list.filter(item => item.type === filterType.value)
  }

  return list
})

function confirmDelete(item) {
  deleteTarget.value = item
}

async function handleDelete() {
  if (!deleteTarget.value || !mainStore.user?.uid) return
  try {
    await professionalStore.deleteCatalogueItem(mainStore.user.uid, deleteTarget.value.id)
    toast({ title: 'Deleted', description: 'Catalogue item deleted' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to delete item', variant: 'destructive' })
  }
  deleteTarget.value = null
}

function generateQuickLink(item) {
  quickLinkItem.value = item
  quickLinkDescription.value = `Payment for ${item.name}`
}

async function createQuickLink() {
  if (!quickLinkItem.value || !mainStore.user?.uid) return
  creatingLink.value = true
  try {
    await professionalStore.createPaymentLink(mainStore.user.uid, {
      type: 'one_time',
      description: quickLinkDescription.value || `Payment for ${quickLinkItem.value.name}`,
      amount: quickLinkItem.value.price,
      currency: professionalStore.settings.currency || 'AUD',
      catalogueItemId: quickLinkItem.value.id,
      catalogueItemName: quickLinkItem.value.name
    })
    toast({ title: 'Created', description: 'Payment link request created. It will be available shortly.' })
    quickLinkItem.value = null
    quickLinkDescription.value = ''
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to create payment link', variant: 'destructive' })
  } finally {
    creatingLink.value = false
  }
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(async () => {
  if (mainStore.user?.uid) {
    await professionalStore.fetchCatalogue(mainStore.user.uid)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
