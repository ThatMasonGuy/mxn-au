<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Invoices</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Generate and manage your invoices.</p>
      </div>
      <router-link to="/professional/invoices/new" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium self-start sm:self-auto">
        <Plus :size="16" />
        New Invoice
      </router-link>
    </div>

    <!-- Summary Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">Total Invoiced</p>
        <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(totalInvoiced) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">Paid</p>
        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ currencySymbol }}{{ formatCurrency(totalPaid) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">Outstanding</p>
        <p class="text-lg font-bold text-orange-600 dark:text-orange-400">{{ currencySymbol }}{{ formatCurrency(totalOutstanding) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
        <p class="text-lg font-bold" :class="overdueCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'">{{ overdueCount }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <div class="flex-1">
        <div class="relative">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search invoices..."
            class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
        </div>
      </div>
      <select
        v-model="filterStatus"
        class="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="">All Statuses</option>
        <option value="draft">Draft</option>
        <option value="pending">Pending</option>
        <option value="sent">Sent</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <!-- Empty State -->
    <div v-if="filteredInvoices.length === 0" class="text-center py-16">
      <FileText :size="48" class="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p class="text-gray-500 dark:text-gray-400 mb-1">{{ searchQuery || filterStatus ? 'No matching invoices' : 'No invoices yet' }}</p>
      <router-link v-if="!searchQuery && !filterStatus" to="/professional/invoices/new" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
        Create your first invoice
      </router-link>
    </div>

    <!-- Mobile Cards -->
    <div v-else class="sm:hidden space-y-3">
      <div
        v-for="invoice in paginatedInvoices"
        :key="invoice.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer"
        @click="$router.push(`/professional/invoices/${invoice.id}`)"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="min-w-0 flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ invoice.invoiceNumber || 'Draft' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ invoice.clientName }}</p>
          </div>
          <div class="text-right ml-3">
            <p class="font-bold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(invoice.total) }}</p>
            <span class="inline-block text-xs px-1.5 py-0.5 rounded-full font-medium mt-0.5" :class="statusClass(invoice.status)">
              {{ invoice.status }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span>{{ formatDate(invoice.invoiceDate) }}</span>
          <span :class="isInvoiceOverdue(invoice) ? 'text-red-500 font-medium' : ''">
            Due: {{ formatDate(invoice.dueDate) }}
          </span>
        </div>
        <div class="flex justify-end gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            v-if="invoice.status === 'draft'"
            @click.stop="$router.push(`/professional/invoices/${invoice.id}/edit`)"
            class="text-xs text-blue-600 dark:text-blue-400"
          >Edit</button>
          <button @click.stop="confirmDelete(invoice)" class="text-xs text-red-500">Delete</button>
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div v-if="filteredInvoices.length > 0" class="hidden sm:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Invoice</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Client</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Due</th>
              <th class="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Amount</th>
              <th class="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th class="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="invoice in paginatedInvoices"
              :key="invoice.id"
              class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              @click="$router.push(`/professional/invoices/${invoice.id}`)"
            >
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                {{ invoice.invoiceNumber || 'Draft' }}
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ invoice.clientName }}</td>
              <td class="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ formatDate(invoice.invoiceDate) }}</td>
              <td class="px-4 py-3 whitespace-nowrap" :class="isInvoiceOverdue(invoice) ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'">
                {{ formatDate(invoice.dueDate) }}
              </td>
              <td class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                {{ currencySymbol }}{{ formatCurrency(invoice.total) }}
              </td>
              <td class="px-4 py-3 text-center">
                <span class="inline-flex text-xs px-2 py-0.5 rounded-full font-medium" :class="statusClass(invoice.status)">
                  {{ invoice.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-if="invoice.status === 'draft'"
                    @click="$router.push(`/professional/invoices/${invoice.id}/edit`)"
                    class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Pencil :size="14" />
                  </button>
                  <button
                    @click="confirmDelete(invoice)"
                    class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 px-1">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredInvoices.length) }} of {{ filteredInvoices.length }}
      </p>
      <div class="flex gap-1">
        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-300">Prev</button>
        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-300">Next</button>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteTarget" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete Invoice</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Delete invoice <strong>{{ deleteTarget.invoiceNumber }}</strong>? This cannot be undone.
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
import { ref, computed, onMounted, watch } from 'vue'
import { useMainStore } from '@/shared/stores/useMainStore'
import { useProfessionalStore } from '@/features/professional/stores/useProfessionalStore'
import { useToast } from '@/shared/components/ui/toast'
import {
  Plus, Search, FileText, Pencil, Trash2
} from 'lucide-vue-next'

const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const perPage = 15
const deleteTarget = ref(null)

const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')

const filteredInvoices = computed(() => {
  let list = [...professionalStore.sortedInvoices]

  if (filterStatus.value) {
    list = list.filter(inv => inv.status === filterStatus.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(inv =>
      (inv.invoiceNumber || '').toLowerCase().includes(q) ||
      (inv.clientName || '').toLowerCase().includes(q)
    )
  }

  return list
})

const totalInvoiced = computed(() => filteredInvoices.value.reduce((s, i) => s + (i.total || 0), 0))
const totalPaid = computed(() => filteredInvoices.value.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0))
const totalOutstanding = computed(() => filteredInvoices.value.filter(i => ['pending', 'sent', 'overdue'].includes(i.status)).reduce((s, i) => s + (i.total || 0), 0))
const overdueCount = computed(() => filteredInvoices.value.filter(i => i.status === 'overdue').length)

const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / perPage))
const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredInvoices.value.slice(start, start + perPage)
})

watch([searchQuery, filterStatus], () => { currentPage.value = 1 })

function isInvoiceOverdue(invoice) {
  if (invoice.status === 'overdue') return true
  if (invoice.status === 'paid' || invoice.status === 'cancelled' || invoice.status === 'draft') return false
  return invoice.dueDate && new Date(invoice.dueDate) < new Date()
}

function statusClass(status) {
  const map = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  }
  return map[status] || map.draft
}

function confirmDelete(invoice) { deleteTarget.value = invoice }

async function handleDelete() {
  if (!deleteTarget.value || !mainStore.user?.uid) return
  try {
    await professionalStore.deleteInvoice(mainStore.user.uid, deleteTarget.value.id)
    toast({ title: 'Deleted', description: 'Invoice deleted' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to delete invoice', variant: 'destructive' })
  }
  deleteTarget.value = null
}

function formatDate(date) {
  if (!date) return '—'
  try { return new Date(date).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' }) } catch { return '—' }
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(async () => {
  if (mainStore.user?.uid) {
    await professionalStore.fetchInvoices(mainStore.user.uid)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>