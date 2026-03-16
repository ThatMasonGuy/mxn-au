<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading -->
    <div v-if="!job" class="text-center py-16">
      <Loader2 :size="32" class="mx-auto mb-3 text-gray-400 animate-spin" />
      <p class="text-gray-500 dark:text-gray-400">Loading job...</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div class="flex items-start gap-3">
          <button @click="$router.push('/professional/jobs')" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 mt-0.5">
            <ArrowLeft :size="20" />
          </button>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{{ job.title }}</h1>
              <span class="inline-flex text-xs px-2 py-0.5 rounded-full font-medium" :class="statusClass(job.status)">
                {{ formatStatus(job.status) }}
              </span>
            </div>
            <p v-if="job.clientName" class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{{ job.clientName }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <select
            v-model="job.status"
            @change="updateStatus"
            class="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="active">Active</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <router-link
            :to="`/professional/jobs/${job.id}/edit`"
            class="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <Pencil :size="14" />
            Edit
          </router-link>
        </div>
      </div>

      <!-- Description -->
      <div v-if="job.description" class="professional-card mb-5">
        <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ job.description }}</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p class="text-xs text-gray-500 dark:text-gray-400">Budget</p>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ job.budget ? `${currencySymbol}${formatCurrency(job.budget)}` : '—' }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p class="text-xs text-gray-500 dark:text-gray-400">Total Expenses</p>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(totalExpenses) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p class="text-xs text-gray-500 dark:text-gray-400">Billable Amount</p>
          <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ currencySymbol }}{{ formatCurrency(billableTotal) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p class="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
          <p class="text-xl font-bold" :class="remaining >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'">
            {{ job.budget ? `${currencySymbol}${formatCurrency(remaining)}` : '—' }}
          </p>
        </div>
      </div>

      <!-- Dates -->
      <div v-if="job.startDate || job.dueDate" class="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
        <span v-if="job.startDate" class="flex items-center gap-1.5">
          <Calendar :size="14" /> Start: {{ job.startDate }}
        </span>
        <span v-if="job.dueDate" class="flex items-center gap-1.5" :class="isOverdue ? 'text-red-500 font-medium' : ''">
          <Calendar :size="14" /> Due: {{ job.dueDate }}
        </span>
      </div>

      <!-- Linked Expenses -->
      <div class="professional-card mb-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
            Expenses
            <span v-if="jobExpenses.length" class="text-sm font-normal text-gray-500">({{ jobExpenses.length }})</span>
          </h2>
          <router-link
            :to="`/professional/expenses/new?jobId=${job.id}`"
            class="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
          >
            <Plus :size="14" />
            Add Expense
          </router-link>
        </div>

        <div v-if="jobExpenses.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
          <Receipt :size="32" class="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p class="text-sm">No expenses linked to this job</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="expense in jobExpenses"
            :key="expense.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
            @click="$router.push(`/professional/expenses/${expense.id}/edit`)"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ expense.description }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ expense.date }}</span>
                <span v-if="expense.category" class="text-xs text-gray-400">· {{ expense.category }}</span>
              </div>
            </div>
            <div class="text-right ml-3 flex-shrink-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(expense.amount) }}</p>
              <div class="flex items-center justify-end gap-1 mt-0.5">
                <span v-if="expense.billable" class="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                  Bill {{ expense.markupPercent ? `+${expense.markupPercent}%` : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Linked Invoices -->
      <div class="professional-card mb-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
            Invoices
            <span v-if="jobInvoices.length" class="text-sm font-normal text-gray-500">({{ jobInvoices.length }})</span>
          </h2>
          <router-link
            :to="`/professional/invoices/new?jobId=${job.id}`"
            class="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
          >
            <Plus :size="14" />
            Create Invoice
          </router-link>
        </div>

        <div v-if="jobInvoices.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
          <FileText :size="32" class="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p class="text-sm">No invoices linked to this job</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="invoice in jobInvoices"
            :key="invoice.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
            @click="$router.push(`/professional/invoices/${invoice.id}`)"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ invoice.invoiceNumber || 'Draft' }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ invoice.clientName }}</p>
            </div>
            <div class="text-right ml-3 flex-shrink-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(invoice.total) }}</p>
              <span class="inline-block text-xs px-1.5 py-0.5 rounded-full font-medium" :class="invoiceStatusClass(invoice.status)">
                {{ invoice.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Internal Notes -->
      <div v-if="job.notes" class="professional-card mb-5">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Internal Notes</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ job.notes }}</p>
      </div>

      <!-- Danger Zone -->
      <div class="professional-card border-red-200 dark:border-red-800/50">
        <h2 class="text-base font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Deleting a job will not delete its linked expenses or invoices.</p>
        <button
          @click="showDeleteConfirm = true"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 :size="14" />
          Delete Job
        </button>
      </div>
    </template>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showDeleteConfirm = false">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete Job</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Delete "{{ job?.title }}"? Linked expenses and invoices will not be affected.
            </p>
            <div class="flex justify-end gap-3">
              <button @click="showDeleteConfirm = false" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
              <button @click="handleDelete" class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/shared/stores/useMainStore'
import { useProfessionalStore } from '@/features/professional/stores/useProfessionalStore'
import { useToast } from '@/shared/components/ui/toast'
import {
  ArrowLeft, Pencil, Plus, Trash2, Calendar, Receipt, FileText, Loader2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const job = ref(null)
const showDeleteConfirm = ref(false)

const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')

const jobExpenses = computed(() => {
  if (!job.value) return []
  return professionalStore.getExpensesForJob(job.value.id)
})

const jobInvoices = computed(() => {
  if (!job.value) return []
  return professionalStore.getInvoicesForJob(job.value.id)
})

const totalExpenses = computed(() => {
  return jobExpenses.value.reduce((s, e) => s + (e.amount || 0), 0)
})

const billableTotal = computed(() => {
  if (!job.value) return 0
  return professionalStore.getJobBillableTotal(job.value.id)
})

const remaining = computed(() => {
  if (!job.value?.budget) return 0
  return job.value.budget - totalExpenses.value
})

const isOverdue = computed(() => {
  if (!job.value?.dueDate || job.value.status === 'completed' || job.value.status === 'cancelled') return false
  return new Date(job.value.dueDate) < new Date()
})

async function updateStatus() {
  if (!mainStore.user?.uid || !job.value) return
  try {
    await professionalStore.updateJob(mainStore.user.uid, job.value.id, { status: job.value.status })
    toast({ title: 'Updated', description: 'Job status updated' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' })
  }
}

async function handleDelete() {
  if (!mainStore.user?.uid || !job.value) return
  try {
    await professionalStore.deleteJob(mainStore.user.uid, job.value.id)
    toast({ title: 'Deleted', description: 'Job deleted' })
    router.push('/professional/jobs')
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to delete job', variant: 'destructive' })
  }
  showDeleteConfirm.value = false
}

function statusClass(status) {
  const map = {
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    in_progress: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
    on_hold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  }
  return map[status] || map.active
}

function invoiceStatusClass(status) {
  const map = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  }
  return map[status] || map.draft
}

function formatStatus(status) {
  return (status || 'active').replace(/_/g, ' ')
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(async () => {
  if (!mainStore.user?.uid) return

  await Promise.all([
    professionalStore.fetchJobs(mainStore.user.uid),
    professionalStore.fetchExpenses(mainStore.user.uid),
    professionalStore.fetchInvoices(mainStore.user.uid)
  ])

  job.value = professionalStore.jobs.find(j => j.id === route.params.id)

  if (!job.value) {
    toast({ title: 'Not found', description: 'Job not found', variant: 'destructive' })
    router.push('/professional/jobs')
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
