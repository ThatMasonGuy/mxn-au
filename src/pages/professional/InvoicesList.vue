<template>
  <div class="p-8 bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Invoices</h1>
        <p class="text-gray-400">Generate and manage your invoices.</p>
      </div>
      <router-link to="/professional/invoices/new"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
        <Plus :size="20" />
        New Invoice
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 mb-6">
      <div class="flex gap-4">
        <div class="flex-1 relative">
          <Search :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input v-model="searchQuery" placeholder="Search invoices..."
            class="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20" />
        </div>
        <Select v-model="filterStatus">
          <SelectTrigger
            class="w-48 bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent class="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="all" class="focus:bg-gray-700">All Status</SelectItem>
            <SelectItem value="draft" class="focus:bg-gray-700">Draft</SelectItem>
            <SelectItem value="pending" class="focus:bg-gray-700">Pending</SelectItem>
            <SelectItem value="paid" class="focus:bg-gray-700">Paid</SelectItem>
            <SelectItem value="overdue" class="focus:bg-gray-700">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Invoices List -->
    <div class="bg-gray-900 rounded-xl shadow-xl border border-gray-800 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <Loader2 :size="48" class="animate-spin text-gray-600 mx-auto mb-4" />
        <p class="text-gray-500">Loading invoices...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredInvoices.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <FileText :size="32" class="text-gray-600" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">
          {{ searchQuery || filterStatus !== 'all' ? 'No invoices found' : 'No invoices yet' }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ searchQuery || filterStatus !== 'all'
            ? 'Try adjusting your search or filters'
            : 'Create your first invoice to get started'
          }}
        </p>
        <router-link v-if="!searchQuery && filterStatus === 'all'" to="/professional/invoices/new"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus :size="20" />
          New Invoice
        </router-link>
      </div>

      <!-- Invoices Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800/50 border-b border-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Invoice #
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Due Date
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="invoice in paginatedInvoices" :key="invoice.id"
              class="hover:bg-gray-800/50 cursor-pointer transition-colors group" @click="viewInvoice(invoice.id)">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-white">{{ invoice.invoiceNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{{ invoice.clientName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatDate(invoice.invoiceDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatDate(invoice.dueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-semibold text-white">${{ formatCurrency(invoice.total) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2.5 py-1 text-xs font-medium rounded-full border"
                  :class="getStatusClass(invoice.status)">
                  {{ invoice.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  @click.stop>
                  <button @click="viewInvoice(invoice.id)"
                    class="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="View">
                    <Eye :size="16" />
                  </button>
                  <button v-if="invoice.status === 'draft'" @click="editInvoice(invoice.id)"
                    class="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                    title="Edit">
                    <Pencil :size="16" />
                  </button>
                  <button @click="confirmDelete(invoice)"
                    class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1"
        class="px-6 py-4 border-t border-gray-800 flex items-center justify-between bg-gray-800/30">
        <p class="text-sm text-gray-400">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredInvoices.length) }} of {{
            filteredInvoices.length }} invoices
        </p>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Previous
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="px-3 py-1.5 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog :open="deleteDialog.open" @update:open="deleteDialog.open = $event">
      <AlertDialogContent class="bg-gray-900 border-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-white">Delete Invoice</AlertDialogTitle>
          <AlertDialogDescription class="text-gray-400">
            Are you sure you want to delete invoice <strong class="text-white">{{ deleteDialog.invoice?.invoiceNumber
              }}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleDelete" class="bg-red-600 hover:bg-red-700 text-white">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/toast'
import { Plus, Search, FileText, Eye, Pencil, Trash2, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const loading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

const deleteDialog = ref({
  open: false,
  invoice: null
})

onMounted(async () => {
  if (mainStore.user?.uid) {
    loading.value = true
    try {
      await professionalStore.fetchInvoices(mainStore.user.uid)
    } catch (error) {
      console.error('Error loading invoices:', error)
      toast({
        title: 'Error',
        description: 'Failed to load invoices',
        variant: 'destructive'
      })
    } finally {
      loading.value = false
    }
  }
})

const filteredInvoices = computed(() => {
  let invoices = professionalStore.sortedInvoices

  if (filterStatus.value !== 'all') {
    invoices = invoices.filter(inv => inv.status === filterStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    invoices = invoices.filter(inv =>
      inv.invoiceNumber?.toLowerCase().includes(query) ||
      inv.clientName?.toLowerCase().includes(query)
    )
  }

  return invoices
})

const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)
const paginatedInvoices = computed(() =>
  filteredInvoices.value.slice(startIndex.value, endIndex.value)
)

watch([searchQuery, filterStatus], () => {
  currentPage.value = 1
})

function formatDate(date) {
  if (!date) return '—'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return '—'
  }
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function getStatusClass(status) {
  const classes = {
    paid: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
  return classes[status] || classes.draft
}

function viewInvoice(id) {
  router.push(`/professional/invoices/${id}`)
}

function editInvoice(id) {
  router.push(`/professional/invoices/${id}/edit`)
}

function confirmDelete(invoice) {
  deleteDialog.value = {
    open: true,
    invoice
  }
}

async function handleDelete() {
  if (!mainStore.user?.uid || !deleteDialog.value.invoice) return

  try {
    await professionalStore.deleteInvoice(mainStore.user.uid, deleteDialog.value.invoice.id)
    toast({
      title: 'Success',
      description: 'Invoice deleted successfully'
    })
    deleteDialog.value = { open: false, invoice: null }
  } catch (error) {
    console.error('Error deleting invoice:', error)
    toast({
      title: 'Error',
      description: 'Failed to delete invoice',
      variant: 'destructive'
    })
  }
}
</script>